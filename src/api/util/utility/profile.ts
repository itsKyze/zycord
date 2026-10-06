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

import { Member, User } from "@spacebar/database";
import { CollectibleItemType, Collectibles, FieldErrors } from "@spacebar/util";
import { ProfileCollectible } from "@spacebar/schemas";

const SUBSCRIPTION_BADGE = /^(?:premium(?:_|$)|nitro(?:_|$)|subscriber(?:_|$)|guild_booster(?:_|$))/;

const SUBSCRIPTION_ICONS = new Set([
    "2ba85e8026a8614b640c2837bcdfe21b",
    "4f33c4a9c64ce221936bd256c356f91f",
    "4514fab914bdbfb4ad2fa23df76121a6",
    "2895086c18d5531d499862e41d1155a6",
    "0334688279c8359120922938dcb1d6f8",
    "0d61871f72bb9a33a7ae568c1fb4f20a",
    "11e2d339068b55d3a506cff34d3780f3",
    "cd5e2cfd9d7f27a8cdcd3e8a8d5dc9f4",
    "5b154df19c53dce2af92c9b61e6be5e2",
    "51040c70d4f20a921ad6674ff86fc95c",
    "0e4080d1d333bc7ad29ef6528b6f2fb7",
    "72bed924410c304dbe3d00a6e593ff59",
    "df199d2050d3ed4ebf84d64ae83989f8",
    "996b3e870e8a22ce519b3a50e6bdd52f",
    "991c9f39ee33d7537d9f408c3e53141e",
    "cb3ae83c15e970e8f3d410bc62cb8b99",
    "7142225d31238f6387d9f09efaa02759",
    "ec92202290b48d0879b7413d2dde3bab",
]);

export const isSubscriptionBadge = (badge: { id: string; icon: string }) =>
    SUBSCRIPTION_BADGE.test(badge.id) || SUBSCRIPTION_BADGE.test(badge.icon) || SUBSCRIPTION_ICONS.has(badge.icon);

export interface TenureMilestone {
    months: number;
    id: string;
    icon: string;
}

export const NITRO_MILESTONES: TenureMilestone[] = [
    { months: 72, id: "premium_tenure_72_month_v2", icon: "5b154df19c53dce2af92c9b61e6be5e2" },
    { months: 60, id: "premium_tenure_60_month_v2", icon: "cd5e2cfd9d7f27a8cdcd3e8a8d5dc9f4" },
    { months: 36, id: "premium_tenure_36_month_v2", icon: "11e2d339068b55d3a506cff34d3780f3" },
    { months: 24, id: "premium_tenure_24_month_v2", icon: "0d61871f72bb9a33a7ae568c1fb4f20a" },
    { months: 12, id: "premium_tenure_12_month_v2", icon: "0334688279c8359120922938dcb1d6f8" },
    { months: 6,  id: "premium_tenure_6_month_v2",  icon: "2895086c18d5531d499862e41d1155a6" },
    { months: 3,  id: "premium_tenure_3_month_v2",  icon: "4514fab914bdbfb4ad2fa23df76121a6" },
    { months: 1,  id: "premium_tenure_1_month_v2",  icon: "4f33c4a9c64ce221936bd256c356f91f" },
];

export const BOOST_MILESTONES: TenureMilestone[] = [
    { months: 24, id: "guild_booster_lvl9", icon: "ec92202290b48d0879b7413d2dde3bab" },
    { months: 18, id: "guild_booster_lvl8", icon: "7142225d31238f6387d9f09efaa02759" },
    { months: 15, id: "guild_booster_lvl7", icon: "cb3ae83c15e970e8f3d410bc62cb8b99" },
    { months: 12, id: "guild_booster_lvl6", icon: "991c9f39ee33d7537d9f408c3e53141e" },
    { months: 9,  id: "guild_booster_lvl5", icon: "996b3e870e8a22ce519b3a50e6bdd52f" },
    { months: 6,  id: "guild_booster_lvl4", icon: "df199d2050d3ed4ebf84d64ae83989f8" },
    { months: 3,  id: "guild_booster_lvl3", icon: "72bed924410c304dbe3d00a6e593ff59" },
    { months: 2,  id: "guild_booster_lvl2", icon: "0e4080d1d333bc7ad29ef6528b6f2fb7" },
    { months: 1,  id: "guild_booster_lvl1", icon: "51040c70d4f20a921ad6674ff86fc95c" },
];

export function calculateMonthsElapsed(since: Date, now: Date = new Date()): number {
    let months = (now.getFullYear() - since.getFullYear()) * 12 + (now.getMonth() - since.getMonth());
    if (now.getDate() < since.getDate()) {
        months -= 1;
    }
    return Math.max(0, months);
}

export const profileMetadata = (source: User | Member) => {
    const collectibles = source.profile_collectibles ?? [];
    const effect = collectibles.find((x) => x.type === CollectibleItemType.PROFILE_EFFECT);
    const frame = collectibles.find((x) => x.type === CollectibleItemType.PROFILE_FRAME);
    return {
        ...(source instanceof Member ? { guild_id: source.guild_id } : {}),
        bio: source.bio ?? "",
        accent_color: source instanceof User ? (source.accent_color ?? null) : null,
        banner: source.banner ?? null,
        pronouns: source.pronouns ?? "",
        theme_colors: source.theme_colors?.length ? source.theme_colors.map(Number) : null,
        popout_animation_particle_type: null,
        emoji: null,
        profile_effect: effect ? { id: effect.sku_id, expires_at: null } : null,
        profile_frame: frame ? { id: frame.sku_id, expires_at: null } : null,
        collectibles,
    };
};

export const resolveProfileCollectibles = async (current: ProfileCollectible[] | null | undefined, sku_ids?: string[] | null, profile_effect_id?: string | null) => {
    let next = sku_ids === undefined ? [...(current ?? [])] : [];
    for (const sku_id of sku_ids ?? []) {
        const item = (await Collectibles.item(sku_id, CollectibleItemType.PROFILE_EFFECT)) ?? (await Collectibles.item(sku_id, CollectibleItemType.PROFILE_FRAME));
        if (!item) throw FieldErrors({ collectibles_sku_ids: { code: "50057", message: "Invalid SKU" } });
        next = next.filter((x) => x.type !== item.type);
        next.push({ sku_id: item.sku_id, type: item.type, expires_at: null });
    }
    if (profile_effect_id !== undefined) {
        next = next.filter((x) => x.type !== CollectibleItemType.PROFILE_EFFECT);
        if (profile_effect_id) {
            const effect = await Collectibles.item(profile_effect_id, CollectibleItemType.PROFILE_EFFECT);
            if (!effect) throw FieldErrors({ profile_effect_id: { code: "50057", message: "Invalid SKU" } });
            next.push({ sku_id: effect.sku_id, type: effect.type, expires_at: null });
        }
    }
    return next;
};
