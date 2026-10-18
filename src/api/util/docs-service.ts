/*
	Zycord: Communication platform by Zyron Solutions Ltd.
	Copyright (C) 2026 Zyron Solutions Ltd
	
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published
	by the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
*/

import fs from "node:fs/promises";
import path from "node:path";
import https from "node:https";
import { Response } from "express";
import { brandPage, PUBLIC_ASSETS_FOLDER } from "@spacebar/util";

const DOCS_DIR = path.join(PUBLIC_ASSETS_FOLDER, "developers");
const DOCS_CACHE_DIR = path.join(DOCS_DIR, "docs_cache");

const DOCS_CUSTOM_STYLE = `
<style>
/* Zycord Developer Documentation Overrides */
:root {
  --primary: 88 101 242 !important;
  --primary-light: 121 141 249 !important;
  --primary-dark: 88 101 242 !important;
  --background-dark: 32 32 36 !important;
  --background-light: 255 255 255 !important;
}
html, body {
  background-color: #202024 !important;
  color: #dbdee1 !important;
  font-family: "gg sans", "Noto Sans", system-ui, sans-serif !important;
}
#navbar {
  background-color: #202024 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.zy-docs-brand {
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
  text-decoration: none !important;
}
.zy-docs-brand-text {
  font-family: "gg sans", "Noto Sans", sans-serif !important;
  font-weight: 800 !important;
  font-size: 19px !important;
  color: #ffffff !important;
  letter-spacing: -0.015em !important;
  display: inline-flex !important;
  align-items: center !important;
}
.zy-docs-brand-sub {
  font-weight: 500 !important;
  color: #949ba4 !important;
  font-size: 15px !important;
  margin-left: 6px !important;
}
.card-group {
  display: grid !important;
  gap: 16px !important;
  margin-top: 16px !important;
  margin-bottom: 32px !important;
}
.card-group[style*="--cols:3"] {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
}
.card-group[style*="--cols:2"] {
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)) !important;
}
.card {
  display: block !important;
  background-color: #2b2d31 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 16px !important;
  padding: 24px !important;
  text-decoration: none !important;
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1), border-color 0.2s ease, box-shadow 0.2s ease !important;
}
.card:hover {
  border-color: #5865F2 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35) !important;
}
.card h2, .card [data-component-part="card-title"] {
  color: #ffffff !important;
  font-size: 17px !important;
  font-weight: 700 !important;
  margin-top: 12px !important;
  margin-bottom: 6px !important;
}
.card p, .card [data-component-part="card-content"] {
  color: #949ba4 !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
}
#sidebar-content {
  background-color: #202024 !important;
}
#sidebar-content a {
  transition: background-color 0.15s ease, color 0.15s ease !important;
  border-radius: 8px !important;
}
#sidebar-content a:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: #ffffff !important;
}
#sidebar-content [data-active="true"] > a {
  color: #5865F2 !important;
  font-weight: 700 !important;
}
img[alt="Zycord Developer Platform"], img[alt="Discord Developer Platform"] {
  border-radius: 16px !important;
  max-width: 100% !important;
  height: auto !important;
}
.zy-search-item:hover, .zy-search-item.is-selected {
  background: rgba(88, 101, 242, 0.22) !important;
}
.zy-search-item.is-selected span {
  color: #5865F2 !important;
}
</style>
`;

