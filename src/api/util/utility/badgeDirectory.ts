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

import { In } from "typeorm";
import { Badge, Member, User } from "@spacebar/database";
import { Config } from "@spacebar/util";
import { calculateMonthsElapsed, NITRO_MILESTONES, BOOST_MILESTONES } from "./profile";
import { hasAdminPanelAccess } from "./staffBadge";

export enum BadgeId {
	PREMIUM_TENURE = 1,
	PARTNER = 2,
	CERTIFIED_MODERATOR = 3,
	HYPESQUAD = 4,
	HYPESQUAD_HOUSE_1 = 5,
	HYPESQUAD_HOUSE_2 = 6,
	HYPESQUAD_HOUSE_3 = 7,
	BUG_HUNTER_LEVEL_1 = 8,
	BUG_HUNTER_LEVEL_2 = 9,
	VERIFIED_DEVELOPER = 10,
	EARLY_SUPPORTER = 11,
	GUILD_BOOSTER = 12,
	LEGACY_USERNAME = 13,
	QUEST_COMPLETED = 14,
	APRIL_FOOLS_2026 = 15,
	ORB_PROFILE = 16,
	GIFTING = 17,
	ACCOUNT_AGE = 18,
	STREAMING = 19,
	GAME_TIME = 20,
	GAME_VARIETY = 21,
	STAFF = 22,
}

export enum BadgeRarity {
	COMMON = 1,
	RARE = 2,
	EPIC = 3,
	MYTHIC = 5,
}

export interface BadgeDirectoryTierRequirement {
	threshold: number;
}

export interface BadgeDirectoryTier {
	key: string;
	name: string;
	simple_icon_url: string;
	complex_icon_static_url: string | null;
	complex_icon_animated_url: string | null;
	milestone_text: string | null;
	owned: boolean;
	requirements: BadgeDirectoryTierRequirement[];
}

export interface BadgeDirectoryProgress {
	current: number;
	threshold: number;
	progress_helper_text?: string | null;
}

export interface BadgeDirectoryItem {
	badge_id: number;
	name: string;
	description: string;
	owned: boolean;
	hidden: boolean;
	is_earnable: boolean;
	simple_icon_url: string;
	simple_icon_raster_url?: string;
	complex_icon_static_url: string | null;
	complex_icon_animated_url: string | null;
	rarity: number;
	obtained_at: string | null;
	current_tier: string | null;
	next_tier: string | null;
	tier_obtained_at: Record<string, string> | null;
	tiers: BadgeDirectoryTier[];
	progress: BadgeDirectoryProgress[];
	leveling_instructions?: string | null;
	info_label?: string | null;
}

export const BADGE_ICON_TO_INFO: Record<string, { slug: string; badge_id: number }> = {
	"5e74e9b61934fc1f67c65515d1f7e60d": { slug: "staff", badge_id: BadgeId.STAFF },
	"3f9748e53446a137a052f3454e2de41e": { slug: "partner", badge_id: BadgeId.PARTNER },
	"fee1624003e2fee35cb398e125dc479b": { slug: "certified_moderator", badge_id: BadgeId.CERTIFIED_MODERATOR },
	"bf01d1073931f921909045f3a39fd264": { slug: "hypesquad", badge_id: BadgeId.HYPESQUAD },
	"8a88d63823d8a71cd5e390baa45efa02": { slug: "hypesquad_house_1", badge_id: BadgeId.HYPESQUAD_HOUSE_1 },
	"011940fd013da3f7fb926e4a1cd2e618": { slug: "hypesquad_house_2", badge_id: BadgeId.HYPESQUAD_HOUSE_2 },
	"3aa41de486fa12454c3761e8e223442e": { slug: "hypesquad_house_3", badge_id: BadgeId.HYPESQUAD_HOUSE_3 },
	"2717692c7dca7289b35297368a940dd0": { slug: "bug_hunter_level_1", badge_id: BadgeId.BUG_HUNTER_LEVEL_1 },
	"848f79194d4be5ff5f81505cbd0ce1e6": { slug: "bug_hunter_level_2", badge_id: BadgeId.BUG_HUNTER_LEVEL_2 },
	"6df5892e0f35b051f8b61eace34f4967": { slug: "verified_developer", badge_id: BadgeId.VERIFIED_DEVELOPER },
	"7060786766c9c840eb3019e725d2b358": { slug: "early_supporter", badge_id: BadgeId.EARLY_SUPPORTER },
	"7d9ae358c8c5e118768335dbe68b4fb8": { slug: "quest_completed", badge_id: BadgeId.QUEST_COMPLETED },
	"83d8a1eb09a8d64e59233eec5d4d5c2d": { slug: "orb_profile_badge", badge_id: BadgeId.ORB_PROFILE },
};

function discordBadgeUrl(hash: string): string {
	if (hash.startsWith("http://") || hash.startsWith("https://")) return hash;
	const name = hash.endsWith(".png") ? hash : `${hash}.png`;
	if (name.includes("_")) {
		const base = (Config.get().cdn.endpointPublic || "").replace(/\/+$/, "");
		return `${base}/badge-icons/${name}`;
	}
	return `https://cdn.discordapp.com/badge-icons/${name}`;
}

function parseDate(val: any): Date | null {
	if (!val) return null;
	if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
	if (typeof val === "number") {
		const d = new Date(val);
		return isNaN(d.getTime()) ? null : d;
	}
	if (typeof val === "string") {
		const trimmed = val.trim();
		if (/^\d+$/.test(trimmed)) {
			const d = new Date(Number(trimmed));
			return isNaN(d.getTime()) ? null : d;
		}
		const d = new Date(trimmed);
		return isNaN(d.getTime()) ? null : d;
	}
	return null;
}

