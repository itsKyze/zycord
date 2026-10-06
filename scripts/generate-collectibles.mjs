import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "..", "assets");

// Load real Discord decorations (217 items) and real profile effects (65 items)
let discordDecorations = [];
try {
    const rawDeco = await fs.readFile(path.join(assetsDir, "discord-decorations.json"), "utf8");
    discordDecorations = JSON.parse(rawDeco);
} catch {
    console.warn("Could not read discord-decorations.json, using fallback.");
}

let discordEffects = [];
try {
    const rawEffects = await fs.readFile(path.join(assetsDir, "discord-profile-effects.json"), "utf8");
    discordEffects = JSON.parse(rawEffects);
} catch {
    console.warn("Could not read discord-profile-effects.json, using fallback.");
}

// Fallback hashes if discord-decorations.json is missing
const fallbackHashes = [
    { hash: "a_0c0eeb351ae2cf48c6e1eee2cae49d40", label: "Hugh the Rainbow" },
    { hash: "a_0e839cd79500e7b68e2bbbed54790c28", label: "Phoenix" },
    { hash: "a_0f5d6c4dd8ae74662ee9c40722a56cbd", label: "Flaming Sword" },
    { hash: "a_1acbe609daec21fa5b866df9e5a42cb7", label: "Steampunk Cat Ears" },
    { hash: "a_fed43ab12698df65902ba06727e20c0e", label: "Sakura Petals" },
    { hash: "a_7d305bca6cf371df98c059f9d2ef05e4", label: "Fox Hat" },
    { hash: "a_f997880d666be69b7782bb377617b4fd", label: "Ninja Mask" },
    { hash: "a_4bdece8072c6c5e6fee2590f05312af2", label: "Cyber Katana" },
    { hash: "a_479d6b5f1184c3cc5bef4f2cd3a6e15f", label: "Wizard Wand" },
];

let baseSku = 1000000000000000000n;
const nextSku = () => String(baseSku++);

const categoriesDefinitions = [
    {
        name: "Anime & Manga",
        summary: "Energetic auras, blossoms, and legendary hero items.",
        keywords: ["sakura", "ninja", "katana", "sword", "anime", "ramen", "fox", "warrior", "fanlight", "cat ears", "jujutsu", "dragon ball", "dharma", "shuriken", "dojo", "spirit", "hero"],
    },
    {
        name: "Cyberpunk & Tech",
        summary: "Neon glitches, high-tech visors, and neural interfaces.",
        keywords: ["cyber", "glitch", "neon", "hacker", "circuit", "terminal", "grid", "ufo", "steampunk", "mech", "tron", "robot", "laser", "protocol", "matrix", "flux"],
    },
    {
        name: "Fantasy & Magic",
        summary: "Mystical runes, dragon crowns, and enchanted spells.",
        keywords: ["wizard", "dragon", "halo", "phoenix", "rune", "magic", "mystic", "spell", "fairy", "crown", "relic", "tarot", "zodiac", "potion", "dungeons", "gathering", "orb"],
    },
    {
        name: "Cute & Cozy",
        summary: "Adorable companions, froggy hats, and pastel dreams.",
        keywords: ["frog", "cat", "puppy", "duck", "heart", "hug", "love", "cute", "bear", "bunny", "cloud", "cozy", "chibi", "kawaii", "smol", "fruit", "kitten", "bugs", "lofi"],
    },
    {
        name: "Dark & Gothic",
        summary: "Shadow realm reapers, cursed flames, and gothic spines.",
        keywords: ["reaper", "fangs", "ghost", "demon", "skull", "crossbones", "shadow", "goth", "cursed", "dark", "void", "terror", "spooky", "insomnia", "horror", "watching", "stalker"],
    },
    {
        name: "Retro Arcade & Gaming",
        summary: "8-bit nostalgia, pixel hearts, and synthwave beats.",
        keywords: ["pixel", "arcade", "game", "controller", "retro", "8-bit", "crt", "joystick", "glider", "synth", "ggez", "play", "borderlands", "call of duty", "valorant", "fighter"],
    },
    {
        name: "Elements & Nature",
        summary: "Raw elemental powers: fire, ice, storm, earth, and ocean.",
        keywords: ["inferno", "frost", "lightning", "storm", "fire", "ice", "water", "earth", "leaf", "blossom", "nature", "tide", "woodland", "sea", "ocean", "autumn", "fall", "equinox"],
    },
    {
        name: "Celestial & Stars",
        summary: "Cosmic galaxies, starry constellations, and celestial bodies.",
        keywords: ["star", "nebula", "galaxy", "cosmic", "moon", "sun", "space", "astral", "planet", "comet", "eclipse", "solar", "lunar", "starlight", "cosmos"],
    },
    {
        name: "Celebrations & Special Editions",
        summary: "Festive treasures, special collaborations, and exclusive collectibles.",
        keywords: [], // Catch-all for remaining items
    },
];

