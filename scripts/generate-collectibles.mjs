import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "..", "assets");

// Real working Discord CDN asset hashes
const realHashes = [
    "a_fed43ab12698df65902ba06727e20c0e",
    "a_7d305bca6cf371df98c059f9d2ef05e4",
    "a_f997880d666be69b7782bb377617b4fd",
    "a_4bdece8072c6c5e6fee2590f05312af2",
    "a_479d6b5f1184c3cc5bef4f2cd3a6e15f",
];

const categoriesData = [
    {
        name: "Anime Vibes",
        summary: "Energetic auras, blossoms, and legendary hero items.",
        items: [
            { name: "Sakura Petals", type: 0, asset: realHashes[0], label: "Sakura Petals" },
            { name: "Ki Energy Aura", type: 0, asset: realHashes[1], label: "Ki Energy Aura" },
            { name: "Ninja Mask", type: 0, asset: realHashes[2], label: "Ninja Mask" },
            { name: "Cyber Katana", type: 0, asset: realHashes[3], label: "Cyber Katana" },
            { name: "Sakura Blossom Storm", type: 1, label: "Sakura Blossom Storm" },
            { name: "Cherry Blossom Crest", type: 3, label: "Cherry Blossom Crest" },
            { name: "Crimson Honor", type: 2, palette: "crimson" },
            { name: "Violet Blade", type: 2, palette: "violet" },
        ]
    },
    {
        name: "Cyberpunk & Tech",
        summary: "Neon glitches, high-tech visors, and neural interfaces.",
        items: [
            { name: "Cyber Visor", type: 0, asset: realHashes[2], label: "Cyber Visor" },
            { name: "Hacker Glitch", type: 0, asset: realHashes[1], label: "Hacker Glitch" },
            { name: "Neon Skull", type: 0, asset: realHashes[0], label: "Neon Skull" },
            { name: "Holo Circuit", type: 0, asset: realHashes[4], label: "Holo Circuit" },
            { name: "Matrix Grid Surge", type: 1, label: "Matrix Grid Surge" },
            { name: "Neural Frame", type: 3, label: "Neural Frame" },
            { name: "Cobalt Grid", type: 2, palette: "cobalt" },
            { name: "Teal Terminal", type: 2, palette: "teal" },
        ]
    },
    {
        name: "Fantasy & Magic",
        summary: "Mystical runes, dragon crowns, and enchanted spells.",
        items: [
            { name: "Wizard Hat & Wand", type: 0, asset: realHashes[4], label: "Wizard Hat" },
            { name: "Dragon Flame Horns", type: 0, asset: realHashes[1], label: "Dragon Horns" },
            { name: "Celestial Halo", type: 0, asset: realHashes[0], label: "Celestial Halo" },
            { name: "Phoenix Crown", type: 0, asset: realHashes[3], label: "Phoenix Crown" },
            { name: "Cosmic Nebula Swirl", type: 1, label: "Cosmic Nebula Swirl" },
            { name: "Golden Royalty Frame", type: 3, label: "Golden Royalty Frame" },
            { name: "Berry Mystic", type: 2, palette: "berry" },
            { name: "Forest Magic", type: 2, palette: "forest" },
        ]
    },
    {
        name: "Cute & Cozy",
        summary: "Adorable companions, froggy hats, and pastel dreams.",
        items: [
            { name: "Froggy Hat", type: 0, asset: realHashes[3], label: "Froggy Hat" },
            { name: "Cat Ears & Whiskers", type: 0, asset: realHashes[0], label: "Cat Ears" },
            { name: "Puppy Paws", type: 0, asset: realHashes[2], label: "Puppy Paws" },
            { name: "Duck Floatie", type: 0, asset: realHashes[4], label: "Duck Floatie" },
            { name: "Sparkling Hearts Shower", type: 1, label: "Sparkling Hearts" },
            { name: "Pastel Cloud Frame", type: 3, label: "Pastel Cloud Frame" },
            { name: "Bubble Gum Pink", type: 2, palette: "bubble_gum" },
            { name: "Lemon Sunbeam", type: 2, palette: "lemon" },
        ]
    },
    {
        name: "Dark & Gothic",
        summary: "Shadow realm reapers, cursed flames, and gothic spines.",
        items: [
            { name: "Reaper Scythe", type: 0, asset: realHashes[1], label: "Reaper Scythe" },
            { name: "Vampire Fangs", type: 0, asset: realHashes[2], label: "Vampire Fangs" },
            { name: "Ghost Spirit", type: 0, asset: realHashes[0], label: "Ghost Spirit" },
            { name: "Demon Wings", type: 0, asset: realHashes[4], label: "Demon Wings" },
            { name: "Abyssal Shadow Flame", type: 1, label: "Abyssal Shadow Flame" },
            { name: "Gothic Spikes Frame", type: 3, label: "Gothic Spikes Frame" },
            { name: "Void Obsidian", type: 2, palette: "black" },
            { name: "Blood Crimson", type: 2, palette: "crimson" },
        ]
    },
    {
        name: "Retro Arcade",
        summary: "8-bit nostalgia, pixel hearts, and synthwave beats.",
        items: [
            { name: "Pixel Heart Crown", type: 0, asset: realHashes[0], label: "Pixel Heart Crown" },
            { name: "Arcade Joystick", type: 0, asset: realHashes[2], label: "Arcade Joystick" },
            { name: "Game Over Glitch", type: 0, asset: realHashes[1], label: "Game Over Glitch" },
            { name: "Retro Synth Sunset", type: 1, label: "Retro Synth Sunset" },
            { name: "Pixel CRT Border Frame", type: 3, label: "Pixel CRT Border Frame" },
            { name: "Clover Arcade", type: 2, palette: "clover" },
            { name: "Sky Glider", type: 2, palette: "sky" },
        ]
    },
    {
        name: "Elements & Nature",
        summary: "Raw elemental powers: fire, ice, storm, and earth.",
        items: [
            { name: "Blazing Inferno", type: 0, asset: realHashes[1], label: "Blazing Inferno" },
            { name: "Glacial Frost Ice", type: 0, asset: realHashes[0], label: "Glacial Frost" },
            { name: "Lightning Shock Spark", type: 0, asset: realHashes[2], label: "Lightning Shock" },
            { name: "Thunderstorm Flash", type: 1, label: "Thunderstorm Flash" },
            { name: "Elemental Surge Frame", type: 3, label: "Elemental Surge Frame" },
            { name: "Teal Tides", type: 2, palette: "teal" },
            { name: "Pure White Diamond", type: 2, palette: "white" },
        ]
    }
];

