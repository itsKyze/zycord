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
    name: "ZycordAuth",
    description: "Cancel pending passkey sign-in cleanly when the login screen changes or a password is submitted.",
    authors: [ZycordAuthor],
    required: true,
    patches: [
        {
            find: '"Login state reset"',
            replacement: {
                match: /(\i)\.abort\("(?:Login state reset|Starting password login|Transitioning to authenticated state)"\)/g,
                replace: "$1.abort()",
            },
        },
    ],
});
