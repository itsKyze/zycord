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
import managedStyle from "./style.css?managed";

export default definePlugin({
    name: "ZycordModals",
    description: "Keeps active dialogs and their popouts above the backdrop, and lets outside clicks close nested dialogs.",
    authors: [ZycordAuthor],
    required: true,
    managedStyle,
});