let baseSku = 1000000000000000000n;
const nextSku = () => String(baseSku++);

const categories = [];
const profileEffects = [];

for (const catData of categoriesData) {
    const catSku = nextSku();
    const catProducts = [];
    const heroRanking = [];

    for (const itemData of catData.items) {
        const prodSku = nextSku();
        const itemSku = nextSku();
        heroRanking.push(prodSku);

        let catalogItem;
        if (itemData.type === 0) {
            // Avatar Decoration
            catalogItem = {
                type: 0,
                sku_id: itemSku,
                asset: itemData.asset,
                label: itemData.label,
            };
        } else if (itemData.type === 1) {
            // Profile Effect
            catalogItem = {
                type: 1,
                sku_id: itemSku,
                id: itemSku,
                title: itemData.name,
                description: itemData.label,
                accessibilityLabel: itemData.label,
                animationType: 2,
                effects: [
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
                        randomizedSources: [],
                    }
                ]
            };
            profileEffects.push(catalogItem);
        } else if (itemData.type === 2) {
            // Nameplate
            catalogItem = {
                type: 2,
                sku_id: itemSku,
                asset: `nameplates/custom/${itemSku}/`,
                palette: itemData.palette || "crimson",
                label: itemData.name,
            };
        } else if (itemData.type === 3) {
            // Profile Frame
            catalogItem = {
                type: 3,
                sku_id: itemSku,
                label: itemData.label,
                layers: [
                    { id: "1", type: "staple", order: "front", anchor: "top", responsive: false }
                ],
                inner_width: 1200,
                overflow_top: 0,
                overflow_bottom: 0,
                overflow_horizontal: 56,
            };
        }

        const product = {
            sku_id: prodSku,
            store_listing_id: prodSku,
            name: itemData.name,
            summary: itemData.label || catData.name,
            type: itemData.type,
            premium_type: 2,
            hide_badge: true,
            category_sku_id: catSku,
            prices: {
                "0": {
                    country_prices: {
                        country_code: "US",
                        prices: [{ amount: 0, currency: "usd", exponent: 2 }],
                    }
                }
            },
            items: [catalogItem],
            is_first_party: true,
        };

        catProducts.push(product);
    }

    categories.push({
        sku_id: catSku,
        name: catData.name,
        summary: catData.summary,
        store_listing_id: catSku,
        hero_ranking: heroRanking,
        products: catProducts,
    });
}

await fs.writeFile(path.join(assetsDir, "collectibles.json"), JSON.stringify(categories, null, 2), "utf8");
await fs.writeFile(path.join(assetsDir, "profile-effects.json"), JSON.stringify(profileEffects, null, 2), "utf8");

console.log(`Generated ${categories.length} categories with ${profileEffects.length} profile effects successfully!`);