// Pre-create buckets for categories
const categoryBuckets = categoriesDefinitions.map((c) => ({
    ...c,
    sku_id: nextSku(),
    decorations: [],
    effects: [],
    nameplates: [],
    frames: [],
}));

// Categorize Decorations
if (discordDecorations.length > 0) {
    for (const deco of discordDecorations) {
        const match = deco.url?.match(/avatar-decoration-presets\/([^.?]+)/);
        const assetHash = deco.asset || (match ? match[1] : null);
        if (!assetHash) continue;

        const label = deco.label || deco.name || "Avatar Decoration";
        const labelLower = label.toLowerCase();

        let assigned = false;
        for (let i = 0; i < categoryBuckets.length - 1; i++) {
            const bucket = categoryBuckets[i];
            if (bucket.keywords.some((k) => labelLower.includes(k))) {
                bucket.decorations.push({
                    id: deco.id || deco.sku_id || nextSku(),
                    asset: assetHash,
                    label: label,
                });
                assigned = true;
                break;
            }
        }
        if (!assigned) {
            categoryBuckets[categoryBuckets.length - 1].decorations.push({
                id: deco.id || deco.sku_id || nextSku(),
                asset: assetHash,
                label: label,
            });
        }
    }
} else {
    // Use fallback
    for (const item of fallbackHashes) {
        categoryBuckets[0].decorations.push({
            id: nextSku(),
            asset: item.hash,
            label: item.label,
        });
    }
}

// Categorize Profile Effects
if (discordEffects.length > 0) {
    for (const eff of discordEffects) {
        const titleLower = (eff.title || "").toLowerCase();
        let assigned = false;
        for (let i = 0; i < categoryBuckets.length - 1; i++) {
            const bucket = categoryBuckets[i];
            if (bucket.keywords.some((k) => titleLower.includes(k))) {
                bucket.effects.push(eff);
                assigned = true;
                break;
            }
        }
        if (!assigned) {
            categoryBuckets[categoryBuckets.length - 1].effects.push(eff);
        }
    }
}

// Load real Discord nameplates (285 items) and real frames (68 items)
let discordNameplates = [];
try {
    const rawNp = await fs.readFile(path.join(assetsDir, "discord-nameplates.json"), "utf8");
    discordNameplates = JSON.parse(rawNp);
} catch {
    console.warn("Could not read discord-nameplates.json");
}

let discordFrames = [];
try {
    const rawFrames = await fs.readFile(path.join(assetsDir, "discord-frames.json"), "utf8");
    discordFrames = JSON.parse(rawFrames);
} catch {
    console.warn("Could not read discord-frames.json");
}

