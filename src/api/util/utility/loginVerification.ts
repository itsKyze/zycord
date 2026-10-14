import { Request } from "express";
import { Session, User, TrustedLoginDevice } from "@spacebar/database";
import { Email, FieldErrors } from "@spacebar/util";

const DEVICE_IDLE_MS = 24 * 60 * 60 * 1000;

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

export function describeLoginDevice(req: Request): TrustedLoginDevice {
    const ua = String(req.headers["user-agent"] ?? "");
    let os = "Unknown";
    if (/Windows/i.test(ua)) os = "Windows";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/iPad/i.test(ua)) os = "iPadOS";
    else if (/iPhone|iOS/i.test(ua)) os = "iOS";
    else if (/Mac OS X|Macintosh/i.test(ua)) os = "macOS";
    else if (/CrOS/i.test(ua)) os = "ChromeOS";
    else if (/Linux/i.test(ua)) os = "Linux";

    let client = "Browser";
    if (/ZycordMobile/i.test(ua)) client = "Zycord";
    else if (/Electron/i.test(ua)) client = "Zycord";
    else if (/Edg\//i.test(ua)) client = "Edge";
    else if (/OPR\/|Opera/i.test(ua)) client = "Opera";
    else if (/Chrome\//i.test(ua)) client = "Chrome";
    else if (/Firefox\//i.test(ua)) client = "Firefox";
    else if (/Safari/i.test(ua)) client = "Safari";

    const kind: TrustedLoginDevice["kind"] = /Android|iPhone|iPad|Mobile|ZycordMobile/i.test(ua) ? "mobile" : "desktop";
    return {
        key: `${kind}|${os}|${client}`,
        label: `${client} on ${os}`,
        kind,
        os,
        client,
        ip: requestIp(req),
        last_seen: Date.now(),
    };
}

function deviceFromClaim(claimed: { ip?: string; device?: string; label?: string }, fallback: TrustedLoginDevice): TrustedLoginDevice {
    const [kind, os, client] = (claimed.device || fallback.key).split("|");
    const safeKind: TrustedLoginDevice["kind"] = kind === "mobile" ? "mobile" : "desktop";
    return {
        key: claimed.device || fallback.key,
        label: claimed.label || fallback.label,
        kind: safeKind,
        os: os || fallback.os,
        client: client || fallback.client,
        ip: normalizeIp(claimed.ip) || fallback.ip,
        last_seen: Date.now(),
    };
}

export async function rememberTrustedDevice(userId: string, device: TrustedLoginDevice) {
    const ip = normalizeIp(device.ip);
    if (!device.key || !ip) return;
    const user = await User.findOne({ where: { id: userId }, select: { id: true, data: true } });
    if (!user?.data) return;
    const nextDevice = { ...device, ip, last_seen: Date.now() };
    const devices = (user.data.trusted_devices ?? []).filter((entry) => !(entry.key === nextDevice.key && normalizeIp(entry.ip) === ip));
    const ips = (user.data.authorized_ips ?? []).map((entry) => normalizeIp(entry)).filter(Boolean);
    await User.update(
        { id: userId },
        {
            data: {
                ...user.data,
                authorized_ips: ips.includes(ip) ? ips : [...ips, ip].slice(-30),
                trusted_devices: [...devices, nextDevice].slice(-30),
            },
        },
    );
}

export async function authorizeLoginDevice(userId: string, req: Request, claimed?: { ip?: string; device?: string; label?: string }) {
    await rememberTrustedDevice(userId, deviceFromClaim(claimed ?? {}, describeLoginDevice(req)));
}

export async function gateNewLoginLocation(req: Request, user: Pick<User, "id" | "email" | "verified"> & { data?: User["data"] }) {
    const device = describeLoginDevice(req);
    const devices = user.data?.trusted_devices ?? [];
    const knownIps = new Set((user.data?.authorized_ips ?? []).map((entry) => normalizeIp(entry)).filter(Boolean));
    const sessions = await Session.find({ where: { user_id: user.id }, select: { session_id: true, last_seen: true, last_seen_ip: true } });
    const recentlyHere = sessions.some((session) => normalizeIp(session.last_seen_ip) === device.ip && Date.now() - (session.last_seen?.getTime() ?? 0) < DEVICE_IDLE_MS);
    const match = devices.find((entry) => entry.key === device.key && normalizeIp(entry.ip) === device.ip);
    const idle = !!match && Date.now() - (match.last_seen || 0) > DEVICE_IDLE_MS && !recentlyHere;
    const firstDevice = devices.length === 0 && knownIps.size === 0;
    const legacyIp = devices.length === 0 && !!device.ip && knownIps.has(device.ip);

    if (!user.email || !user.verified || firstDevice || legacyIp) {
        if (device.ip) await rememberTrustedDevice(user.id, device).catch((e) => console.error(`[Login] Failed to remember device for ${user.id}:`, e));
        return;
    }

    if (!match || idle) {
        const sent = await Email.sendNewLoginLocation(user as User, user.email!, {
            ip: device.ip || "127.0.0.1",
            city: (req.headers["cf-ipcity"] as string) || "Unknown City",
            region: (req.headers["cf-region"] as string) || "Unknown Region",
            country_name: (req.headers["cf-ipcountry"] as string) || "Unknown Country",
            device: device.label,
            deviceKey: device.key,
        }).catch((e) => {
            console.error(`[Login] Failed to send new login location email to ${user.id}:`, e);
            return false;
        });

        if (sent)
            throw FieldErrors({
                login: {
                    code: "ACCOUNT_LOGIN_VERIFICATION_EMAIL",
                    message: idle
                        ? "We haven't seen this device in a while. Check your e-mail to verify it's you."
                        : "New device login detected, please check your e-mail.",
                },
            });
    }

    if (device.ip) await rememberTrustedDevice(user.id, device).catch((e) => console.error(`[Login] Failed to remember device for ${user.id}:`, e));
}
