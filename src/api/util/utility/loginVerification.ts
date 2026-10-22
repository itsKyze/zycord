import crypto from "node:crypto";
import { Request } from "express";
import { User, TrustedLoginDevice } from "@spacebar/database";
import { Email, FieldErrors } from "@spacebar/util";

const DEVICE_IDLE_MS = 24 * 60 * 60 * 1000;
const VERIFY_EMAIL_COOLDOWN_MS = 10 * 60 * 1000;

export function normalizeIp(ip?: string | null) {
    if (!ip) return "";
    const value = ip.split(",")[0].trim().replace(/^::ffff:/i, "");
    if (value === "::1") return "127.0.0.1";
    return value;
}

export function requestIp(req: Request) {
    const forwarded = req.headers["cf-connecting-ip"] ?? req.headers["x-forwarded-for"];
    const header = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return normalizeIp(typeof header === "string" ? header : req.ip);
}

function uaFingerprint(ua: string) {
    return crypto.createHash("sha256").update(ua).digest("hex").slice(0, 12);
}

export function describeLoginDevice(req: Request): TrustedLoginDevice {
    const ua = String(req.headers["user-agent"] ?? "");
    let os = "Unknown";
    if (/Windows/i.test(ua)) os = "Windows";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/iPad/i.test(ua)) os = "iPadOS";
    else if (/iPhone|iOS/i.test(ua)) os = "iOS";
    else if (/Mac OS X|Macintosh/i.test(ua)) os = "macOS";
    else if (/CrOS/i.test(ua)) os = "ChromeOS";
    else if (/Linux/i.test(ua)) os = "Linux";

    let client = "Browser";
    if (/ZycordMobile/i.test(ua)) client = "Zycord";
    else if (/Electron/i.test(ua)) client = "Zycord";
    else if (/Edg\//i.test(ua)) client = "Edge";
    else if (/OPR\/|Opera/i.test(ua)) client = "Opera";
    else if (/Chrome\//i.test(ua)) client = "Chrome";
    else if (/Firefox\//i.test(ua)) client = "Firefox";
    else if (/Safari/i.test(ua)) client = "Safari";

    const kind: TrustedLoginDevice["kind"] = /Android|iPhone|iPad|Mobile|ZycordMobile/i.test(ua) ? "mobile" : "desktop";
    const fingerprint = uaFingerprint(ua);
    return {
        key: `${kind}|${os}|${client}|${fingerprint}`,
        label: `${client} on ${os}`,
        kind,
        os,
        client,
        ip: requestIp(req),
        last_seen: Date.now(),
    };
}

function deviceFromClaim(claimed: { ip?: string; device?: string; label?: string }, fallback: TrustedLoginDevice): TrustedLoginDevice {
    const [kind, os, client] = (claimed.device || fallback.key).split("|");
    const safeKind: TrustedLoginDevice["kind"] = kind === "mobile" ? "mobile" : "desktop";
    return {
        key: claimed.device || fallback.key,
        label: claimed.label || fallback.label,
        kind: safeKind,
        os: os || fallback.os,
        client: client || fallback.client,
        ip: normalizeIp(claimed.ip) || fallback.ip,
        last_seen: Date.now(),
    };
}

export async function rememberTrustedDevice(userId: string, device: TrustedLoginDevice) {
    const ip = normalizeIp(device.ip);
    if (!device.key || !ip) return;
    const user = await User.findOne({ where: { id: userId }, select: { id: true, data: true } });
    if (!user?.data) return;
    const nextDevice = { ...device, ip, last_seen: Date.now() };
    const devices = (user.data.trusted_devices ?? []).filter((entry) => entry.key !== nextDevice.key && !nextDevice.key.startsWith(`${entry.key}|`));
    const ips = (user.data.authorized_ips ?? []).map((entry) => normalizeIp(entry)).filter(Boolean);
    await User.update(
        { id: userId },
        {
            data: {
                ...user.data,
                authorized_ips: ips.includes(ip) ? ips : [...ips, ip].slice(-30),
                trusted_devices: [...devices, nextDevice].slice(-30),
            },
        },
    );
}

export async function authorizeLoginDevice(userId: string, req: Request, claimed?: { ip?: string; device?: string; label?: string }) {
    await rememberTrustedDevice(userId, deviceFromClaim(claimed ?? {}, describeLoginDevice(req)));
}

function recentlyEmailed(user: { data?: User["data"] }, deviceKey: string) {
    const sentAt = user.data?.login_verify_sent?.[deviceKey] ?? 0;
    return sentAt > 0 && Date.now() - sentAt < VERIFY_EMAIL_COOLDOWN_MS;
}

async function markVerifyEmailSent(userId: string, deviceKey: string) {
    const user = await User.findOne({ where: { id: userId }, select: { id: true, data: true } });
    if (!user?.data) return;
    await User.update(
        { id: userId },
        {
            data: {
                ...user.data,
                login_verify_sent: {
                    ...(user.data.login_verify_sent ?? {}),
                    [deviceKey]: Date.now(),
                },
            },
        },
    );
}

async function resolveLocation(req: Request, ip: string) {
    let city = (req.headers["cf-ipcity"] as string) || "";
    let region = (req.headers["cf-region"] as string) || "";
    const country = (req.headers["cf-ipcountry"] as string) || "";

    if (!city && ip && ip !== "127.0.0.1" && ip !== "::1" && !ip.startsWith("192.168.") && !ip.startsWith("10.")) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 1200);
            const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, { signal: controller.signal });
            clearTimeout(timeout);
            if (res.ok) {
                const data = (await res.json()) as any;
                if (data && data.success !== false) {
                    city = data.city || city;
                    region = data.region || region;
                }
            }
        } catch {
            // Ignore error or timeout, will fallback to country code
        }
    }

    return {
        city: city || "",
        region: region || "",
        country_name: country || "",
    };
}

