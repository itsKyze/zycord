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

// Zycord sends ISO strings with +00:00 extension, not Z
// This ensures compatibility with Python bot libs

export function JSONReplacer(this: { [key: string]: unknown }, key: string, value: unknown) {
    if (this[key] instanceof Date) {
        const d = this[key] as Date;
        return Number.isNaN(d.getTime()) ? null : d.toISOString().replace("Z", "+00:00");
    }

    // erlpack encoding doesn't call json.stringify,
    // so our toJSON functions don't get called.
    // manually call it here
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (this?.[key]?.toJSON)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        this[key] = this[key].toJSON();

    return value;
}

function zycordDate(this: Date) {
    return Number.isNaN(this.getTime()) ? null : this.toISOString().replace("Z", "+00:00");
}

export function JSONStringify(value: unknown) {
    const toJSON = Date.prototype.toJSON;
    Date.prototype.toJSON = zycordDate as typeof toJSON;
    try {
        return JSON.stringify(value);
    } finally {
        Date.prototype.toJSON = toJSON;
    }
}
