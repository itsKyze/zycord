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

	You should have received a copy of the GNU标志 General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { CollectiblePurchase } from "@spacebar/database";
import { CollectibleItemType, Collectibles, DiscordApiErrors } from "@spacebar/util";

export const listCollectiblePurchases = async (user_id: string) => {
    const catalog = await Collectibles.get();
    const now = new Date().toISOString();
    const seen = new Set<string>();
    const result: any[] = [];

    // All usable products and individual items in the store/catalog are unlocked and free for everyone
    for (const product of catalog.products.values()) {
        if (!product || product.type === CollectibleItemType.BUNDLE || product.type === CollectibleItemType.VARIANTS_GROUP) continue;
        if (!seen.has(product.sku_id)) {
            seen.add(product.sku_id);
            result.push({
                ...product,
                id: product.sku_id,
                purchased_at: now,
                purchase_type: 0,
                expires_at: null,
            });
        }
        for (const item of product.items ?? []) {
            if (item.sku_id && !seen.has(item.sku_id)) {
                seen.add(item.sku_id);
                result.push({
                    ...product,
                    sku_id: item.sku_id,
                    id: item.sku_id,
                    type: item.type,
                    items: [item],
                    purchased_at: now,
                    purchase_type: 0,
                    expires_at: null,
                });
            }
        }
    }

    try {
        const purchases = await CollectiblePurchase.find({ where: { user_id }, order: { purchased_at: "DESC" } });
        for (const { sku_id, purchased_at } of purchases) {
            if (seen.has(sku_id)) continue;
            const product = await Collectibles.product(sku_id);
            if (!product || product.type === CollectibleItemType.BUNDLE || product.type === CollectibleItemType.VARIANTS_GROUP) continue;
            seen.add(sku_id);
            result.push({
                ...product,
                id: product.sku_id,
                purchased_at: purchased_at.toISOString(),
                purchase_type: 0,
                expires_at: null,
            });
        }
    } catch (_) {}

    return result;
};

export const grantCollectible = async (user_id: string, sku_id: string) => {
    const sku_ids = await Collectibles.grantable(sku_id);
    if (!sku_ids.length) throw DiscordApiErrors.UNKNOWN_SKU;
    const purchased_at = new Date();
    await CollectiblePurchase.createQueryBuilder()
        .insert()
        .values(sku_ids.map((sku) => ({ user_id, sku_id: sku, purchased_at })))
        .orIgnore()
        .execute();
    return listCollectiblePurchases(user_id);
};
