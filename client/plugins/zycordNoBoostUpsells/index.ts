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

import { ZycordAuthor } from "../zycordCore/shared";

const INCLUDED_IN_BOOSTING = "#{intl::hUgjyP::raw}";

export default definePlugin({
    name: "ZycordNoBoostUpsells",
    description: "Every server is already boost level 3 here, so this removes Server Boost adverts and shows boost perks as unlocked.",
    authors: [ZycordAuthor],
    required: true,


    patches: [
        // Hide the "boost" entry in the server download prompt row.
        {
            find: 'key:"download",iconUrl:',
            replacement: {
                match: /=\i\?(?=\{key:"boost")/,
                replace: "=!1?",
            },
        },
    ],
});

