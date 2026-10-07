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

import definePlugin from "@utils/types";

import { ZycordAuthor, redirectTo } from "../zycordCore/shared";

const INCLUDED_IN_BOOSTING = "#{intl::hUgjyP::raw}";

export default definePlugin({
    name: "ZycordNoBoostUpsells",
    description: "Every server is already boost level 3 here, so this removes Server Boost adverts and shows boost perks as unlocked.",
    authors: [ZycordAuthor],
    required: true,

    redirectTo,

    patches: [
        // Hide the "boost" entry in the server download prompt row.
        {
            find: 'key:"download",iconUrl:',
            replacement: {
                match: /=\i\?(?=\{key:"boost")/,
                replace: "=!1?",
            },
        },
        // Hide the "Server Boost" purchase upsell modal (the full-screen buy modal).
        {
            find: 'id:"premium-subscribe",',
            replacement: {
                match: /\(0,\i\.jsx\)\(\i\.\i,\{id:"premium-subscribe",/,
                replace: "null&&$&",
            },
        },
        // Hide "Included in Boosting" feature-gate labels inside settings pages.
        {
            find: INCLUDED_IN_BOOSTING,
            replacement: {
                match: /=function\(\i\)\{(?=let \i,\i,\i,\{guildFeature:)/,
                replace: "$&return null;",
            },
        },
        // In the boost tier component: skip renderTierNone / renderSubscribers
        // (the "buy level" cards shown when tier is 0).
        {
            find: "renderTierNone(){",
            replacement: [
                {
                    match: /renderProgressBar\(\i\)\{/,
                    replace: "$&return null;",
                },
                {
                    match: /0===\i\?this\.renderTierNone\(\):this\.renderSubscribers\(\)/,
                    replace: "null",
                },
            ],
        },
        // Skip the boost-banner "Boost this server" CTA that appears in the
        // channel list when premium_tier is NONE.
        {
            find: /isBannerVisible:\i,disableBoostClick:\i\}=\i/,
            replacement: {
                match: /if\(0===\i&&\i===\i\.\i\.NONE\)return null;(?=let \i=\i===\i\.\i\.NONE\?)/,
                replace: "return null;",
            },
        },
        // Hide "Send a message when someone boosts this server" toggle
        // in Engagement settings (it is meaningless when boosting is free).
        {
            find: /\.SUPPRESS_PREMIUM_SUBSCRIPTIONS\),onChange:/,
            replacement: {
                match: /\(0,\i\.jsx\)\(\i\.\i,\{label:[^{}]{0,80},checked:!\(0,\i\.\i\)\(\i\.systemChannelFlags,\i\.\i\.SUPPRESS_PREMIUM_SUBSCRIPTIONS\)/,
                replace: "null&&$&",
            },
        },
        // Redirect the GUILD_BOOSTS powerup listing page to the channel list
        // instead of opening the boost purchase flow.
        {
            find: /case \i\.\i\.GUILD_BOOSTS:return\(0,\i\.jsx\)\(\i,\{guildId:\i,powerupListingId:/,
            replacement: {
                match: /(case \i\.\i\.GUILD_BOOSTS:return)\(0,\i\.jsx\)\(\i,\{guildId:(\i),powerupListingId:[^}]+\}\)/,
                replace: '$1 $self.redirectTo("/channels/"+$2)',
            },
        },
    ],
});
