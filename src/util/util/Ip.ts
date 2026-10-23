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

/**
 * Expands any IPv6 address into its full 8-group, uncompressed 32-character canonical representation.
 * Consecutive zero groups compressed by "::" are fully expanded with 4 hexadecimal digits per block.
 * Example: "2a09:bac5:d570:191::28:122" -> "2a09:bac5:d570:0191:0000:0000:0028:0122"
 */
export function expandIPv6(ip: string): string {
    if (!ip || !ip.includes(":")) return ip;
    let clean = String(ip).split(",")[0].trim().toLowerCase();

    // Strip enclosing brackets if format is [2a09:...] or [2a09:...]:port
    if (clean.startsWith("[")) {
        const closeIdx = clean.indexOf("]");
        if (closeIdx !== -1) {
            clean = clean.slice(1, closeIdx);
        }
    }

    // Strip IPv4-mapped IPv6 prefix (::ffff:192.168.1.1)
    clean = clean.replace(/^::ffff:/i, "");
    if (!clean.includes(":")) return clean;
    if (clean === "::1" || clean === "0:0:0:0:0:0:0:1") return "127.0.0.1";

    const parts = clean.split("::");
    if (parts.length > 2) return clean; // Invalid IPv6 format

    const left = parts[0] ? parts[0].split(":").filter(Boolean) : [];
    const right = parts.length > 1 && parts[1] ? parts[1].split(":").filter(Boolean) : [];

    const missing = 8 - (left.length + right.length);
    if (missing < 0) return clean;
    const middle = Array(missing).fill("0000");

    const fullBlocks = [
        ...left.map((b) => b.padStart(4, "0")),
        ...middle,
        ...right.map((b) => b.padStart(4, "0")),
    ];

    if (fullBlocks.length === 8) {
        return fullBlocks.join(":");
    }
    return clean;
}

/**
 * Canonicalizes an IP address (IPv4 or IPv6) for secure storage and comparison.
 * Strips ports, brackets, and expands IPv6 to full length so comparison is 100% deterministic.
 */
export function normalizeIp(ip?: string | null): string {
    if (!ip) return "";
    let val = String(ip).split(",")[0].trim();

    // Strip enclosing brackets e.g. [2a09:...] or [::1]:port
    if (val.startsWith("[")) {
        const closeIdx = val.indexOf("]");
        if (closeIdx !== -1) {
            val = val.slice(1, closeIdx);
        }
    } else if (val.includes(".") && val.includes(":") && !val.includes("::")) {
        // IPv4 with port e.g. 1.2.3.4:8080
        val = val.split(":")[0];
    }

    val = val.replace(/^::ffff:/i, "");
    if (val === "::1" || val === "0:0:0:0:0:0:0:1") return "127.0.0.1";
    if (val.includes(":")) return expandIPv6(val);
    return val.toLowerCase();
}

/**
 * Formats an IP address for display in emails, notifications, and UI.
 * Ensures IPv6 is cleanly displayed to the very end without "::" truncation.
 */
export function formatDisplayIp(ip?: string | null): string {
    if (!ip) return "Unknown IP";
    return normalizeIp(ip) || ip;
}
