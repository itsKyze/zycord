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

export default definePlugin({
    name: "ZycordSlowmode",
    description: "Apply the instance's slowmode policy to countdowns and message composition.",
    authors: [ZycordAuthor],
    required: true,
    allowBypass: () => (window as unknown as { GLOBAL_ENV?: { SLOWMODE_ALLOW_BYPASS?: boolean } }).GLOBAL_ENV?.SLOWMODE_ALLOW_BYPASS === true,
    patches: [
        {
            find: /function \i\(\i,\i\)\{return \i\.can\(\i\.\i\.BYPASS_SLOWMODE,\i\)\}/,
            replacement: {
                match: /(return )(\i\.can\(\i\.\i\.BYPASS_SLOWMODE,\i\))/,
                replace: "$1$self.allowBypass()&&$2",
            },
        },
    ],
});
