/*
	Zycord: Communication platform by Zyron Solutions Ltd.
	Copyright (C) 2026 Zyron Solutions Ltd

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published
	by the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Request, Response, Router } from "express";
import { route } from "@spacebar/api/middlewares";
import { User } from "@spacebar/database";

const router = Router({ mergeParams: true });

router.get("/", route({ responses: { 200: {} } }), async (req: Request, res: Response) => {
	const user = await User.findOneOrFail({
		where: { id: req.user_id },
		select: { id: true, account_preferences: true },
	});
	const badgeSettings = (user.account_preferences as Record<string, unknown> | null)?.badge_settings as {
		badge_display_order?: number[];
		hidden_badges?: number[];
	} | undefined;

	return res.json({
		badge_display_order: badgeSettings?.badge_display_order ?? [],
		hidden_badges: badgeSettings?.hidden_badges ?? [],
	});
});

router.patch("/", route({ responses: { 200: {} } }), async (req: Request, res: Response) => {
	const body = req.body as {
		badge_display_order?: number[];
		display_order?: number[];
		hidden_badges?: number[];
	};

	const user = await User.findOneOrFail({
		where: { id: req.user_id },
		select: { id: true, account_preferences: true },
	});

	const order = body.badge_display_order ?? body.display_order ?? [];
	const hidden = body.hidden_badges ?? [];

	const currentPrefs = (user.account_preferences as Record<string, unknown>) ?? {};
	user.account_preferences = {
		...currentPrefs,
		badge_settings: {
			badge_display_order: order,
			hidden_badges: hidden,
		},
	} as unknown as typeof user.account_preferences;

	await user.save();

	return res.json({
		badge_display_order: order,
		hidden_badges: hidden,
	});
});

router.put("/", route({ responses: { 200: {} } }), async (req: Request, res: Response) => {
	const body = req.body as {
		badge_display_order?: number[];
		display_order?: number[];
		hidden_badges?: number[];
	};

	const user = await User.findOneOrFail({
		where: { id: req.user_id },
		select: { id: true, account_preferences: true },
	});

	const order = body.badge_display_order ?? body.display_order ?? [];
	const hidden = body.hidden_badges ?? [];

	const currentPrefs = (user.account_preferences as Record<string, unknown>) ?? {};
	user.account_preferences = {
		...currentPrefs,
		badge_settings: {
			badge_display_order: order,
			hidden_badges: hidden,
		},
	} as unknown as typeof user.account_preferences;

	await user.save();

	return res.json({
		badge_display_order: order,
		hidden_badges: hidden,
	});
});

export default router;