export async function buildUserBadgeDirectory(targetUser: User, guildId?: string): Promise<BadgeDirectoryItem[]> {
	const dbBadges: Badge[] = targetUser.badge_ids?.length
		? await Badge.find({ where: { id: In(targetUser.badge_ids) } })
		: [];

	const userBadgeIds = new Set(targetUser.badge_ids ?? []);
	const hasBadge = (badgeId: number, slug: string, iconHash?: string) => {
		if (userBadgeIds.has(slug)) return true;
		if (userBadgeIds.has(String(badgeId))) return true;
		if (iconHash && dbBadges.some((b) => b.icon === iconHash)) return true;
		return false;
	};

	const isStaff = hasAdminPanelAccess(targetUser.rights) ||
		userBadgeIds.has("1") ||
		userBadgeIds.has("staff") ||
		dbBadges.some((b) => b.id === "1" || b.icon === "5e74e9b61934fc1f67c65515d1f7e60d");

	const hasNitro = (!targetUser.hide_premium_badge && (targetUser.premium_type ?? 0) > 0);
	const nitroSinceDate = hasNitro ? (parseDate(targetUser.premium_since) ?? parseDate(targetUser.created_at) ?? new Date()) : null;
	const nitroMonths = nitroSinceDate ? calculateMonthsElapsed(nitroSinceDate) : 0;
	const currentNitroMilestone = NITRO_MILESTONES.find((m) => nitroMonths >= m.months);
	const nextNitroMilestones = [...NITRO_MILESTONES].reverse().filter((m) => m.months > nitroMonths);
	const nextNitroMilestone = nextNitroMilestones[0] ?? null;

	const nitroTiers: BadgeDirectoryTier[] = [...NITRO_MILESTONES].reverse().map((m) => {
		const name = m.months >= 12 ? `${m.months / 12} ${m.months === 12 ? "Year" : "Years"}` : `${m.months} ${m.months === 1 ? "Month" : "Months"}`;
		return {
			key: m.id,
			name,
			simple_icon_url: discordBadgeUrl(m.icon),
			complex_icon_static_url: discordBadgeUrl(m.icon),
			complex_icon_animated_url: null,
			milestone_text: name,
			owned: hasNitro && nitroMonths >= m.months,
			requirements: [{ threshold: m.months }],
		};
	});

	const nitroTierObtainedAt: Record<string, string> = {};
	if (nitroSinceDate) {
		const iso = nitroSinceDate.toISOString();
		for (const t of nitroTiers) {
			if (t.owned) nitroTierObtainedAt[t.key] = iso;
		}
	}

	const boostMember = await Member.findOne({
		where: guildId ? { id: targetUser.id, guild_id: guildId } : { id: targetUser.id },
		select: { premium_since: true, guild_id: true },
	});
	const isBoosting = !!boostMember?.premium_since;
	const boostSinceDate = boostMember?.premium_since ? parseDate(boostMember.premium_since) : null;
	const boostMonths = boostSinceDate ? calculateMonthsElapsed(boostSinceDate) : 0;
	const currentBoostMilestone = isBoosting ? BOOST_MILESTONES.find((m) => boostMonths >= m.months) : null;
	const nextBoostMilestones = [...BOOST_MILESTONES].reverse().filter((m) => m.months > boostMonths);
	const nextBoostMilestone = nextBoostMilestones[0] ?? null;

	const boostTiers: BadgeDirectoryTier[] = [...BOOST_MILESTONES].reverse().map((m) => {
		const name = m.months >= 12 ? `${m.months / 12} ${m.months === 12 ? "Year" : "Years"}` : `${m.months} ${m.months === 1 ? "Month" : "Months"}`;
		return {
			key: m.id,
			name,
			simple_icon_url: discordBadgeUrl(m.icon),
			complex_icon_static_url: discordBadgeUrl(m.icon),
			complex_icon_animated_url: null,
			milestone_text: name,
			owned: isBoosting && boostMonths >= m.months,
			requirements: [{ threshold: m.months }],
		};
	});

	const boostTierObtainedAt: Record<string, string> = {};
	if (boostSinceDate) {
		const iso = boostSinceDate.toISOString();
		for (const t of boostTiers) {
			if (t.owned) boostTierObtainedAt[t.key] = iso;
		}
	}

	// Gifting tiers
	const GIFTING_DATA = [
		{ key: "gifting_legend", name: "Legend", gifts: 20, icon: "gifting_legend.png" },
		{ key: "gifting_hero", name: "Hero", gifts: 10, icon: "gifting_hero.png" },
		{ key: "gifting_icon", name: "Icon", gifts: 6, icon: "gifting_icon.png" },
		{ key: "gifting_luminary", name: "Luminary", gifts: 3, icon: "gifting_luminary.png" },
		{ key: "gifting_champion", name: "Champion", gifts: 2, icon: "gifting_champion.png" },
		{ key: "gifting_patron", name: "Patron", gifts: 1, icon: "gifting_patron.png" },
	];
	const hasGifting = hasBadge(BadgeId.GIFTING, "gifting") || isStaff;
	const giftingTiers: BadgeDirectoryTier[] = [...GIFTING_DATA].reverse().map((t) => ({
		key: t.key,
		name: t.name,
		simple_icon_url: discordBadgeUrl(t.icon),
		complex_icon_static_url: discordBadgeUrl(t.icon),
		complex_icon_animated_url: null,
		milestone_text: `${t.gifts} ${t.gifts === 1 ? "Gift" : "Gifts"}`,
		owned: hasGifting,
		requirements: [{ threshold: t.gifts }],
	}));

	// Account Age tiers
	const ACCOUNT_AGE_DATA = [
		{ key: "account_age_10", name: "Primordial", years: 10, icon: "account_age_primordial.png" },
		{ key: "account_age_9", name: "Stromatolite", years: 9, icon: "account_age_stromatolite.png" },
		{ key: "account_age_8", name: "Bristlecone", years: 8, icon: "account_age_bristlecone.png" },
		{ key: "account_age_7", name: "Sequoia", years: 7, icon: "account_age_sequoia.png" },
		{ key: "account_age_6", name: "Redwood", years: 6, icon: "account_age_redwood.png" },
		{ key: "account_age_5", name: "Blossom", years: 5, icon: "account_age_blossom.png" },
		{ key: "account_age_4", name: "Sapling", years: 4, icon: "account_age_sapling.png" },
		{ key: "account_age_3", name: "Bud", years: 3, icon: "account_age_bud.png" },
		{ key: "account_age_2", name: "Sprout", years: 2, icon: "account_age_sprout.png" },
		{ key: "account_age_1", name: "Seed", years: 1, icon: "account_age_seed.png" },
	];
	const userCreatedDate = parseDate(targetUser.created_at) ?? new Date();
	const yearsElapsed = Math.max(1, new Date().getFullYear() - userCreatedDate.getFullYear());
	const hasAccountAge = yearsElapsed >= 1 || hasBadge(BadgeId.ACCOUNT_AGE, "account_age") || isStaff;
	const currentAgeTier = ACCOUNT_AGE_DATA.find((t) => yearsElapsed >= t.years) ?? ACCOUNT_AGE_DATA[ACCOUNT_AGE_DATA.length - 1];
	const accountAgeTiers: BadgeDirectoryTier[] = [...ACCOUNT_AGE_DATA].reverse().map((t) => ({
		key: t.key,
		name: `${t.years} ${t.years === 1 ? "Year" : "Years"}`,
		simple_icon_url: discordBadgeUrl(t.icon),
		complex_icon_static_url: discordBadgeUrl(t.icon),
		complex_icon_animated_url: null,
		milestone_text: `${t.years} ${t.years === 1 ? "Year" : "Years"} (${t.name})`,
		owned: hasAccountAge && yearsElapsed >= t.years,
		requirements: [{ threshold: t.years }],
	}));

	// Streaming tiers
	const STREAMING_DATA = [
		{ key: "streaming_10", name: "Phenomenon", hours: 5000, icon: "streaming_phenomenon.png" },
		{ key: "streaming_9", name: "Visionary", hours: 2000, icon: "streaming_visionary.png" },
		{ key: "streaming_8", name: "Sensation", hours: 1000, icon: "streaming_sensation.png" },
		{ key: "streaming_7", name: "Star", hours: 500, icon: "streaming_star.png" },
		{ key: "streaming_6", name: "Headliner", hours: 300, icon: "streaming_headliner.png" },
		{ key: "streaming_5", name: "Trendsetter", hours: 150, icon: "streaming_trendsetter.png" },
		{ key: "streaming_4", name: "Standout", hours: 75, icon: "streaming_standout.png" },
		{ key: "streaming_3", name: "Breakout", hours: 20, icon: "streaming_breakout.png" },
		{ key: "streaming_2", name: "Fledgling", hours: 5, icon: "streaming_fledgling.png" },
		{ key: "streaming_1", name: "Newcomer", hours: 1, icon: "streaming_newcomer.png" },
	];
	const hasStreaming = hasBadge(BadgeId.STREAMING, "streaming") || isStaff;
	const streamingTiers: BadgeDirectoryTier[] = [...STREAMING_DATA].reverse().map((t) => ({
		key: t.key,
		name: `${t.hours} Hours`,
		simple_icon_url: discordBadgeUrl(t.icon),
		complex_icon_static_url: discordBadgeUrl(t.icon),
		complex_icon_animated_url: null,
		milestone_text: `${t.hours} Hours (${t.name})`,
		owned: hasStreaming,
		requirements: [{ threshold: t.hours }],
	}));

	// Game Time tiers
	const GAME_TIME_DATA = [
		{ key: "game_time_10", name: "Eternal", hours: 5000, icon: "game_time_eternal.png" },
		{ key: "game_time_9", name: "Unshakeable", hours: 2000, icon: "game_time_unshakeable.png" },
		{ key: "game_time_8", name: "Ironclad", hours: 1000, icon: "game_time_ironclad.png" },
		{ key: "game_time_7", name: "Seasoned", hours: 500, icon: "game_time_seasoned.png" },
		{ key: "game_time_6", name: "Devoted", hours: 300, icon: "game_time_devoted.png" },
		{ key: "game_time_5", name: "Serious", hours: 150, icon: "game_time_serious.png" },
		{ key: "game_time_4", name: "Committed", hours: 75, icon: "game_time_committed.png" },
		{ key: "game_time_3", name: "Dedicated", hours: 20, icon: "game_time_dedicated.png" },
		{ key: "game_time_2", name: "Recreational", hours: 5, icon: "game_time_recreational.png" },
		{ key: "game_time_1", name: "Casual", hours: 1, icon: "game_time_casual.png" },
	];
	const hasGameTime = hasBadge(BadgeId.GAME_TIME, "game_time") || isStaff;
	const gameTimeTiers: BadgeDirectoryTier[] = [...GAME_TIME_DATA].reverse().map((t) => ({
		key: t.key,
		name: `${t.hours} Hours`,
		simple_icon_url: discordBadgeUrl(t.icon),
		complex_icon_static_url: discordBadgeUrl(t.icon),
		complex_icon_animated_url: null,
		milestone_text: `${t.hours} Hours (${t.name})`,
		owned: hasGameTime,
		requirements: [{ threshold: t.hours }],
	}));

	// Game Variety tiers
	const GAME_VARIETY_DATA = [
		{ key: "game_variety_10", name: "Universalist", games: 100, icon: "game_variety_universalist.png" },
		{ key: "game_variety_9", name: "Polymath", games: 80, icon: "game_variety_polymath.png" },
		{ key: "game_variety_8", name: "Maverick", games: 60, icon: "game_variety_maverick.png" },
		{ key: "game_variety_7", name: "Voyager", games: 40, icon: "game_variety_voyager.png" },
		{ key: "game_variety_6", name: "Adventurer", games: 30, icon: "game_variety_adventurer.png" },
		{ key: "game_variety_5", name: "Explorer", games: 20, icon: "game_variety_explorer.png" },
		{ key: "game_variety_4", name: "Ranger", games: 15, icon: "game_variety_ranger.png" },
		{ key: "game_variety_3", name: "Enthusiast", games: 10, icon: "game_variety_enthusiast.png" },
		{ key: "game_variety_2", name: "Dabbler", games: 5, icon: "game_variety_dabbler.png" },
		{ key: "game_variety_1", name: "Sampler", games: 2, icon: "game_variety_sampler.png" },
	];
	const hasGameVariety = hasBadge(BadgeId.GAME_VARIETY, "game_variety") || isStaff;
	const gameVarietyTiers: BadgeDirectoryTier[] = [...GAME_VARIETY_DATA].reverse().map((t) => ({
		key: t.key,
		name: `${t.games} Games`,
		simple_icon_url: discordBadgeUrl(t.icon),
		complex_icon_static_url: discordBadgeUrl(t.icon),
		complex_icon_animated_url: null,
		milestone_text: `${t.games} Games (${t.name})`,
		owned: hasGameVariety,
		requirements: [{ threshold: t.games }],
	}));

	const targetCreatedIso = (parseDate(targetUser.created_at) ?? new Date()).toISOString();

	const items: BadgeDirectoryItem[] = [
		// 1. PREMIUM_TENURE (Nitro)
		{
			badge_id: BadgeId.PREMIUM_TENURE,
			name: "Discord Nitro",
			description: hasNitro && nitroSinceDate
				? `Subscriber since ${nitroSinceDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
				: "Subscriber to Discord Nitro",
			owned: hasNitro,
			hidden: false,
			is_earnable: true,
			simple_icon_url: discordBadgeUrl(currentNitroMilestone?.icon ?? "2ba85e8026a8614b640c2837bcdfe21b"),
			simple_icon_raster_url: discordBadgeUrl(currentNitroMilestone?.icon ?? "2ba85e8026a8614b640c2837bcdfe21b"),
			complex_icon_static_url: discordBadgeUrl(currentNitroMilestone?.icon ?? "2ba85e8026a8614b640c2837bcdfe21b"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.COMMON,
			obtained_at: hasNitro && nitroSinceDate ? nitroSinceDate.toISOString() : null,
			current_tier: hasNitro ? (currentNitroMilestone?.id ?? "premium_tenure_1_month_v2") : null,
			next_tier: hasNitro ? (nextNitroMilestone?.id ?? null) : "premium_tenure_1_month_v2",
			tier_obtained_at: hasNitro ? nitroTierObtainedAt : null,
			tiers: nitroTiers,
			progress: [
				{
					current: nitroMonths,
					threshold: nextNitroMilestone?.months ?? 72,
					progress_helper_text: null,
				},
			],
			leveling_instructions: hasNitro ? "Keep your Nitro subscription active to unlock higher tenure badges." : "Subscribe to Nitro to unlock this badge.",
			info_label: null,
		},

		// 2. PARTNER
		{
			badge_id: BadgeId.PARTNER,
			name: "Partnered Server Owner",
			description: "Owner of a partnered Discord server.",
			owned: hasBadge(BadgeId.PARTNER, "partner", "3f9748e53446a137a052f3454e2de41e"),
			hidden: false,
			is_earnable: false,
			simple_icon_url: discordBadgeUrl("3f9748e53446a137a052f3454e2de41e"),
			simple_icon_raster_url: discordBadgeUrl("3f9748e53446a137a052f3454e2de41e"),
			complex_icon_static_url: discordBadgeUrl("3f9748e53446a137a052f3454e2de41e"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.RARE,
			obtained_at: hasBadge(BadgeId.PARTNER, "partner", "3f9748e53446a137a052f3454e2de41e") ? targetCreatedIso : null,
			current_tier: null,
			next_tier: null,
			tier_obtained_at: null,
			tiers: [],
			progress: [],
			leveling_instructions: null,
			info_label: null,
		},

		// 3. CERTIFIED_MODERATOR
		{
			badge_id: BadgeId.CERTIFIED_MODERATOR,
			name: "Moderator Programs Alumni",
			description: "Alumni of Discord moderator programs.",
			owned: hasBadge(BadgeId.CERTIFIED_MODERATOR, "certified_moderator", "fee1624003e2fee35cb398e125dc479b"),
			hidden: false,
			is_earnable: false,
			simple_icon_url: discordBadgeUrl("fee1624003e2fee35cb398e125dc479b"),
			simple_icon_raster_url: discordBadgeUrl("fee1624003e2fee35cb398e125dc479b"),
			complex_icon_static_url: discordBadgeUrl("fee1624003e2fee35cb398e125dc479b"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.EPIC,
			obtained_at: hasBadge(BadgeId.CERTIFIED_MODERATOR, "certified_moderator", "fee1624003e2fee35cb398e125dc479b") ? targetCreatedIso : null,
			current_tier: null,
			next_tier: null,
			tier_obtained_at: null,
			tiers: [],
			progress: [],
			leveling_instructions: null,
			info_label: null,
		},

		// 4. HYPESQUAD
		{
			badge_id: BadgeId.HYPESQUAD,
			name: "HypeSquad Events",
			description: "Attends or hosts local gaming events and conventions.",
			owned: hasBadge(BadgeId.HYPESQUAD, "hypesquad", "bf01d1073931f921909045f3a39fd264"),
			hidden: false,
			is_earnable: false,
			simple_icon_url: discordBadgeUrl("bf01d1073931f921909045f3a39fd264"),
			simple_icon_raster_url: discordBadgeUrl("bf01d1073931f921909045f3a39fd264"),
			complex_icon_static_url: discordBadgeUrl("bf01d1073931f921909045f3a39fd264"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.RARE,
			obtained_at: hasBadge(BadgeId.HYPESQUAD, "hypesquad", "bf01d1073931f921909045f3a39fd264") ? targetCreatedIso : null,
			current_tier: null,
			next_tier: null,
			tier_obtained_at: null,
			tiers: [],
			progress: [],
			leveling_instructions: null,
			info_label: null,
		},

		// 5. HYPESQUAD_HOUSE_1 (Bravery)
		{
			badge_id: BadgeId.HYPESQUAD_HOUSE_1,
			name: "HypeSquad Bravery",
			description: "Member of the HypeSquad Bravery house.",
			owned: hasBadge(BadgeId.HYPESQUAD_HOUSE_1, "hypesquad_house_1", "8a88d63823d8a71cd5e390baa45efa02"),
			hidden: false,
			is_earnable: true,
			simple_icon_url: discordBadgeUrl("8a88d63823d8a71cd5e390baa45efa02"),
			simple_icon_raster_url: discordBadgeUrl("8a88d63823d8a71cd5e390baa45efa02"),
			complex_icon_static_url: discordBadgeUrl("8a88d63823d8a71cd5e390baa45efa02"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.COMMON,
			obtained_at: hasBadge(BadgeId.HYPESQUAD_HOUSE_1, "hypesquad_house_1", "8a88d63823d8a71cd5e390baa45efa02") ? targetCreatedIso : null,
			current_tier: null,
			next_tier: null,
			tier_obtained_at: null,
			tiers: [],
			progress: [],
			leveling_instructions: "Take the HypeSquad test in User Settings to join a house.",
			info_label: null,
		},

		// 6. HYPESQUAD_HOUSE_2 (Brilliance)
		{
			badge_id: BadgeId.HYPESQUAD_HOUSE_2,
			name: "HypeSquad Brilliance",
			description: "Member of the HypeSquad Brilliance house.",
			owned: hasBadge(BadgeId.HYPESQUAD_HOUSE_2, "hypesquad_house_2", "011940fd013da3f7fb926e4a1cd2e618"),
			hidden: false,
			is_earnable: true,
			simple_icon_url: discordBadgeUrl("011940fd013da3f7fb926e4a1cd2e618"),
			simple_icon_raster_url: discordBadgeUrl("011940fd013da3f7fb926e4a1cd2e618"),
			complex_icon_static_url: discordBadgeUrl("011940fd013da3f7fb926e4a1cd2e618"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.COMMON,
			obtained_at: hasBadge(BadgeId.HYPESQUAD_HOUSE_2, "hypesquad_house_2", "011940fd013da3f7fb926e4a1cd2e618") ? targetCreatedIso : null,
			current_tier: null,
			next_tier: null,
			tier_obtained_at: null,
			tiers: [],
			progress: [],
			leveling_instructions: "Take the HypeSquad test in User Settings to join a house.",
			info_label: null,
		},

		// 7. HYPESQUAD_HOUSE_3 (Balance)
		{
			badge_id: BadgeId.HYPESQUAD_HOUSE_3,
			name: "HypeSquad Balance",
			description: "Member of the HypeSquad Balance house.",
			owned: hasBadge(BadgeId.HYPESQUAD_HOUSE_3, "hypesquad_house_3", "3aa41de486fa12454c3761e8e223442e"),
			hidden: false,
			is_earnable: true,
			simple_icon_url: discordBadgeUrl("3aa41de486fa12454c3761e8e223442e"),
			simple_icon_raster_url: discordBadgeUrl("3aa41de486fa12454c3761e8e223442e"),
			complex_icon_static_url: discordBadgeUrl("3aa41de486fa12454c3761e8e223442e"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.COMMON,
			obtained_at: hasBadge(BadgeId.HYPESQUAD_HOUSE_3, "hypesquad_house_3", "3aa41de486fa12454c3761e8e223442e") ? targetCreatedIso : null,
			current_tier: null,
			next_tier: null,
			tier_obtained_at: null,
			tiers: [],
			progress: [],
			leveling_instructions: "Take the HypeSquad test in User Settings to join a house.",
			info_label: null,
		},

		// 8. BUG_HUNTER_LEVEL_1
		{
			badge_id: BadgeId.BUG_HUNTER_LEVEL_1,
			name: "Discord Bug Hunter",
			description: "Helps find bugs in Discord.",
			owned: hasBadge(BadgeId.BUG_HUNTER_LEVEL_1, "bug_hunter_level_1", "2717692c7dca7289b35297368a940dd0"),
			hidden: false,
			is_earnable: false,
			simple_icon_url: discordBadgeUrl("2717692c7dca7289b35297368a940dd0"),
			simple_icon_raster_url: discordBadgeUrl("2717692c7dca7289b35297368a940dd0"),
			complex_icon_static_url: discordBadgeUrl("2717692c7dca7289b35297368a940dd0"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.RARE,
			obtained_at: hasBadge(BadgeId.BUG_HUNTER_LEVEL_1, "bug_hunter_level_1", "2717692c7dca7289b35297368a940dd0") ? targetCreatedIso : null,
			current_tier: null,
			next_tier: null,
			tier_obtained_at: null,
			tiers: [],
			progress: [],
			leveling_instructions: null,
			info_label: null,
		},

		// 9. BUG_HUNTER_LEVEL_2
		{
			badge_id: BadgeId.BUG_HUNTER_LEVEL_2,
			name: "Discord Gold Bug Hunter",
			description: "Helps find serious bugs in Discord.",
			owned: hasBadge(BadgeId.BUG_HUNTER_LEVEL_2, "bug_hunter_level_2", "848f79194d4be5ff5f81505cbd0ce1e6"),
			hidden: false,
			is_earnable: false,
			simple_icon_url: discordBadgeUrl("848f79194d4be5ff5f81505cbd0ce1e6"),
			simple_icon_raster_url: discordBadgeUrl("848f79194d4be5ff5f81505cbd0ce1e6"),
			complex_icon_static_url: discordBadgeUrl("848f79194d4be5ff5f81505cbd0ce1e6"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.EPIC,
			obtained_at: hasBadge(BadgeId.BUG_HUNTER_LEVEL_2, "bug_hunter_level_2", "848f79194d4be5ff5f81505cbd0ce1e6") ? targetCreatedIso : null,
			current_tier: null,
			next_tier: null,
			tier_obtained_at: null,
			tiers: [],
			progress: [],
			leveling_instructions: null,
			info_label: null,
		},

		// 10. VERIFIED_DEVELOPER
		{
			badge_id: BadgeId.VERIFIED_DEVELOPER,
			name: "Early Verified Bot Developer",
			description: "Owner of an early verified Discord bot.",
			owned: hasBadge(BadgeId.VERIFIED_DEVELOPER, "verified_developer", "6df5892e0f35b051f8b61eace34f4967"),
			hidden: false,
			is_earnable: false,
			simple_icon_url: discordBadgeUrl("6df5892e0f35b051f8b61eace34f4967"),
			simple_icon_raster_url: discordBadgeUrl("6df5892e0f35b051f8b61eace34f4967"),
			complex_icon_static_url: discordBadgeUrl("6df5892e0f35b051f8b61eace34f4967"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.RARE,
			obtained_at: hasBadge(BadgeId.VERIFIED_DEVELOPER, "verified_developer", "6df5892e0f35b051f8b61eace34f4967") ? targetCreatedIso : null,
			current_tier: null,
			next_tier: null,
			tier_obtained_at: null,
			tiers: [],
			progress: [],
			leveling_instructions: null,
			info_label: null,
		},

		// 11. EARLY_SUPPORTER
		{
			badge_id: BadgeId.EARLY_SUPPORTER,
			name: "Early Supporter",
			description: "Supported Discord in its early days.",
			owned: hasBadge(BadgeId.EARLY_SUPPORTER, "early_supporter", "7060786766c9c840eb3019e725d2b358"),
			hidden: false,
			is_earnable: false,
			simple_icon_url: discordBadgeUrl("7060786766c9c840eb3019e725d2b358"),
			simple_icon_raster_url: discordBadgeUrl("7060786766c9c840eb3019e725d2b358"),
			complex_icon_static_url: discordBadgeUrl("7060786766c9c840eb3019e725d2b358"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.EPIC,
			obtained_at: hasBadge(BadgeId.EARLY_SUPPORTER, "early_supporter", "7060786766c9c840eb3019e725d2b358") ? targetCreatedIso : null,
			current_tier: null,
			next_tier: null,
			tier_obtained_at: null,
			tiers: [],
			progress: [],
			leveling_instructions: null,
			info_label: null,
		},

		// 12. GUILD_BOOSTER (Server Booster)
		{
			badge_id: BadgeId.GUILD_BOOSTER,
			name: "Server Booster",
			description: isBoosting && boostSinceDate
				? `Server boosting since ${boostSinceDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
				: "Boosting a Discord server.",
			owned: isBoosting,
			hidden: false,
			is_earnable: true,
			simple_icon_url: discordBadgeUrl(currentBoostMilestone?.icon ?? "51040c70d4f20a921ad6674ff86fc95c"),
			simple_icon_raster_url: discordBadgeUrl(currentBoostMilestone?.icon ?? "51040c70d4f20a921ad6674ff86fc95c"),
			complex_icon_static_url: discordBadgeUrl(currentBoostMilestone?.icon ?? "51040c70d4f20a921ad6674ff86fc95c"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.COMMON,
			obtained_at: isBoosting && boostSinceDate ? boostSinceDate.toISOString() : null,
			current_tier: isBoosting ? (currentBoostMilestone?.id ?? "guild_booster_lvl1") : null,
			next_tier: isBoosting ? (nextBoostMilestone?.id ?? null) : "guild_booster_lvl1",
			tier_obtained_at: isBoosting ? boostTierObtainedAt : null,
			tiers: boostTiers,
			progress: [
				{
					current: boostMonths,
					threshold: nextBoostMilestone?.months ?? 24,
					progress_helper_text: null,
				},
			],
			leveling_instructions: isBoosting ? "Keep boosting servers to reach higher booster tiers." : "Boost a server to unlock this badge.",
			info_label: null,
		},

		// 13. LEGACY_USERNAME
		{
			badge_id: BadgeId.LEGACY_USERNAME,
			name: "Originally Known as",
			description: targetUser.discriminator && targetUser.discriminator !== "0" && targetUser.discriminator !== "0000"
				? `Originally known as ${targetUser.username}#${targetUser.discriminator}`
				: "Original Discord discriminator holder.",
			owned: hasBadge(BadgeId.LEGACY_USERNAME, "legacy_username"),
			hidden: false,
			is_earnable: false,
			simple_icon_url: discordBadgeUrl("6de6d30e87201c13d8d5fb466d713bd7"),
			simple_icon_raster_url: discordBadgeUrl("6de6d30e87201c13d8d5fb466d713bd7"),
			complex_icon_static_url: discordBadgeUrl("6de6d30e87201c13d8d5fb466d713bd7"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.COMMON,
			obtained_at: hasBadge(BadgeId.LEGACY_USERNAME, "legacy_username") ? targetCreatedIso : null,
			current_tier: null,
			next_tier: null,
			tier_obtained_at: null,
			tiers: [],
			progress: [],
			leveling_instructions: null,
			info_label: null,
		},

		// 14. QUEST_COMPLETED
		{
			badge_id: BadgeId.QUEST_COMPLETED,
			name: "Completed a Quest",
			description: "Completed a Discord Quest.",
			owned: hasBadge(BadgeId.QUEST_COMPLETED, "quest_completed", "7d9ae358c8c5e118768335dbe68b4fb8"),
			hidden: false,
			is_earnable: true,
			simple_icon_url: discordBadgeUrl("7d9ae358c8c5e118768335dbe68b4fb8"),
			simple_icon_raster_url: discordBadgeUrl("7d9ae358c8c5e118768335dbe68b4fb8"),
			complex_icon_static_url: discordBadgeUrl("7d9ae358c8c5e118768335dbe68b4fb8"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.COMMON,
			obtained_at: hasBadge(BadgeId.QUEST_COMPLETED, "quest_completed", "7d9ae358c8c5e118768335dbe68b4fb8") ? targetCreatedIso : null,
			current_tier: null,
			next_tier: null,
			tier_obtained_at: null,
			tiers: [],
			progress: [],
			leveling_instructions: "Complete available Quests in the Discover tab to earn this badge.",
			info_label: null,
		},

		// 15. APRIL_FOOLS_2026
		{
			badge_id: BadgeId.APRIL_FOOLS_2026,
			name: "April Fools",
			description: "Celebrated April Fools.",
			owned: hasBadge(BadgeId.APRIL_FOOLS_2026, "april_fools_2026"),
			hidden: false,
			is_earnable: false,
			simple_icon_url: discordBadgeUrl("2ba85e8026a8614b640c2837bcdfe21b"),
			simple_icon_raster_url: discordBadgeUrl("2ba85e8026a8614b640c2837bcdfe21b"),
			complex_icon_static_url: discordBadgeUrl("2ba85e8026a8614b640c2837bcdfe21b"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.COMMON,
			obtained_at: hasBadge(BadgeId.APRIL_FOOLS_2026, "april_fools_2026") ? targetCreatedIso : null,
			current_tier: null,
			next_tier: null,
			tier_obtained_at: null,
			tiers: [],
			progress: [],
			leveling_instructions: null,
			info_label: null,
		},

		// 16. ORB_PROFILE
		{
			badge_id: BadgeId.ORB_PROFILE,
			name: "Orbs Apprentice",
			description: "Earned Discord Orbs.",
			owned: hasBadge(BadgeId.ORB_PROFILE, "orb_profile_badge", "83d8a1eb09a8d64e59233eec5d4d5c2d"),
			hidden: false,
			is_earnable: true,
			simple_icon_url: discordBadgeUrl("83d8a1eb09a8d64e59233eec5d4d5c2d"),
			simple_icon_raster_url: discordBadgeUrl("83d8a1eb09a8d64e59233eec5d4d5c2d"),
			complex_icon_static_url: discordBadgeUrl("83d8a1eb09a8d64e59233eec5d4d5c2d"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.COMMON,
			obtained_at: hasBadge(BadgeId.ORB_PROFILE, "orb_profile_badge", "83d8a1eb09a8d64e59233eec5d4d5c2d") ? targetCreatedIso : null,
			current_tier: null,
			next_tier: null,
			tier_obtained_at: null,
			tiers: [],
			progress: [],
			leveling_instructions: "Participate in Discord Orbs activities to earn this badge.",
			info_label: null,
		},

		// 17. GIFTING
		{
			badge_id: BadgeId.GIFTING,
			name: "Nitro Gifter",
			description: "Gifted Nitro to friends.",
			owned: hasGifting,
			hidden: false,
			is_earnable: true,
			simple_icon_url: discordBadgeUrl(GIFTING_DATA[0].icon),
			simple_icon_raster_url: discordBadgeUrl(GIFTING_DATA[0].icon),
			complex_icon_static_url: discordBadgeUrl(GIFTING_DATA[0].icon),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.COMMON,
			obtained_at: hasGifting ? targetCreatedIso : null,
			current_tier: hasGifting ? GIFTING_DATA[0].key : null,
			next_tier: hasGifting ? null : GIFTING_DATA[GIFTING_DATA.length - 1].key,
			tier_obtained_at: hasGifting ? Object.fromEntries(giftingTiers.map(t => [t.key, targetCreatedIso])) : null,
			tiers: giftingTiers,
			progress: [
				{
					current: hasGifting ? 20 : 0,
					threshold: 20,
					progress_helper_text: null,
				},
			],
			leveling_instructions: "Gift Nitro subscriptions to other users to earn this badge.",
			info_label: null,
		},

		// 18. ACCOUNT_AGE
		{
			badge_id: BadgeId.ACCOUNT_AGE,
			name: "Account Age",
			description: "Years on Discord.",
			owned: hasAccountAge,
			hidden: false,
			is_earnable: true,
			simple_icon_url: discordBadgeUrl(currentAgeTier.icon),
			simple_icon_raster_url: discordBadgeUrl(currentAgeTier.icon),
			complex_icon_static_url: discordBadgeUrl(currentAgeTier.icon),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.COMMON,
			obtained_at: hasAccountAge ? targetCreatedIso : null,
			current_tier: hasAccountAge ? currentAgeTier.key : null,
			next_tier: hasAccountAge ? null : "account_age_1",
			tier_obtained_at: hasAccountAge ? Object.fromEntries(accountAgeTiers.filter(t => t.owned).map(t => [t.key, targetCreatedIso])) : null,
			tiers: accountAgeTiers,
			progress: [
				{
					current: yearsElapsed,
					threshold: 10,
					progress_helper_text: null,
				},
			],
			leveling_instructions: "Your account age advances naturally over time.",
			info_label: null,
		},

		// 19. STREAMING
		{
			badge_id: BadgeId.STREAMING,
			name: "Streamer",
			description: "Streams on Discord.",
			owned: hasStreaming,
			hidden: false,
			is_earnable: true,
			simple_icon_url: discordBadgeUrl(STREAMING_DATA[0].icon),
			simple_icon_raster_url: discordBadgeUrl(STREAMING_DATA[0].icon),
			complex_icon_static_url: discordBadgeUrl(STREAMING_DATA[0].icon),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.COMMON,
			obtained_at: hasStreaming ? targetCreatedIso : null,
			current_tier: hasStreaming ? STREAMING_DATA[0].key : null,
			next_tier: hasStreaming ? null : STREAMING_DATA[STREAMING_DATA.length - 1].key,
			tier_obtained_at: hasStreaming ? Object.fromEntries(streamingTiers.map(t => [t.key, targetCreatedIso])) : null,
			tiers: streamingTiers,
			progress: [
				{
					current: hasStreaming ? 5000 : 0,
					threshold: 5000,
					progress_helper_text: null,
				},
			],
			leveling_instructions: "Stream in voice channels to earn this badge.",
			info_label: null,
		},

		// 20. GAME_TIME
		{
			badge_id: BadgeId.GAME_TIME,
			name: "Game Time",
			description: "Hours spent gaming on Discord.",
			owned: hasGameTime,
			hidden: false,
			is_earnable: true,
			simple_icon_url: discordBadgeUrl(GAME_TIME_DATA[0].icon),
			simple_icon_raster_url: discordBadgeUrl(GAME_TIME_DATA[0].icon),
			complex_icon_static_url: discordBadgeUrl(GAME_TIME_DATA[0].icon),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.COMMON,
			obtained_at: hasGameTime ? targetCreatedIso : null,
			current_tier: hasGameTime ? GAME_TIME_DATA[0].key : null,
			next_tier: hasGameTime ? null : GAME_TIME_DATA[GAME_TIME_DATA.length - 1].key,
			tier_obtained_at: hasGameTime ? Object.fromEntries(gameTimeTiers.map(t => [t.key, targetCreatedIso])) : null,
			tiers: gameTimeTiers,
			progress: [
				{
					current: hasGameTime ? 5000 : 0,
					threshold: 5000,
					progress_helper_text: null,
				},
			],
			leveling_instructions: "Play games while on Discord to increase your game time.",
			info_label: null,
		},

		// 21. GAME_VARIETY
		{
			badge_id: BadgeId.GAME_VARIETY,
			name: "Game Explorer",
			description: "Plays diverse games on Discord.",
			owned: hasGameVariety,
			hidden: false,
			is_earnable: true,
			simple_icon_url: discordBadgeUrl(GAME_VARIETY_DATA[0].icon),
			simple_icon_raster_url: discordBadgeUrl(GAME_VARIETY_DATA[0].icon),
			complex_icon_static_url: discordBadgeUrl(GAME_VARIETY_DATA[0].icon),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.COMMON,
			obtained_at: hasGameVariety ? targetCreatedIso : null,
			current_tier: hasGameVariety ? GAME_VARIETY_DATA[0].key : null,
			next_tier: hasGameVariety ? null : GAME_VARIETY_DATA[GAME_VARIETY_DATA.length - 1].key,
			tier_obtained_at: hasGameVariety ? Object.fromEntries(gameVarietyTiers.map(t => [t.key, targetCreatedIso])) : null,
			tiers: gameVarietyTiers,
			progress: [
				{
					current: hasGameVariety ? 100 : 0,
					threshold: 100,
					progress_helper_text: null,
				},
			],
			leveling_instructions: "Play different games on Discord to expand your variety.",
			info_label: null,
		},

		// 22. STAFF
		{
			badge_id: BadgeId.STAFF,
			name: `${Config.get().general.instanceName} Staff`,
			description: `${Config.get().general.instanceName} Staff Member`,
			owned: isStaff,
			hidden: false,
			is_earnable: false,
			simple_icon_url: discordBadgeUrl("5e74e9b61934fc1f67c65515d1f7e60d"),
			simple_icon_raster_url: discordBadgeUrl("5e74e9b61934fc1f67c65515d1f7e60d"),
			complex_icon_static_url: discordBadgeUrl("5e74e9b61934fc1f67c65515d1f7e60d"),
			complex_icon_animated_url: null,
			rarity: BadgeRarity.MYTHIC,
			obtained_at: isStaff ? targetCreatedIso : null,
			current_tier: null,
			next_tier: null,
			tier_obtained_at: null,
			tiers: [],
			progress: [],
			leveling_instructions: null,
			info_label: null,
		},
	];

	return items;
}