const getPaletteFromName = (name) => {
    const l = (name || "").toLowerCase();
    if (l.includes("sakura") || l.includes("blossom") || l.includes("pink") || l.includes("bubble")) return "bubble_gum";
    if (l.includes("crimson") || l.includes("blood") || l.includes("fire") || l.includes("ruby") || l.includes("red")) return "crimson";
    if (l.includes("cyber") || l.includes("teal") || l.includes("matrix") || l.includes("ocean") || l.includes("water")) return "teal";
    if (l.includes("gold") || l.includes("sun") || l.includes("lemon") || l.includes("yellow")) return "lemon";
    if (l.includes("violet") || l.includes("mystic") || l.includes("purple") || l.includes("arcana")) return "violet";
    if (l.includes("sky") || l.includes("frost") || l.includes("ice") || l.includes("blue")) return "sky";
    if (l.includes("dark") || l.includes("void") || l.includes("black") || l.includes("onyx") || l.includes("shadow")) return "black";
    if (l.includes("clover") || l.includes("emerald") || l.includes("green") || l.includes("forest") || l.includes("garden")) return "forest";
    if (l.includes("cobalt") || l.includes("star") || l.includes("cosmic") || l.includes("galaxy")) return "cobalt";
    if (l.includes("berry") || l.includes("rose")) return "berry";
    if (l.includes("white") || l.includes("starlight") || l.includes("diamond")) return "white";
    return "violet";
};

// Categorize Nameplates
for (const np of discordNameplates) {
    const nameLower = np.name.toLowerCase();
    const palette = getPaletteFromName(np.name);
    let assigned = false;
    for (let i = 0; i < categoryBuckets.length - 1; i++) {
        const bucket = categoryBuckets[i];
        if (bucket.keywords.some((k) => nameLower.includes(k))) {
            bucket.nameplates.push({
                sku_id: np.sku_id,
                name: np.name,
                asset: np.asset,
                palette,
            });
            assigned = true;
            break;
        }
    }
    if (!assigned) {
        categoryBuckets[categoryBuckets.length - 1].nameplates.push({
            sku_id: np.sku_id,
            name: np.name,
            asset: np.asset,
            palette,
        });
    }
}

// Categorize Profile Frames
for (const fr of discordFrames) {
    const nameLower = fr.name.toLowerCase();
    let assigned = false;
    for (let i = 0; i < categoryBuckets.length - 1; i++) {
        const bucket = categoryBuckets[i];
        if (bucket.keywords.some((k) => nameLower.includes(k))) {
            bucket.frames.push({
                sku_id: fr.sku_id,
                name: fr.name,
                layer_id: fr.layer_id || fr.sku_id,
                asset: fr.asset,
            });
            assigned = true;
            break;
        }
    }
    if (!assigned) {
        categoryBuckets[categoryBuckets.length - 1].frames.push({
            sku_id: fr.sku_id,
            name: fr.name,
            layer_id: fr.layer_id || fr.sku_id,
            asset: fr.asset,
        });
    }
}

// Assemble final categories and profile effects
const categories = [];
const profileEffects = [];

