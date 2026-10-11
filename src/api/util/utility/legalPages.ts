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

import fs from "node:fs/promises";
import path from "node:path";
import { Request, Response, Router } from "express";
import { route } from "@spacebar/api/middlewares";
import { Config, PUBLIC_ASSETS_FOLDER, instanceName } from "@spacebar/util";

const LEGAL_BODIES: Record<string, (brand: string) => string> = {
	terms: (brand: string) => `
		<div class="legal-section">
			<h2>1. Acceptance of Terms</h2>
			<p>By creating an account, accessing, or using ${brand} via our Web Application, Windows Desktop Client, API, or Voice &amp; Video infrastructure, you agree to these Terms of Service and our Community Guidelines.</p>
		</div>
		<div class="legal-section">
			<h2>2. Accounts &amp; Authentication</h2>
			<p>You are responsible for safeguarding your login credentials, Two-Factor Authentication (TOTP) devices, WebAuthn Passkeys, and End-to-End Encryption (E2EE) recovery keys. You must provide accurate registration information and promptly revoke compromised sessions in User Settings.</p>
		</div>
		<div class="legal-section">
			<h2>3. User Content &amp; Community Servers</h2>
			<p>You retain ownership of messages, audio/video streams, files, and custom emojis or stickers you upload to ${brand}, while granting ${brand} the limited technical license needed to transmit, store, and display that content to the recipients and channels you designate.</p>
		</div>
		<div class="legal-section">
			<h2>4. Acceptable Use &amp; API Access</h2>
			<p>Automated bots, webhooks, and OAuth2 integrations must use official Developer Portal tokens and respect platform rate limits. Unauthorized scraping, denial-of-service attacks, or distribution of malware is strictly prohibited.</p>
		</div>
	`,
	privacy: (brand: string) => `
		<div class="legal-section">
			<h2>1. Data We Process</h2>
			<p>${brand} processes only the data required to deliver real-time messaging, voice/video calls, and community servers: account identifiers (username, email, password hash), server memberships, messages, and optional Connected Accounts you explicitly link via OAuth2.</p>
		</div>
		<div class="legal-section">
			<h2>2. End-to-End Encrypted (E2EE) Direct Messages</h2>
			<p>When End-to-End Encryption is enabled in Direct Messages, message payloads are encrypted client-side on your device using ECDH P-256 and AES-256-GCM. Private decryption keys are stored in your local vault and encrypted backup recovery store.</p>
		</div>
		<div class="legal-section">
			<h2>3. Voice, Video &amp; Screen Share</h2>
			<p>Real-time voice, video, and 1080p60 screen share streams are routed transiently through our WebRTC media servers and are never recorded or stored by ${brand}.</p>
		</div>
		<div class="legal-section">
			<h2>4. Your Controls &amp; Deletion Rights</h2>
			<p>You can edit or delete your messages, unlink OAuth2 connections, revoke active sessions, or permanently delete your account at any time from User Settings.</p>
		</div>
	`,
	guidelines: (brand: string) => `
		<div class="legal-section">
			<h2>1. Respect Every Community Member</h2>
			<p>${brand} is built for belonging. Harassment, hate speech, targeted doxxing, non-consensual intimate media, or threats of violence are never tolerated in any server, voice channel, or Direct Message.</p>
		</div>
		<div class="legal-section">
			<h2>2. Keep Servers Safe &amp; Authentic</h2>
			<ul>
				<li>Do not distribute malware, credential phishers, token grabbers, or deceptive links.</li>
				<li>Do not coordinate server raids, mass-mention spam, or automated self-bot abuse.</li>
				<li>Respect channel topic boundaries, age-restricted (NSFW) channel designations, and server moderator actions.</li>
			</ul>
		</div>
		<div class="legal-section">
			<h2>3. Reporting &amp; Enforcement</h2>
			<p>Server moderators can enforce rules locally using 64-bit Role Permissions and AutoMod filters. Platform-wide violations can be reported directly from the message context menu for Trust &amp; Safety review.</p>
		</div>
	`,
	legal: (brand: string) => `
		<div class="legal-section">
			<h2>1. ${brand} Legal &amp; Policy Overview</h2>
			<p>Welcome to the ${brand} Legal Center. Use the sidebar links to review our <a href="/terms" style="color:var(--color-hover-blurple);text-decoration:underline;">Terms of Service</a>, <a href="/privacy" style="color:var(--color-hover-blurple);text-decoration:underline;">Privacy Policy</a>, and <a href="/guidelines" style="color:var(--color-hover-blurple);text-decoration:underline;">Community Guidelines</a>.</p>
		</div>
		<div class="legal-section">
			<h2>2. Open Source &amp; Licensing</h2>
			<p>The ${brand} server platform is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). Third-party open-source libraries and cryptographic primitives are used in accordance with their respective licenses.</p>
		</div>
	`,
};

const PAGES = {
	terms: { title: "Terms of Service", url: () => Config.get().general.tosPage },
	privacy: { title: "Privacy Policy", url: () => Config.get().general.privacyPage || Config.get().general.tosPage },
	guidelines: { title: "Community Guidelines", url: () => Config.get().general.guidelinesPage || Config.get().general.tosPage },
	legal: { title: "Legal & Policy Center", url: () => Config.get().general.tosPage },
};

const escapeHtml = (text: string) => text.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);

const isWebUrl = (url?: string | null): url is string => !!url && /^https?:\/\//i.test(url.trim());

export const legalPageRouter = (kind: keyof typeof PAGES) => {
	const router = Router({ mergeParams: true });
	router.get(
		"/",
		route({
			spacebarOnly: true,
			authentication: "never",
		}),
		async (_req: Request, res: Response) => {
			const { title, url } = PAGES[kind];
			const target = url();
			res.set("Cache-Control", "no-cache");
			if (isWebUrl(target)) return res.redirect(302, target.trim());
			const { correspondenceEmail, frontPage } = Config.get().general;
			const safeBrand = escapeHtml(instanceName());
			const contact = correspondenceEmail
				? `<div class="legal-section"><h2>Contact</h2><p>Questions about how this instance is run can be sent to <a href="mailto:${escapeHtml(correspondenceEmail)}" style="color:var(--color-hover-blurple);text-decoration:underline;">${escapeHtml(correspondenceEmail)}</a>.</p></div>`
				: "";
			const bodyRenderer = LEGAL_BODIES[kind] ?? LEGAL_BODIES.legal;
			const page = await fs.readFile(path.join(PUBLIC_ASSETS_FOLDER, "legal.html"), "utf8");
			res.type("html").send(
				page
					.replaceAll("__INSTANCE_NAME__", safeBrand)
					.replaceAll("__TITLE__", escapeHtml(title))
					.replaceAll("__HOME__", escapeHtml(isWebUrl(frontPage) ? frontPage.trim() : "/"))
					.replace("__LEGAL_BODY__", bodyRenderer(safeBrand))
					.replace("__CONTACT__", contact),
			);
		},
	);
	return router;
};
