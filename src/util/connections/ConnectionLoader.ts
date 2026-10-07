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

import { Config, Connection } from "@spacebar/util";
import fs from "node:fs";
import path from "node:path";
import { ConnectionConfig } from "./ConnectionConfig";
import { ConnectionStore } from "./ConnectionStore";
import { greenBright, redBright } from "picocolors";

const root = path.join(__dirname, "..", "..", "connections");
let connectionsLoaded = false;

export class ConnectionLoader {
    public static async loadConnections() {
        if (connectionsLoaded) return;
        await ConnectionConfig.init();
        const dirs = fs.readdirSync(root).filter((x) => {
            try {
                fs.readdirSync(path.join(root, x));
                return true;
            } catch (e) {
                return false;
            }
        });

        dirs.forEach((x) => {
            const modPath = path.resolve(path.join(root, x));
            const mod = new (require(modPath).default)() as Connection;
            ConnectionStore.connections.set(mod.id, mod);

            mod.init();
            console.log(`[Connections] Loaded connection '${mod.id}' (${mod.friendlyName}) -`, mod.settings.enabled ? greenBright("enabled") : redBright("disabled"));
            if (mod.settings.enabled && !mod.isConfigured) {
                console.log(`[Connections/${mod.id}] Connection is enabled, but not configured! Users will not be able to successfully link with ${mod.friendlyName}!`);
                if (mod.requiredScopes.length > 0) {
                    console.log(`[Connections/${mod.id}] Configuring this connection requires setting scopes, or has additional requirements:`);
                    for (const scope of mod.requiredScopes) console.log(`[Connections/${mod.id}]   - ${scope}`);
                    console.log(`[Connections/${mod.id}] You can obtain the required credentials here: ${mod.setupUrl}`);
                }
            }
        });
        connectionsLoaded = true;
    }

    public static getConnectionConfig<T>(id: string, defaults?: unknown): T {
        let cfg = ConnectionConfig.get()[id] || {};
        if (defaults) {
            if (cfg && Object.keys(cfg).length > 0) cfg = Object.assign({}, defaults, cfg);
            else {
                cfg = Object.assign({}, defaults);
                this.setConnectionConfig(id, cfg).catch((e) => console.error(`[Connections/ERROR] Failed to set default config for '${id}'!`, e));
            }
        }

        // Check general config.json connections map if present
        const generalCfg = (Config.get() as Record<string, any>)?.connections?.[id];
        if (generalCfg && typeof generalCfg === "object") {
            cfg = Object.assign({}, cfg, generalCfg);
        }

        // Check environment variables (e.g. GITHUB_CLIENT_ID, CONNECTION_GITHUB_CLIENT_ID)
        const idUpper = id.toUpperCase();
        const envClientId =
            process.env[`CONNECTION_${idUpper}_CLIENT_ID`] ||
            process.env[`${idUpper}_CLIENT_ID`] ||
            process.env[`CONNECTION_${idUpper}_ID`];
        const envClientSecret =
            process.env[`CONNECTION_${idUpper}_CLIENT_SECRET`] ||
            process.env[`${idUpper}_CLIENT_SECRET`] ||
            process.env[`CONNECTION_${idUpper}_SECRET`];

        if (envClientId || envClientSecret) {
            cfg = Object.assign({}, cfg, {
                ...(envClientId ? { clientId: envClientId } : {}),
                ...(envClientSecret ? { clientSecret: envClientSecret } : {}),
            });
        }

        // if (!cfg)
        // 	console.log(
        // 		`[ConnectionConfig/WARN] Getting connection settings for '${id}' returned null! (Did you forget to add settings?)`,
        // 	);
        if (cfg && typeof cfg === "object") {
            return new Proxy(cfg, {
                get(target, property, receiver) {
                    if (property === "enabled" && !Config.get().externalRequests.thirdParty) return false;
                    return Reflect.get(target, property, receiver);
                },
            }) as T;
        }
        return cfg;
    }

    public static async setConnectionConfig(id: string, config: Partial<unknown>): Promise<void> {
        if (!config) console.warn(`[Connections/WARN] ${id} tried to set config=null!`);

        await ConnectionConfig.set({
            [id]: Object.assign({}, ConnectionConfig.get()[id] || {}, config),
        });
    }
}