const DOCS_RUNTIME_SCRIPT = `
<script id="zycord-docs-runtime">
(function() {
  function applyTheme(theme) {
    var isDark = false;
    if (theme === 'system') {
      isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = (theme === 'dark');
    }
    
    var root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
    
    root.setAttribute('data-theme-preference', theme);
    try {
      localStorage.setItem('isDarkMode', isDark ? 'dark' : 'light');
      localStorage.setItem('themePreference', theme);
    } catch(e) {}
    
    var buttons = document.querySelectorAll('[data-theme-preference-value]');
    buttons.forEach(function(btn) {
      var val = btn.getAttribute('data-theme-preference-value');
      if (val === theme) {
        btn.style.backgroundColor = '#5865F2';
        btn.style.color = '#ffffff';
      } else {
        btn.style.backgroundColor = 'transparent';
        btn.style.color = '';
      }
    });
  }

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-theme-preference-value]');
    if (btn) {
      e.preventDefault();
      var val = btn.getAttribute('data-theme-preference-value');
      applyTheme(val);
    }
  });

  var savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem('themePreference') || (localStorage.getItem('isDarkMode') === 'light' ? 'light' : 'dark');
  } catch(e) {}
  applyTheme(savedTheme);

  var searchModal = null;
  var DOCS_SEARCH_INDEX = [
    { title: "Introduction", category: "Welcome", href: "/developers/docs", desc: "Build bots, apps, integrations, and games for communities with the Zycord Developer Platform." },
    { title: "Bots & Companion Apps", category: "App Fundamentals", href: "/developers/bots/overview", desc: "Overview of automated bots, commands, and companions inside Zycord." },
    { title: "Zycord Social SDK", category: "Game Features", href: "/developers/discord-social-sdk/overview", desc: "Power player connections and enhance multiplayer experiences in your game." },
    { title: "Activities & Embedded Apps", category: "Game Features", href: "/developers/activities/overview", desc: "Build rich multiplayer experiences and web games that launch directly in Zycord voice channels." },
    { title: "API Reference", category: "Reference", href: "/developers/reference", desc: "Complete REST API reference, endpoints, objects, authentication, and headers." },
    { title: "Guides & Tutorials", category: "Guides", href: "/developers/guides", desc: "Comprehensive guides for building bots, activities, and games." },
    { title: "Change Log", category: "Updates", href: "/developers/change-log", desc: "Latest API updates, new features, and technical release notes." },
    { title: "Overview of Apps", category: "Quick Start", href: "/developers/quick-start/overview-of-apps", desc: "Understand what Zycord apps are and how they interact with servers." },
    { title: "Build Your First App", category: "Quick Start", href: "/developers/quick-start/getting-started", desc: "Step-by-step tutorial to create, run, and host your first bot." },
    { title: "OAuth2 & Permissions", category: "Security", href: "/developers/platform/oauth2-and-permissions", desc: "Configure bot permissions, OAuth2 scopes, and authentication flows." },
    { title: "Interactions & Slash Commands", category: "Bots", href: "/developers/platform/interactions", desc: "Receive and respond to slash commands, user commands, and context menus." },
    { title: "Components & Modals", category: "Bots", href: "/developers/platform/components", desc: "Interactive buttons, select menus, text inputs, and modals." },
    { title: "Webhooks", category: "Integrations", href: "/developers/platform/webhooks", desc: "Send automated messages to channels via simple HTTP POST requests." },
    { title: "Gateway & Real-time Events", category: "API", href: "/developers/events/gateway", desc: "WebSocket connection for receiving real-time server events." },
    { title: "Guild / Server Resource", category: "API", href: "/developers/resources/guild", desc: "Guild object structure, endpoints, member management, and roles." },
    { title: "Channel Resource", category: "API", href: "/developers/resources/channel", desc: "Channel types, messages, permissions, and thread endpoints." },
    { title: "User Resource", category: "API", href: "/developers/resources/user", desc: "User objects, current user profile, connections, and avatars." },
    { title: "Application Resource", category: "API", href: "/developers/resources/application", desc: "Manage application metadata, bot tokens, and OAuth2 credentials." }
  ];

  function createSearchModal() {
    if (searchModal) return searchModal;
    var overlay = document.createElement('div');
    overlay.id = 'zy-search-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.72);backdrop-filter:blur(8px);z-index:99999;display:none;align-items:flex-start;justify-content:center;padding-top:12vh;';
    
    overlay.innerHTML = '<div id="zy-search-dialog" style="background:#2b2d31;width:100%;max-width:640px;border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.12);overflow:hidden;margin:0 16px;">' +
      '<div style="display:flex;align-items:center;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.08);gap:12px;">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#949ba4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
        '<input id="zy-search-input" type="text" placeholder="Search documentation, guides, and APIs..." style="flex:1;background:transparent;border:none;outline:none;color:#fff;font-size:16px;font-family:inherit;" />' +
        '<kbd style="background:#1e1f22;color:#949ba4;padding:3px 7px;border-radius:6px;font-size:12px;border:1px solid rgba(255,255,255,0.08);">ESC</kbd>' +
      '</div>' +
      '<div id="zy-search-results" style="max-height:420px;overflow-y:auto;padding:10px 8px;"></div>' +
    '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeSearch();
    });

    var input = overlay.querySelector('#zy-search-input');
    input.addEventListener('input', function() {
      renderResults(input.value.trim().toLowerCase());
    });

    input.addEventListener('keydown', function(e) {
      var items = overlay.querySelectorAll('.zy-search-item');
      var active = overlay.querySelector('.zy-search-item.is-selected');
      var idx = Array.from(items).indexOf(active);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (idx < items.length - 1) {
          if (active) active.classList.remove('is-selected');
          items[idx + 1].classList.add('is-selected');
          items[idx + 1].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (idx > 0) {
          if (active) active.classList.remove('is-selected');
          items[idx - 1].classList.add('is-selected');
          items[idx - 1].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (active) {
          var link = active.getAttribute('data-href');
          if (link) window.location.href = link;
        }
      } else if (e.key === 'Escape') {
        closeSearch();
      }
    });

    searchModal = overlay;
    return overlay;
  }

  function renderResults(q) {
    var overlay = createSearchModal();
    var container = overlay.querySelector('#zy-search-results');
    var filtered = !q ? DOCS_SEARCH_INDEX : DOCS_SEARCH_INDEX.filter(function(item) {
      return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div style="padding:28px;text-align:center;color:#949ba4;">No documentation matches found for "' + q + '"</div>';
      return;
    }

    container.innerHTML = filtered.map(function(item, i) {
      return '<div class="zy-search-item ' + (i === 0 ? 'is-selected' : '') + '" data-href="' + item.href + '" style="display:flex;flex-direction:column;gap:3px;padding:10px 14px;border-radius:8px;cursor:pointer;margin-bottom:4px;transition:background 0.12s ease;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;">' +
          '<span style="font-weight:600;color:#fff;font-size:15px;">' + item.title + '</span>' +
          '<span style="background:#5865F2;color:#fff;font-size:11px;font-weight:600;padding:2px 7px;border-radius:12px;">' + item.category + '</span>' +
        '</div>' +
        '<p style="color:#949ba4;font-size:13px;margin:0;line-height:1.4;">' + item.desc + '</p>' +
      '</div>';
    }).join('');

    container.querySelectorAll('.zy-search-item').forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        container.querySelectorAll('.zy-search-item').forEach(function(e) { e.classList.remove('is-selected'); });
        el.classList.add('is-selected');
      });
      el.addEventListener('click', function() {
        var link = el.getAttribute('data-href');
        if (link) window.location.href = link;
      });
    });
  }

  function openSearch() {
    var modal = createSearchModal();
    modal.style.display = 'flex';
    var input = modal.querySelector('#zy-search-input');
    input.value = '';
    renderResults('');
    setTimeout(function() { input.focus(); }, 40);
  }

  function closeSearch() {
    if (searchModal) searchModal.style.display = 'none';
  }

  document.addEventListener('click', function(e) {
    if (e.target.closest('#search-bar-entry') || e.target.closest('#search-bar-entry-mobile')) {
      e.preventDefault();
      e.stopPropagation();
      openSearch();
    }
  });

  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') {
      closeSearch();
    }
  });

  document.addEventListener('click', function(e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href) return;
    if (href.startsWith('/developers/') || href.startsWith('/docs')) {
      if (!href.startsWith('http') && !a.target && !href.startsWith('#')) {
        e.preventDefault();
        window.location.href = href;
      }
    }
  });
})();
</script>
`;

