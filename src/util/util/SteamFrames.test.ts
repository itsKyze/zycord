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

import assert from "node:assert/strict";
import { test } from "node:test";
import { ExternalRequestConfiguration, allowsCdnUpstream } from "../config/types/ExternalRequestConfiguration";
import {
    STEAM_CATEGORY_SKU,
    indexSteamFrames,
    isSteamSku,
    steamFrameArtUrl,
    steamFrameByAsset,
    steamFrameBySku,
    steamFrameCategory,
    steamFrameRecency,
    steamFrameSku,
} from "./SteamFrames";

const DECORATION_ASSET = /^(?:a_)?[0-9a-f]{32}$/;
const image = (char: string) => `${char.repeat(40)}.png`;

test("steam frames get SKUs above every snowflake before 2075 and assets in discord's decoration format", () => {
    const { frames, bySku, byAsset } = indexSteamFrames({
        apps: { 730: "Counter-Strike 2" },
        frames: [
            { defid: 2, appid: 730, name: "Still", animated: false, image: image("a"), still: image("a"), created: 1 },
            { defid: 1, appid: 99, name: "Moving", animated: true, image: image("b"), still: image("c"), created: 2 },
            { defid: 1, appid: 99, name: "Duplicate", animated: true, image: image("d"), still: image("d"), created: 3 },
            { defid: 3, appid: 99, name: "Bad", animated: true, image: "../x.png", still: image("c"), created: 4 },
        ],
    });
    assert.deepEqual(
        frames.map((x) => x.name),
        ["Moving", "Still"],
    );
    assert.equal(frames[0].sku_id, "8000000000000000001");
    assert.equal(frames[0].app, "Steam");
    assert.equal(frames[1].app, "Counter-Strike 2");
    assert.match(frames[0].asset, /^a_[0-9a-f]{32}$/);
    assert.match(frames[1].asset, /^[0-9a-f]{32}$/);
    assert.ok(frames.every((x) => DECORATION_ASSET.test(x.asset)));
    assert.equal(bySku.get("8000000000000000002")?.name, "Still");
    assert.equal(byAsset.get(frames[0].asset)?.defid, 1);
    assert.equal(
        indexSteamFrames({ apps: {}, frames: [{ defid: 1, appid: 99, name: "Moving", animated: true, image: image("b"), still: image("c"), created: 9 }] }).frames[0].asset,
        frames[0].asset,
    );
    assert.ok(Number(BigInt(steamFrameSku(1)) >> 22n) + 1420070400000 > Date.UTC(2075, 0, 1));
});

test("only SKUs in the steam range are steam SKUs", () => {
    assert.equal(isSteamSku("8000000000004104245"), true);
    assert.equal(isSteamSku(STEAM_CATEGORY_SKU), false);
    assert.equal(isSteamSku("1287835633485877369"), false);
    assert.equal(isSteamSku("80000000000041042450"), false);
    assert.equal(isSteamSku("9000000000000000001"), false);
});

test("the committed catalog loads into one free category whose art the default policy fetches from steam", () => {
    const category = steamFrameCategory();
    assert.equal(category.sku_id, STEAM_CATEGORY_SKU);
    assert.ok(category.products.length > 1000);
    assert.equal(new Set(category.products.map((x) => x.items[0].asset)).size, category.products.length);
    assert.ok(category.products.every((x) => x.type === 0 && x.prices["0"].country_prices.prices[0].amount === 0 && x.items[0].sku_id === x.sku_id));
    const [product] = category.products;
    const frame = steamFrameBySku(product.sku_id);
    assert.ok(frame);
    assert.equal(steamFrameByAsset(`${frame.asset}.png`)?.sku_id, frame.sku_id);
    assert.ok((steamFrameRecency(product.sku_id) ?? 0n) < BigInt(product.sku_id));
    const policy = new ExternalRequestConfiguration();
    for (const slot of ["animated", "static"] as const) {
        const url = steamFrameArtUrl(frame, slot);
        assert.match(url, /^https:\/\/shared\.fastly\.steamstatic\.com\/community_assets\/images\/items\/\d+\/[0-9a-f]{40}\./);
        assert.equal(allowsCdnUpstream(policy, url), true);
        policy.steamAssetFallback = false;
        assert.equal(allowsCdnUpstream(policy, url), false);
        policy.steamAssetFallback = true;
    }
});

test("the steam switch only covers item art on steam's CDN", () => {
    const policy = Object.assign(new ExternalRequestConfiguration(), { thirdParty: false, steamAssetFallback: true });
    for (const url of [
        "https://shared.fastly.steamstatic.com/community_assets/images/apps/730/header.jpg",
        "https://shared.fastly.steamstatic.com/community_assets/images/items/730/../x.png",
        "https://shared.fastly.steamstatic.com/community_assets/images/items/730/short.png",
        "http://shared.fastly.steamstatic.com/community_assets/images/items/730/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.png",
        "https://steamcommunity.com/community_assets/images/items/730/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.png",
    ])
        assert.equal(allowsCdnUpstream(policy, url), false, url);
});