async function challengeNewDevice(
    req: Request,
    user: Pick<User, "id" | "email"> & { username?: string; discriminator?: string; data?: User["data"] },
    device: TrustedLoginDevice,
    idle: boolean,
) {
    if (user.email && !recentlyEmailed(user, device.key)) {
        if (!user.username) {
            const freshUser = await User.findOne({ where: { id: user.id }, select: { id: true, username: true, discriminator: true } });
            if (freshUser?.username) {
                user.username = freshUser.username;
                user.discriminator = freshUser.discriminator;
            }
        }

        const loc = await resolveLocation(req, device.ip);

        await Email.sendNewLoginLocation(user as User, user.email, {
            ip: device.ip || "127.0.0.1",
            city: loc.city,
            region: loc.region,
            country_name: loc.country_name,
            device: device.label,
            deviceKey: device.key,
        }).catch((e) => {
            console.error(`[Login] Failed to send new login location email to ${user.id}:`, e);
            return false;
        });
        await markVerifyEmailSent(user.id, device.key).catch((e) => console.error(`[Login] Failed to record verify email for ${user.id}:`, e));
    }

    throw FieldErrors({
        login: {
            code: "ACCOUNT_LOGIN_VERIFICATION_EMAIL",
            message: idle
                ? "We haven't seen this device in a while. Check your e-mail to verify it's you."
                : "New login from a phone or computer. Check the e-mail on this account to verify it's you.",
        },
    });
}

export async function gateNewLoginLocation(
    req: Request,
    user: Pick<User, "id" | "email" | "verified"> & { username?: string; discriminator?: string; data?: User["data"] },
) {
    const device = describeLoginDevice(req);
    if (!user.email || !user.verified) {
        if (device.ip) await rememberTrustedDevice(user.id, device).catch((e) => console.error(`[Login] Failed to remember device for ${user.id}:`, e));
        return;
    }

    const devices = user.data?.trusted_devices ?? [];
    const match = devices.find((entry) => entry.key === device.key || device.key.startsWith(`${entry.key}|`));
    const samePlace = !!match && normalizeIp(match.ip) === device.ip;
    const idle = !!match && Date.now() - (match.last_seen || 0) > DEVICE_IDLE_MS;
    const firstDevice = devices.length === 0;

    if (firstDevice) {
        if (device.ip) await rememberTrustedDevice(user.id, device).catch((e) => console.error(`[Login] Failed to remember device for ${user.id}:`, e));
        return;
    }

    if (!match || !samePlace || idle) {
        await challengeNewDevice(req, user, device, idle && !!match);
    }

    if (device.ip) await rememberTrustedDevice(user.id, device).catch((e) => console.error(`[Login] Failed to remember device for ${user.id}:`, e));
}
