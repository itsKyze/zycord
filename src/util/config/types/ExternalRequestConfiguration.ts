/** Runtime network policy. Local files, database records and cached assets remain usable. */
export class ExternalRequestConfiguration {
    discordDecorations: boolean = true;
    discordAssetFallback: boolean = true;
    discordClientAssets: boolean = true;
    discordGames: boolean = true;
    discordTemplates: boolean = true;
    discordStickerPacks: boolean = true;
    discordBadDomains: boolean = false;
    thirdParty: boolean = true;
}

/** Discord's assets exempt from local-first blocking to ensure full parity with badges, decorations, sounds, and media. */
export function isDiscordDecorationAsset(pathname: string): boolean {
    return [
        "/avatar-decoration-presets/",
        "/assets/collectibles/",
        "/assets/profile_effects/",
        "/media/v1/collectibles-shop/",
        "/badge-icons/",
        "/assets/content/",
        "/soundboard-sounds/",
        "/emojis/",
        "/stickers/",
        "/app-icons/",
    ].some(
        (prefix) => pathname.startsWith(prefix) && pathname.length > prefix.length,
    );
}

export function allowsCdnUpstream(policy: ExternalRequestConfiguration, raw: string): boolean {
    try {
        const url = new URL(raw);
        if (url.protocol !== "https:" || url.username || url.password || url.port || /%2f|%5c/i.test(url.pathname)) return false;
        if (url.hostname !== "cdn.discordapp.com") return policy.thirdParty;
        if (/^\/stickers\/\d+\.(?:png|json|gif)$/.test(url.pathname)) return policy.discordStickerPacks;
        return isDiscordDecorationAsset(url.pathname) ? (policy.discordDecorations || policy.discordAssetFallback) : policy.discordAssetFallback;
    } catch {
        return false;
    }
}