for (const bucket of categoryBuckets) {
    const catSku = bucket.sku_id;
    const catProducts = [];
    const heroRanking = [];

    // 1. Process Avatar Decorations
    for (const deco of bucket.decorations) {
        const skuId = deco.id;
        heroRanking.push(skuId);

        const catalogItem = {
            type: 0,
            sku_id: skuId,
            id: skuId,
            asset: deco.asset,
            label: deco.label,
        };

        const product = {
            sku_id: skuId,
            id: skuId,
            store_listing_id: skuId,
            name: deco.label,
            summary: deco.label,
            type: 0,
            premium_type: 2,
            hide_badge: true,
            category_sku_id: catSku,
            prices: {
                "0": {
                    country_prices: {
                        country_code: "US",
                        prices: [{ amount: 0, currency: "usd", exponent: 2 }],
                    },
                },
            },
            items: [catalogItem],
            is_first_party: true,
        };

        catProducts.push(product);
    }

    // 2. Process Profile Effects
    for (const eff of bucket.effects) {
        const skuId = eff.sku_id || eff.id || nextSku();
        heroRanking.push(skuId);

        const catalogItem = {
            type: 1,
            sku_id: skuId,
            id: skuId,
            title: eff.title || "Profile Effect",
            description: eff.description || eff.accessibilityLabel || eff.title || "Profile Effect",
            accessibilityLabel: eff.accessibilityLabel || eff.title || "Profile Effect",
            animationType: eff.animationType || 2,
            thumbnailPreviewSrc: eff.thumbnailPreviewSrc,
            reducedMotionSrc: eff.reducedMotionSrc,
            effects: Array.isArray(eff.effects) && eff.effects.length > 0 ? eff.effects : [
                {
                    src: "https://cdn.discordapp.com/assets/content/effect.png",
                    loop: true,
                    height: 880,
                    width: 450,
                    duration: 3000,
                    start: 0,
                    loopDelay: 0,
                    position: { x: 0, y: 0 },
                    zIndex: 100,
                },
            ],
        };

        profileEffects.push(catalogItem);

        const product = {
            sku_id: skuId,
            id: skuId,
            store_listing_id: skuId,
            name: eff.title || "Profile Effect",
            summary: eff.description || eff.title || bucket.name,
            type: 1,
            premium_type: 2,
            hide_badge: true,
            category_sku_id: catSku,
            prices: {
                "0": {
                    country_prices: {
                        country_code: "US",
                        prices: [{ amount: 0, currency: "usd", exponent: 2 }],
                    },
                },
            },
            items: [catalogItem],
            is_first_party: true,
        };

        catProducts.push(product);
    }

    // 3. Process Nameplates
    for (const np of bucket.nameplates) {
        const skuId = np.sku_id || nextSku();
        heroRanking.push(skuId);

        const catalogItem = {
            type: 2,
            sku_id: skuId,
            id: skuId,
            asset: np.asset || `nameplates/${skuId}/`,
            palette: np.palette,
            label: np.name,
        };

        const product = {
            sku_id: skuId,
            id: skuId,
            store_listing_id: skuId,
            name: np.name,
            summary: np.name,
            type: 2,
            premium_type: 2,
            hide_badge: true,
            category_sku_id: catSku,
            prices: {
                "0": {
                    country_prices: {
                        country_code: "US",
                        prices: [{ amount: 0, currency: "usd", exponent: 2 }],
                    },
                },
            },
            items: [catalogItem],
            is_first_party: true,
        };

        catProducts.push(product);
    }

    // 4. Process Profile Frames
    for (const fr of bucket.frames) {
        const skuId = fr.sku_id || nextSku();
        heroRanking.push(skuId);
        const layerAsset = fr.asset || `${skuId}/${fr.layer_id || skuId}`;

        const catalogItem = {
            type: 3,
            sku_id: skuId,
            id: skuId,
            label: fr.name,
            asset: layerAsset,
            layers: [
                {
                    id: fr.layer_id || skuId,
                    asset: layerAsset,
                    type: "staple",
                    order: "front",
                    anchor: "top",
                    responsive: false
                },
            ],
            inner_width: 1200,
            overflow_top: 40,
            overflow_bottom: 40,
            overflow_horizontal: 56,
        };

        const product = {
            sku_id: skuId,
            id: skuId,
            store_listing_id: skuId,
            name: fr.name,
            summary: fr.name,
            type: 3,
            premium_type: 2,
            hide_badge: true,
            category_sku_id: catSku,
            prices: {
                "0": {
                    country_prices: {
                        country_code: "US",
                        prices: [{ amount: 0, currency: "usd", exponent: 2 }],
                    },
                },
            },
            items: [catalogItem],
            is_first_party: true,
        };

        catProducts.push(product);
    }

    categories.push({
        sku_id: catSku,
        name: bucket.name,
        summary: bucket.summary,
        store_listing_id: catSku,
        hero_ranking: heroRanking,
        products: catProducts,
    });
}

await fs.writeFile(path.join(assetsDir, "collectibles.json"), JSON.stringify(categories, null, 2), "utf8");
await fs.writeFile(path.join(assetsDir, "profile-effects.json"), JSON.stringify(profileEffects, null, 2), "utf8");

let totalProducts = 0;
categories.forEach((c) => (totalProducts += c.products.length));
console.log(`Successfully generated ${categories.length} categories with ${totalProducts} total collectibles (${profileEffects.length} profile effects)!`);
