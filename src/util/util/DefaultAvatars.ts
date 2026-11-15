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

import fs from "node:fs";
import path from "node:path";
import { ASSETS_FOLDER, PUBLIC_ASSETS_FOLDER } from "./Constants";

export const DEFAULT_AVATAR_COLORS = ["#1e1f22", "#6e7681", "#2ea66b", "#e8a317", "#e5484d", "#d6409f"];

export const DEFAULT_AVATARS_FOLDER = fs.existsSync(path.join(PUBLIC_ASSETS_FOLDER, "default-avatars"))
    ? path.join(PUBLIC_ASSETS_FOLDER, "default-avatars")
    : fs.existsSync(path.join(ASSETS_FOLDER, "default-avatars"))
      ? path.join(ASSETS_FOLDER, "default-avatars")
      : path.join(__dirname, "..", "..", "default-avatars");