export function transformDocsHtml(raw: string): string {
	// 1. Rewrite relative Mintlify asset paths to Discord live CDN
	raw = raw.replaceAll("/mintlify-assets/", "https://docs.discord.com/mintlify-assets/");

	// 2. Replace Mintlify navbar logo with Zycord Docs Logo
	const zycordDocsLogo = `<a class="select-none zy-docs-brand" style="-webkit-touch-callout:none" href="/developers"><span class="sr-only">Zycord Documentation</span><img class="nav-logo" src="/branding/zycord_icon_white.svg" alt="Zycord" style="width:28px;height:28px;object-fit:contain;display:block;" onerror="this.src='/site/zycord_icon_white.svg'"/><span class="zy-docs-brand-text">Zycord <span class="zy-docs-brand-sub">Docs</span></span></a>`;
	raw = raw.replace(/<a[^>]*class="select-none"[^>]*href="https?:\/\/docs\.discord\.com\/developers"[^>]*>[\s\S]*?<\/a>/i, zycordDocsLogo);

	// 3. Replace all Discord Docs Mintlify SVG logo CDN references
	raw = raw.replace(/https:\/\/mintcdn\.com\/discord\/CoUXJJtPEdmG4KWD\/logo\/docs-(?:light|dark)\.svg(?:\?[^"'\s\\]*)?/gi, "/branding/zycord_icon_white.svg");

	// 4. Inject custom CSS for documentation
	raw = raw.replace("</head>", `${DOCS_CUSTOM_STYLE}\n</head>`);

	// 5. Normalize internal developer links
	raw = raw.replaceAll("https://discord.com/developers/home", "/developers/applications");
	raw = raw.replaceAll("https://discord.com/developers/applications", "/developers/applications");
	raw = raw.replaceAll("https://discord.com/developers/docs/intro", "/developers/docs");
	raw = raw.replaceAll("https://docs.discord.com/developers/intro", "/developers/docs");
	raw = raw.replaceAll("https://discord.com/developers/docs", "/developers/docs");
	raw = raw.replaceAll("https://docs.discord.com/developers", "/developers/docs");
	raw = raw.replaceAll("https://discord.com/community", "/discover");
	raw = raw.replaceAll("https://discord.com/servers", "/discover");
	raw = raw.replaceAll("https://discord.com/download", "/download");
	raw = raw.replaceAll("https://discord.com/nitro", "/nitro");
	raw = raw.replaceAll("https://discord.com/safety", "/safety");
	raw = raw.replaceAll("https://discord.com/blog", "/blog");
	raw = raw.replaceAll("https://discord.com/careers", "/careers");
	raw = raw.replaceAll("https://discord.com/app", "/app");
	raw = raw.replaceAll("https://support-dev.discord.com/hc/en-us", "/support");
	raw = raw.replaceAll("https://support.discord.com/hc", "/support");
	raw = raw.replaceAll("https://support-dev.discord.com/", "/support");
	raw = raw.replaceAll("https://discordstatus.com/", "/status");
	raw = raw.replaceAll("https://discord.com/invite/discord-developers", "/discover");
	raw = raw.replaceAll("https://github.com/discord/discord-api-docs", "/community");

	// 6. Brand naming replacements
	raw = raw.replaceAll("Documentation - Discord", "Zycord Developer Documentation");
	raw = raw.replaceAll("Discord Developer Platform", "Zycord Developer Platform");
	raw = raw.replaceAll("Discord Developer Portal", "Zycord Developer Portal");
	raw = raw.replaceAll("New to Discord development?", "New to Zycord development?");
	raw = raw.replaceAll("New to Discord", "New to Zycord");
	raw = raw.replaceAll("Discord Bots", "Zycord Bots");
	raw = raw.replaceAll("Discord bots", "Zycord bots");
	raw = raw.replaceAll("Discord apps", "Zycord apps");
	raw = raw.replaceAll("Discord app", "Zycord app");
	raw = raw.replaceAll("Discord server", "Zycord server");
	raw = raw.replaceAll("Discord Server", "Zycord Server");
	raw = raw.replaceAll("Discord community", "Zycord community");
	raw = raw.replaceAll("Discord's", "Zycord's");
	raw = raw.replaceAll("Discord’s", "Zycord’s");
	raw = raw.replaceAll("Discord?s", "Zycord’s");
	raw = raw.replaceAll("inside Discord", "inside Zycord");
	raw = raw.replaceAll("with Discord", "with Zycord");
	raw = raw.replaceAll("to Discord", "to Zycord");
	raw = raw.replaceAll("on Discord", "on Zycord");
	raw = raw.replaceAll("How to Discord", "How to Zycord");
	raw = raw.replaceAll("Why Discord", "Why Zycord");
	raw = raw.replaceAll("Discord API", "Zycord API");
	raw = raw.replaceAll("Discord SDK", "Zycord SDK");
	raw = raw.replaceAll("Join the Developer Discord", "Join Developer Community");
	raw = raw.replaceAll("Discord Developer Policy", "Zycord Developer Policy");
	raw = raw.replaceAll("Discord Developer Terms of Service", "Zycord Developer Terms of Service");

	// 7. Strip trackers
	raw = raw.replace(/<!-- section:dataLayer -->[\s\S]*?<!-- endsection -->/gi, "");
	raw = raw.replace(/<script[^>]*otSDKStub\.js[^>]*><\/script>/gi, "");
	raw = raw.replace(/<script[^>]*OtAutoBlock\.js[^>]*><\/script>/gi, "");
	raw = raw.replace(/<script>[^<]*challenge-platform[^<]*<\/script>/gi, "");

	// 8. Inject Docs interactive runtime
	raw = raw.replace("</body>", `${DOCS_RUNTIME_SCRIPT}\n</body>`);

	return raw;
}

function fetchPageLive(slug: string): Promise<string> {
	const url = `https://docs.discord.com/developers/${slug}`;
	return new Promise((resolve, reject) => {
		const req = https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } }, (res) => {
			if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
				const nextSlug = res.headers.location.replace(/^https:\/\/docs\.discord\.com\/developers\/?/, "");
				return resolve(fetchPageLive(nextSlug));
			}
			if (res.statusCode !== 200) {
				return reject(new Error(`Failed to fetch ${url}: HTTP ${res.statusCode}`));
			}
			let data = "";
			res.on("data", (chunk) => (data += chunk));
			res.on("end", () => resolve(data));
		});
		req.on("error", reject);
		req.setTimeout(8000, () => {
			req.destroy();
			reject(new Error(`Timeout fetching ${url}`));
		});
	});
}

