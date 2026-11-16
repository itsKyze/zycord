/*
	Zycord: Communication platform by Zyron Solutions Ltd.
	Copyright (C) 2026 Zyron Solutions Ltd

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published
	by the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
*/

import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import { Raw } from "typeorm";
import { route } from "@spacebar/api/middlewares";
import { RecoveryEmail, emitUserUpdate, passwordMismatch } from "@spacebar/api/util";
import { User } from "@spacebar/database";
import { FieldErrors } from "@spacebar/util";

const router = Router({ mergeParams: true });

const checkPassword = async (user_id: string, password: unknown) => {
    const user = await User.findOneOrFail({ where: { id: user_id }, select: { id: true, data: true } });
    if (user.data?.hash && !(typeof password === "string" && (await bcrypt.compare(password, user.data.hash)))) {
        throw passwordMismatch();
    }
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get("/", route({ responses: { 200: {} } }), async (req: Request, res: Response) => {
    const user = await User.findOneOrFail({ where: { id: req.user_id }, select: { id: true, data: true } });
    const recoveryEmail = (user.data as { recovery_email?: string })?.recovery_email;
    res.json({
        recovery_email: recoveryEmail ? RecoveryEmail.redact(recoveryEmail) : null,
        has_recovery_email: !!recoveryEmail,
    });
});

router.post("/send-code", route({ responses: { 204: {}, 400: {} } }), async (req: Request, res: Response) => {
    const { email } = req.body as { email?: string };
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
        throw FieldErrors({ email: { code: "EMAIL_INVALID", message: "Invalid email address format." } });
    }

    const normalized = email.trim().toLowerCase();
    const user = await User.findOneOrFail({ where: { id: req.user_id }, select: { id: true, username: true, email: true, data: true } });

    // 1. Cannot be the same as current primary email
    if (user.email && user.email.toLowerCase() === normalized) {
        throw FieldErrors({ email: { code: "EMAIL_ALREADY_REGISTERED", message: "This email is already in use on your account as your primary email." } });
    }

    // 2. Cannot be the exact same recovery email that is already linked
    const currentRecovery = (user.data as { recovery_email?: string })?.recovery_email;
    if (currentRecovery && currentRecovery.toLowerCase() === normalized) {
        throw FieldErrors({ email: { code: "EMAIL_ALREADY_REGISTERED", message: "This email is already set as your backup email." } });
    }

    // 3. Security check: cannot be registered by another user as primary email
    const primaryExists = await User.findOne({
        where: { email: Raw((alias) => `LOWER(${alias}) = :email`, { email: normalized }) },
        select: { id: true },
    });
    if (primaryExists && primaryExists.id !== user.id) {
        throw FieldErrors({ email: { code: "EMAIL_ALREADY_REGISTERED", message: "This email address is already in use by another account." } });
    }

    // 4. Security check: cannot be linked by another user as recovery email
    const recoveryExists = await User.findOne({
        where: { data: Raw((alias) => `LOWER(${alias} ->> 'recovery_email') = :email`, { email: normalized }) },
        select: { id: true },
    });
    if (recoveryExists && recoveryExists.id !== user.id) {
        throw FieldErrors({ email: { code: "EMAIL_ALREADY_REGISTERED", message: "This email address is already registered as a recovery email for another account." } });
    }

    const sent = await RecoveryEmail.sendVerification(user.id, user.username, normalized);
    if (!sent) {
        throw FieldErrors({ email: { code: "EMAIL_DELIVERY_FAILED", message: "Failed to send verification email. Please check the address and try again." } });
    }

    res.sendStatus(204);
});

router.post("/verify", route({ responses: { 200: {}, 400: {} } }), async (req: Request, res: Response) => {
    const { email, code, password } = req.body as { email?: string; code?: string; password?: string };
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
        throw FieldErrors({ email: { code: "EMAIL_INVALID", message: "Invalid email address format." } });
    }
    if (!code || typeof code !== "string") {
        throw FieldErrors({ code: { code: "CODE_REQUIRED", message: "Verification code is required." } });
    }

    const normalized = email.trim().toLowerCase();
    const verified = RecoveryEmail.verify(req.user_id, normalized, code);
    if (!verified) {
        throw FieldErrors({ code: { code: "INVALID_CODE", message: "Invalid or expired verification code." } });
    }

    if (password) {
        await checkPassword(req.user_id, password);
    }

    const user = await User.findOneOrFail({ where: { id: req.user_id }, select: { id: true, data: true } });
    const existingData = (user.data || {}) as Record<string, unknown>;
    existingData.recovery_email = normalized;

    await User.update({ id: user.id }, { data: existingData as any });
    await emitUserUpdate(user.id);

    res.json({
        success: true,
        recovery_email: RecoveryEmail.redact(normalized),
    });
});

router.delete("/", route({ responses: { 204: {}, 400: {} } }), async (req: Request, res: Response) => {
    const { password } = req.body as { password?: string };
    await checkPassword(req.user_id, password);

    const user = await User.findOneOrFail({ where: { id: req.user_id }, select: { id: true, data: true } });
    const existingData = (user.data || {}) as Record<string, unknown>;
    delete existingData.recovery_email;

    await User.update({ id: user.id }, { data: existingData as any });
    await emitUserUpdate(user.id);

    res.sendStatus(204);
});

export default router;
