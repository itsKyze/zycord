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

// sounds this instance replaces, served from assets/public/sounds
const RINGTONE = "/assets/sounds/call_ringing.mp3";

export default definePlugin({
    name: "ZycordSounds",
    description: "Plays this instance's own ringtone for incoming calls, including the seasonal and rare variants of it.",
    authors: [ZycordAuthor],
    required: true,

    soundUrl(name: string) {
        return name.startsWith("call_ringing") ? RINGTONE : undefined;
    },

    patches: [
        {
            // every sound the client plays goes through here: new Audio with src from the bundled mp3s
            find: /new Audio;\i\.src=\i\(\d+\)\(`\.\/\$\{this\.name\}\.mp3`\)/,
            replacement: {
                match: /(\i)\.src=(\i\(\d+\)\(`\.\/\$\{this\.name\}\.mp3`\))/,
                replace: "$1.src=$self.soundUrl(this.name)??$2",
            },
        },
    ],
});
