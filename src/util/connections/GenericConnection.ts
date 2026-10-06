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

import { ConnectedAccount } from "../../database/entities";
import { ConnectionCallbackSchema } from "@spacebar/schemas";
import { Connection } from "./Connection";

export class GenericConnection extends Connection {
    public readonly id: string;
    public friendlyName: string;
    public setupUrl: string = "";
    public requiredScopes: string[] = [];
    settings: { enabled: boolean } = { enabled: true };

    private static friendlyNameMap: Record<string, string> = {
        steam: "Steam",
        playstation_network: "PlayStation Network",
        playstation: "PlayStation",
        xbox: "Xbox",
        spotify: "Spotify",
        youtube: "YouTube",
        twitch: "Twitch",
        twitter: "X (Twitter)",
        github: "GitHub",
        reddit: "Reddit",
        battlenet: "Battle.net",
        bnet: "Battle.net",
        epicgames: "Epic Games",
        facebook: "Facebook",
        tiktok: "TikTok",
        crunchyroll: "Crunchyroll",
        roblox: "Roblox",
        paypal: "PayPal",
        amazonmusic: "Amazon Music",
        bluesky: "Bluesky",
        domain: "Domain",
        contacts: "Contacts",
    };

    constructor(id: string, friendlyName?: string) {
        super();
        this.id = id.toLowerCase();
        this.friendlyName = friendlyName || GenericConnection.friendlyNameMap[this.id] || (this.id.charAt(0).toUpperCase() + this.id.slice(1).replace(/_/g, " "));
    }

    init(): void {}

    public get isConfigured(): boolean {
        return false;
    }

    getAuthorizationUrl(userId: string): string {
        const state = this.createState(userId);
        return `/connections/${this.id}/prompt?state=${state}`;
    }

    async handleCallback(params: ConnectionCallbackSchema): Promise<ConnectedAccount | null> {
        const { state } = params;
        const userId = this.getUserId(state);
        return null;
    }
}
