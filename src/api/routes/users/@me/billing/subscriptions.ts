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
import { broadcastUserUpdate, emitEvent, UserUpdateEvent } from "@spacebar/util";

const router: Router = Router({ mergeParams: true });

export function buildSubscription(user: { id: string; premium_type?: number; premium_since?: Date; created_at?: Date }) {
    let planId = "511651880837840896"; // Nitro Monthly
    if (user.premium_type === 1) {
        planId = "511651871736201216"; // Nitro Classic Monthly
    } else if (user.premium_type === 3) {
        planId = "978380692553465866"; // Nitro Basic Monthly
    }

    const start = user.premium_since ? new Date(user.premium_since) : (user.created_at ? new Date(user.created_at) : new Date());
    const now = new Date();
    const end = new Date(now);
    end.setMonth(end.getMonth() + 1);

    return {
        id: "1422548914485198870",
        type: 1, // 1 = PREMIUM (Nitro)
        status: 1, // 1 = ACTIVE
        payment_gateway: 1,
        currency: "usd",
        items: [
            {
                id: "1422548914485198871",
                plan_id: planId,
                quantity: 1,
            },
        ],
        payment_gateway_plan_id: "premium_month",
        payment_gateway_subscription_id: "sub_zycord_premium",
        current_period_start: start.toISOString(),
        current_period_end: end.toISOString(),
        streak_started_at: start.toISOString(),
        created_at: start.toISOString(),
        canceled_at: null as string | null,
        country_code: "US",
        payment_source_id: "1422548914485198869",
        use_storekit_resubscribe: false,
        renewal_mutations: null,
        trial_id: null,
        trial_ends_at: null,
        pause_ends_at: null,
        pause_reason: null,
        metadata: {},
        user_id: user.id,
        price: 999,
        flags: 0,
    };
}

router.get("/", route({}), async (req: Request, res: Response) => {
    const user = await User.findOne({
        where: { id: req.user_id },
        select: {
            id: true,
            premium: true,
            premium_type: true,
            premium_since: true,
            created_at: true,
        },
    });

    if (!user || (!user.premium && !user.premium_type)) {
        return res.status(200).json([]);
    }

    return res.status(200).json([buildSubscription(user)]);
});

router.all("/preview", route({}), async (req: Request, res: Response) => {
    const planId = req.body?.items?.[0]?.plan_id || "511651880837840896";
    const now = new Date();
    const end = new Date(now);
    end.setMonth(end.getMonth() + 1);

    return res.status(200).json({
        id: "1422548914485198880",
        invoice_items: [
            {
                id: "1422548914485198881",
                subscription_plan_id: planId,
                subscription_plan_price: 999,
                amount: 999,
                quantity: 1,
                discounts: [],
            },
        ],
        total: 999,
        subtotal: 999,
        currency: "usd",
        tax: 0,
        tax_inclusive: true,
        subscription_period_start: now.toISOString(),
        subscription_period_end: end.toISOString(),
        status: 1,
    });
});

router.post("/", route({}), async (req: Request, res: Response) => {
    const user = await User.findOneOrFail({
        where: { id: req.user_id },
    });

    const requestedPlanId = req.body?.items?.[0]?.plan_id;
    let premiumType = 2; // Nitro
    if (requestedPlanId === "511651871736201216") {
        premiumType = 1; // Classic
    } else if (requestedPlanId === "978380692553465866" || requestedPlanId === "1021860655851835493") {
        premiumType = 3; // Basic
    }

    user.premium = true;
    user.premium_type = premiumType;
    user.premium_since = new Date();
    await user.save();

    await emitEvent({
        event: "USER_UPDATE",
        user_id: user.id,
        data: user.toPrivateUser(),
    } as unknown as UserUpdateEvent);
    await broadcastUserUpdate(user.id);

    return res.status(200).json(buildSubscription(user));
});

router.patch("/:subscription_id", route({}), async (req: Request, res: Response) => {
    const user = await User.findOneOrFail({
        where: { id: req.user_id },
    });

    return res.status(200).json(buildSubscription(user));
});

router.delete("/:subscription_id", route({}), async (req: Request, res: Response) => {
    const user = await User.findOne({
        where: { id: req.user_id },
    });

    if (!user) return res.status(204).send();

    const sub = buildSubscription(user);
    sub.canceled_at = new Date().toISOString();
    return res.status(200).json(sub);
});

export default router;
