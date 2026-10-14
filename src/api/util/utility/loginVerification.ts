import { Request } from "express";
import { Session, User } from "@spacebar/database";
import { Email, FieldErrors } from "@spacebar/util";

export function normalizeIp(ip?: string | null) {
    if (!ip) return "";
    const value = ip.split(",")[0].trim().replace(/^::ffff:/i, "");
    if (value === "::1") return "127.0.0.1";
    return value;
}

export function requestIp(req: Request) {
    const forwarded = req.headers["cf-connecting-ip"] ?? req.headers["x-forwarded-for"];
    const header = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return normalizeIp(typeof header === "string" ? header : req.ip);
}

export async function authorizeLoginIp(userId: string, ip?: string | null) {
    const normalized = normalizeIp(ip);
    if (!normalized) return;
    const user = await User.findOne({ where: { id: userId }, select: { id: true, data: true } });
    if (!user?.data) return;
    const current = (user.data.authorized_ips ?? []).map((entry) => normalizeIp(entry)).filter(Boolean);
    if (current.includes(normalized)) return;
    await User.update({ id: userId }, { data: { ...user.data, authorized_ips: [...current, normalized].slice(-30) } });
}

export async function knownLoginIps(userId: string, authorized: string[] = []) {
    const sessions = await Session.find({ where: { user_id: userId }, select: { session_id: true, last_seen_ip: true, last_seen: true } });
    const ips = new Set<string>();
    for (const session of sessions) {
        const ip = normalizeIp(session.last_seen_ip);
        if (ip) ips.add(ip);
    }
    for (const ip of authorized) {
        const normalized = normalizeIp(ip);
        if (normalized) ips.add(normalized);
    }
    const mostRecent = sessions.reduce((max, session) => Math.max(max, session.last_seen?.getTime() ?? 0), 0);
    return { ips, sessionCount: sessions.length, mostRecent };
}

export async function gateNewLoginLocation(req: Request, user: Pick<User, "id" | "email" | "verified"> & { data?: User["data"] }) {
    const ip = requestIp(req);
    if (user.email && user.verified) {
        const known = await knownLoginIps(user.id, user.data?.authorized_ips);
        const daysSinceActivity = known.mostRecent > 0 ? (Date.now() - known.mostRecent) / (1000 * 60 * 60 * 24) : 999;
        const isUnknownIp = known.ips.size > 0 && !!ip && !known.ips.has(ip);
        const isStaleLogin = known.sessionCount > 0 && daysSinceActivity > 7;

        if (isUnknownIp || isStaleLogin) {
            const sent = await Email.sendNewLoginLocation(user as User, user.email, {
                ip: ip || "127.0.0.1",
                city: (req.headers["cf-ipcity"] as string) || "Unknown City",
                region: (req.headers["cf-region"] as string) || "Unknown Region",
                country_name: (req.headers["cf-ipcountry"] as string) || "Unknown Country",
            }).catch((e) => {
                console.error(`[Login] Failed to send new login location email to ${user.id}:`, e);
                return false;
            });

            if (isUnknownIp && sent)
                throw FieldErrors({
                    login: {
                        code: "ACCOUNT_LOGIN_VERIFICATION_EMAIL",
                        message: "New login location detected, please check your e-mail.",
                    },
                });
        }
    }

    if (ip) await authorizeLoginIp(user.id, ip).catch((e) => console.error(`[Login] Failed to remember login location for ${user.id}:`, e));
}
