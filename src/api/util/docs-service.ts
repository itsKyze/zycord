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
import type { Response } from "express";
import { brandPage, PUBLIC_ASSETS_FOLDER } from "@spacebar/util";

const DOCS_DIR = path.join(PUBLIC_ASSETS_FOLDER, "developers");
const DOCS_CACHE_DIR = path.join(DOCS_DIR, "docs_cache");

const DOCS_CUSTOM_STYLE = `
<style>
/* Zycord Developer Documentation Overrides */
:root {
  --primary: 88 101 242;
  --primary-light: 121 141 249;
  --primary-dark: 88 101 242;
}

/* Light Mode Styles */
html:not(.dark), html.light {
  color-scheme: light;
}
html:not(.dark) body, html.light body {
  background-color: #ffffff !important;
  color: #313338 !important;
}
html:not(.dark) #navbar, html.light #navbar {
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(12px) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
}
html:not(.dark) #sidebar-content, html.light #sidebar-content {
  background-color: #ffffff !important;
}
html:not(.dark) .card, html.light .card {
  background-color: #f8f9fa !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04) !important;
}
html:not(.dark) .card h2, html.light .card h2,
html:not(.dark) .card [data-component-part="card-title"], html.light .card [data-component-part="card-title"] {
  color: #060607 !important;
}
html:not(.dark) .card p, html.light .card p,
html:not(.dark) .card [data-component-part="card-content"], html.light .card [data-component-part="card-content"] {
  color: #4e5058 !important;
}

/* Dark Mode Styles */
html.dark {
  color-scheme: dark;
}
html.dark body {
  background-color: #111214 !important;
  color: #dbdee1 !important;
}
html.dark #navbar {
  background-color: rgba(17, 18, 20, 0.95) !important;
  backdrop-filter: blur(12px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}
html.dark #sidebar-content {
  background-color: #111214 !important;
}
html.dark .card {
  background-color: #1e1f22 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}
html.dark .card h2, html.dark .card [data-component-part="card-title"] {
  color: #ffffff !important;
}
html.dark .card p, html.dark .card [data-component-part="card-content"] {
  color: #949ba4 !important;
}

/* Common Card & Layout Enhancements */
.card-group {
  display: grid !important;
  gap: 16px !important;
  margin-top: 20px !important;
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
  border-radius: 14px !important;
  padding: 24px !important;
  text-decoration: none !important;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease !important;
}
.card:hover {
  border-color: #5865F2 !important;
  transform: translateY(-2px) !important;
}
html.dark .card:hover {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4) !important;
}
html:not(.dark) .card:hover, html.light .card:hover {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08) !important;
}
#sidebar-content a {
  transition: background-color 0.15s ease, color 0.15s ease !important;
  border-radius: 8px !important;
}
html.dark #sidebar-content a:hover {
  background-color: rgba(255, 255, 255, 0.06) !important;
  color: #ffffff !important;
}
html:not(.dark) #sidebar-content a:hover, html.light #sidebar-content a:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
  color: #060607 !important;
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

/* Search Modal Theme Variables */
#zy-search-overlay.is-dark #zy-search-dialog {
  background: #1e1f22;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f2f3f5;
  box-shadow: 0 24px 60px rgba(0,0,0,0.7);
}
#zy-search-overlay.is-dark .zy-search-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
#zy-search-overlay.is-dark #zy-search-input {
  color: #ffffff;
}
#zy-search-overlay.is-dark .zy-search-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: #949ba4;
}
#zy-search-overlay.is-dark .zy-search-item:hover, #zy-search-overlay.is-dark .zy-search-item.is-selected {
  background: rgba(255, 255, 255, 0.08);
}

#zy-search-overlay.is-light #zy-search-dialog {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: #060607;
  box-shadow: 0 24px 60px rgba(0,0,0,0.18);
}
#zy-search-overlay.is-light .zy-search-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
#zy-search-overlay.is-light #zy-search-input {
  color: #060607;
}
#zy-search-overlay.is-light .zy-search-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  color: #5c5e66;
}
#zy-search-overlay.is-light .zy-search-item:hover, #zy-search-overlay.is-light .zy-search-item.is-selected {
  background: rgba(0, 0, 0, 0.05);
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
        btn.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.1)';
        btn.style.color = isDark ? '#ffffff' : '#060607';
      } else {
        btn.style.backgroundColor = 'transparent';
        btn.style.color = '';
      }
    });

    if (searchModal) {
      if (isDark) {
        searchModal.classList.add('is-dark');
        searchModal.classList.remove('is-light');
      } else {
        searchModal.classList.add('is-light');
        searchModal.classList.remove('is-dark');
      }
    }
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
    { title: "Discovery on Discord", breadcrumb: "Activities > Discovery", href: "/developers/platform/discovery", desc: "Get your application or game discovered on Discord." },
    { title: "Account Linking from Discord", breadcrumb: "Social SDK > Discord Account Linking", href: "/developers/platform/account-linking", desc: "Link player accounts between Discord and your game platform." },
    { title: "Use with Discord APIs", breadcrumb: "Social SDK > How To", href: "/developers/discord-social-sdk/overview", desc: "Connect your game backend and client with Discord APIs." },
    { title: "Overview of Discord Apps", breadcrumb: "Home > App Fundamentals", href: "/developers/quick-start/overview-of-apps", desc: "Understand the core concepts of building Discord bots and applications." },
    { title: "Discord Developer Platform", breadcrumb: "Home > Welcome", href: "/developers/docs", desc: "Build bots and integrations on Discord, or connect your game with rich presence, voice chat, and more." },
    { title: "Discord Development Guide Library", breadcrumb: "Guides", href: "/developers/guides", desc: "Step-by-step tutorials and official development guides." },
    { title: "Bots & Companion Apps", breadcrumb: "Home > App Fundamentals", href: "/developers/bots/overview", desc: "Overview of automated bots, commands, and companions." },
    { title: "Activities & Embedded Web Apps", breadcrumb: "Home > Game & Platform Features", href: "/developers/activities/overview", desc: "Build multiplayer web games that run inside voice channels." },
    { title: "Social Layer for Games", breadcrumb: "Home > Game & Platform Features", href: "/developers/platform/social-layer", desc: "Voice chat, rich presence, and multiplayer social features." },
    { title: "Rich Presence", breadcrumb: "Home > Game & Platform Features", href: "/developers/platform/rich-presence", desc: "Display real-time gameplay activity directly on user profiles." },
    { title: "OAuth2 & Permissions", breadcrumb: "Home > App Fundamentals", href: "/developers/platform/oauth2-and-permissions", desc: "Configure bot permissions, OAuth2 scopes, and authentication flows." },
    { title: "Interactions & Commands", breadcrumb: "Home > App Fundamentals", href: "/developers/platform/interactions", desc: "Receive and respond to slash commands, user commands, and context menus." },
    { title: "Components & Modals", breadcrumb: "Home > App Fundamentals", href: "/developers/platform/components", desc: "Interactive buttons, select menus, text inputs, and modals." },
    { title: "Server & Channel Management", breadcrumb: "Home > App Fundamentals", href: "/developers/platform/server-and-channel-management", desc: "Manage server roles, permissions, categories, and channels." },
    { title: "Webhooks", breadcrumb: "Home > App Fundamentals", href: "/developers/platform/webhooks", desc: "Send automated messages to channels via simple HTTP POST requests." },
    { title: "Gateway & Real-time Events", breadcrumb: "API & SDK Reference > Events", href: "/developers/events/gateway", desc: "WebSocket connection for receiving real-time server events." },
    { title: "Guild / Server Resource", breadcrumb: "API & SDK Reference > Resources", href: "/developers/resources/guild", desc: "Guild object structure, endpoints, member management, and roles." },
    { title: "Channel Resource", breadcrumb: "API & SDK Reference > Resources", href: "/developers/resources/channel", desc: "Channel types, messages, permissions, and thread endpoints." },
    { title: "User Resource", breadcrumb: "API & SDK Reference > Resources", href: "/developers/resources/user", desc: "User objects, current user profile, connections, and avatars." },
    { title: "Application Resource", breadcrumb: "API & SDK Reference > Resources", href: "/developers/resources/application", desc: "Manage application metadata, bot tokens, and OAuth2 credentials." },
    { title: "Change Log & Technical Notes", breadcrumb: "Change Log", href: "/developers/change-log", desc: "Latest API updates, new features, and technical release notes." },
    { title: "Rate Limits", breadcrumb: "API & SDK Reference > Topics", href: "/developers/topics/rate-limits", desc: "Understanding HTTP rate limits, bucket headers, and exponential backoff." },
    { title: "Community Servers", breadcrumb: "Home > Game & Platform Features", href: "/developers/platform/community-servers", desc: "Build tools and integrations for Discord community servers." }
  ];

  function createSearchModal() {
    if (searchModal) return searchModal;
    var isDark = document.documentElement.classList.contains('dark');
    var overlay = document.createElement('div');
    overlay.id = 'zy-search-overlay';
    overlay.className = isDark ? 'is-dark' : 'is-light';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);z-index:99999;display:none;align-items:flex-start;justify-content:center;padding-top:12vh;';
    
    overlay.innerHTML = '<div id="zy-search-dialog" style="width:100%;max-width:600px;border-radius:14px;overflow:hidden;margin:0 16px;display:flex;flex-direction:column;">' +
      '<div class="zy-search-header" style="display:flex;align-items:center;padding:14px 18px;gap:12px;">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
        '<input id="zy-search-input" type="text" placeholder="Search..." style="flex:1;background:transparent;border:none;outline:none;font-size:15px;font-family:inherit;font-weight:500;" />' +
        '<kbd style="padding:2px 7px;border-radius:6px;font-size:11px;font-weight:600;opacity:0.6;border:1px solid currentColor;">ESC</kbd>' +
      '</div>' +
      '<div id="zy-search-results" style="max-height:420px;overflow-y:auto;padding:8px 8px;"></div>' +
      '<div class="zy-search-footer" style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;font-size:12px;">' +
        '<div style="display:flex;align-items:center;gap:14px;">' +
          '<span><kbd style="padding:1px 5px;border-radius:4px;border:1px solid currentColor;font-size:10px;margin-right:4px;">↑↓</kbd> Select</span>' +
          '<span><kbd style="padding:1px 5px;border-radius:4px;border:1px solid currentColor;font-size:10px;margin-right:4px;">↵</kbd> Open</span>' +
        '</div>' +
        '<div><kbd style="padding:1px 5px;border-radius:4px;border:1px solid currentColor;font-size:10px;margin-right:4px;">Esc</kbd> Close</div>' +
      '</div>' +
    '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeSearch();
    });

    var input = overlay.querySelector('#zy-search-input');
    input.addEventListener('input', function() {
      renderResults(input.value.trim());
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

  function highlightMatches(text, query) {
    if (!query) return text;
    var idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return text.substring(0, idx) + '<span style="color:#5865F2;font-weight:700;">' + text.substring(idx, idx + query.length) + '</span>' + text.substring(idx + query.length);
  }

  function renderResults(q) {
    var overlay = createSearchModal();
    var container = overlay.querySelector('#zy-search-results');
    var query = q.toLowerCase();
    var filtered = !query ? DOCS_SEARCH_INDEX : DOCS_SEARCH_INDEX.filter(function(item) {
      return item.title.toLowerCase().includes(query) || item.breadcrumb.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div style="padding:32px;text-align:center;opacity:0.6;font-size:14px;">No documentation matches found for "' + q + '"</div>';
      return;
    }

    container.innerHTML = filtered.map(function(item, i) {
      return '<div class="zy-search-item ' + (i === 0 ? 'is-selected' : '') + '" data-href="' + item.href + '" style="display:flex;align-items:center;gap:12px;padding:9px 12px;border-radius:8px;cursor:pointer;margin-bottom:2px;transition:background 0.1s ease;">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:0.6;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' +
        '<div style="display:flex;flex-direction:column;gap:2px;flex:1;overflow:hidden;">' +
          '<div style="font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + highlightMatches(item.title, q) + '</div>' +
          '<div style="font-size:12px;opacity:0.65;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + item.breadcrumb + '</div>' +
        '</div>' +
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
    var isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      modal.classList.add('is-dark');
      modal.classList.remove('is-light');
    } else {
      modal.classList.add('is-light');
      modal.classList.remove('is-dark');
    }
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

	// 2. Replace Mintlify navbar logo with Zycord Docs Logo (light + dark mode automatic switching)
	const zycordDocsLogo = `<a class="select-none zy-docs-brand" style="-webkit-touch-callout:none" href="/developers/docs"><span class="sr-only">Zycord Developer Documentation</span><img class="nav-logo w-auto h-7 relative object-contain shrink-0 block dark:hidden" src="/branding/zycord_docs_light.svg" alt="Zycord Developer Docs"/><img class="nav-logo w-auto h-7 relative object-contain shrink-0 hidden dark:block" src="/branding/zycord_docs_dark.svg" alt="Zycord Developer Docs"/></a>`;
	raw = raw.replace(/<a[^>]*class="select-none"[^>]*href="https?:\/\/docs\.discord\.com\/developers"[^>]*>[\s\S]*?<\/a>/i, zycordDocsLogo);

	// 3. Replace all Discord Docs Mintlify SVG logo CDN references
	raw = raw.replace(/https:\/\/mintcdn\.com\/discord\/CoUXJJtPEdmG4KWD\/logo\/docs-light\.svg(?:\?[^"'\s\\]*)?/gi, "/branding/zycord_docs_light.svg");
	raw = raw.replace(/https:\/\/mintcdn\.com\/discord\/CoUXJJtPEdmG4KWD\/logo\/docs-dark\.svg(?:\?[^"'\s\\]*)?/gi, "/branding/zycord_docs_dark.svg");

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
