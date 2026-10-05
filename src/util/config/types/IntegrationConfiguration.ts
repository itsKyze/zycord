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

export class IntegrationConfiguration {
    gifs: GifIntegrationConfiguration = new GifIntegrationConfiguration();
}

export class GifIntegrationConfiguration {
    enabled: boolean = true;
    defaultProvider: "klipy" | "tenor" = "klipy";
    klipy: GenericGifIntegrationConfiguration = Object.assign(new GenericGifIntegrationConfiguration(), { enabled: true });
    tenor: GenericGifIntegrationConfiguration = Object.assign(new GenericGifIntegrationConfiguration(), { enabled: true, apiKey: "3Z0688EVWYKH" });
}

export class GenericGifIntegrationConfiguration {
    enabled: boolean = false;
    apiKey?: string;
    apiKeyPath?: string;
}