export function cleanSlug(rawSlug?: string): string {
	if (!rawSlug) return "intro";
	let s = rawSlug.trim().replace(/^\/+|\/+$/g, "");
	if (!s || s === "docs" || s === "developers" || s === "developers/docs" || s === "index") {
		return "intro";
	}
	if (s.startsWith("developers/docs/")) s = s.replace(/^developers\/docs\//, "");
	else if (s.startsWith("developers/")) s = s.replace(/^developers\//, "");
	else if (s.startsWith("docs/")) s = s.replace(/^docs\//, "");

	s = s.replace(/\.(html|md)$/i, "");
	return s || "intro";
}

export async function getOrFetchDocPage(rawSlug?: string): Promise<string> {
	const slug = cleanSlug(rawSlug);
	const safeName = slug.replaceAll("/", "__") + ".html";
	const cachedFilePath = path.join(DOCS_CACHE_DIR, safeName);

	try {
		const content = await fs.readFile(cachedFilePath, "utf8");
		return content;
	} catch (_e) {
		// Not in cache, try fetching live
	}

	try {
		const raw = await fetchPageLive(slug);
		const transformed = transformDocsHtml(raw);
		await fs.mkdir(DOCS_CACHE_DIR, { recursive: true }).catch(() => {});
		await fs.writeFile(cachedFilePath, transformed, "utf8").catch(() => {});
		return transformed;
	} catch (err) {
		console.warn(`[Docs] Failed to load/fetch doc page "${slug}":`, err);
		// Fallback to docs.html or intro.html
		try {
			return await fs.readFile(path.join(DOCS_DIR, "docs.html"), "utf8");
		} catch {
			return `<!DOCTYPE html><html><head><title>Zycord Docs</title></head><body style="background:#202024;color:#fff;font-family:sans-serif;padding:40px;"><h1>Zycord Documentation</h1><p>Welcome to the Zycord Developer Documentation. Visit <a href="/developers/docs" style="color:#5865F2">Documentation Home</a>.</p></body></html>`;
		}
	}
}

export async function sendDocResponse(res: Response, rawSlug?: string): Promise<Response> {
	const content = await getOrFetchDocPage(rawSlug);
	res.set("Cache-Control", "no-cache");
	return res.type("html").send(brandPage(content));
}
