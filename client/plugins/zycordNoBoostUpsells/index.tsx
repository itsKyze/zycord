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
import { Margins } from "@utils/margins";
import { find, findByCode, findByProps } from "@webpack";
import { React, RestAPI, GuildStore } from "@webpack/common";

import { ZycordAuthor } from "../zycordCore/shared";

const INCLUDED_IN_BOOSTING = "#{intl::hUgjyP::raw}";

function BoostProgressBarToggle({ guildId }: { guildId: string }) {
    const guild = GuildStore.getGuild(guildId) as any;
    const [enabled, setEnabled] = React.useState(guild?.premium_progress_bar_enabled ?? false);

    let Forms: any, Switch: any;
    try {
        Forms = findByProps("FormTitle", "FormText", "FormSection");
        Switch = findByCode("tooltipNote", "handleOnChange", "FormSwitch");
    } catch {}

    async function handleChange(val: boolean) {
        setEnabled(val);
        try {
            await RestAPI.patch({
                url: `/guilds/${guildId}`,
                body: { premium_progress_bar_enabled: val },
            });
        } catch (e) {
            // roll back on failure
            setEnabled(!val);
        }
    }

    if (!Forms || !Switch) return null;

    const { FormTitle, FormText, FormSection } = Forms;

    return (
        <FormSection className={Margins.bottom16}>
            <FormTitle tag="h5">Show Boost progress bar</FormTitle>
            <Switch
                value={enabled}
                onChange={handleChange}
                note="Servers with the Boost progress bar enabled get more Boosts. This progress bar will display in your channel list, attached to your server name (or server banner if you have one set)."
            >
                Show Boost progress bar
            </Switch>
        </FormSection>
    );
}

export default definePlugin({
    name: "ZycordNoBoostUpsells",
    description: "Every server is already boost level 3 here, so this removes Server Boost adverts and shows boost perks as unlocked.",
    authors: [ZycordAuthor],
    required: true,

    renderBoostProgressBarToggle: (guildId: string) => <BoostProgressBarToggle guildId={guildId} />,

    patches: [
        // Hide the "boost" entry in the server download prompt row.
        {
            find: 'key:"download",iconUrl:',
            replacement: {
                match: /=\i\?(?=\{key:"boost")/,
                replace: "=!1?",
            },
        },
        // Inject the "Show Boost progress bar" toggle at the top of Guild Settings -> Boost Perks.
        // The Boost Perks component receives the guild_id as a prop and renders boost-related settings.
        {
            find: /\.GUILD_PREMIUM_TIER_[23]_UPGRADE\b/,
            replacement: {
                match: /function (\i)\(\{guildId:(\i)[^}]*\}\)\{/,
                replace: "function $1({guildId:$2,..._rest}){return $self.renderBoostProgressBarToggle($2);",
            },
            noWarn: true,
        },
    ],
});
