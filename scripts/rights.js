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

/*
	Calculates a Zycord default rights value.
*/

require("./register-paths.cjs");
const { Rights } = require("..");

const allRights = new Rights(1).bitfield;
console.log(`All rights:`, allRights);

var zycordLike = allRights;
zycordLike -= Rights.FLAGS.OPERATOR;
zycordLike -= Rights.FLAGS.UNUSED_1;
zycordLike -= Rights.FLAGS.MANAGE_MESSAGES;
zycordLike -= Rights.FLAGS.UNUSED_2;
zycordLike -= Rights.FLAGS.UNUSED_3;
zycordLike -= Rights.FLAGS.UNUSED_4;
zycordLike -= Rights.FLAGS.MANAGE_USERS;
zycordLike -= Rights.FLAGS.MANAGE_GUILDS;
zycordLike -= Rights.FLAGS.UNUSED_5;
zycordLike -= Rights.FLAGS.BYPASS_RATE_LIMITS;
zycordLike -= Rights.FLAGS.UNUSED_21;
zycordLike -= Rights.FLAGS.UNUSED_23;
zycordLike -= Rights.FLAGS.SEND_BACKDATED_EVENTS;
zycordLike -= Rights.FLAGS.UNUSED_30;
zycordLike -= Rights.FLAGS.UNUSED_29;
zycordLike -= Rights.FLAGS.UNUSED_31;
console.log(`Zycord default rights:`, zycordLike);
