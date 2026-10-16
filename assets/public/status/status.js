"use strict";

const INSTANCE = document.body.dataset.instance || "Zycord";
const HISTORY_DAYS = 15;
const UPTIME_DAYS = 90;
const STATE_LABELS = {
    operational: "Operational",
    degraded_performance: "Degraded Performance",
    partial_outage: "Partial Outage",
    major_outage: "Major Outage",
    under_maintenance: "Under Maintenance",
    investigating: "Investigating",
    identified: "Identified",
    monitoring: "Monitoring",
    resolved: "Resolved",
    scheduled: "Scheduled",
    in_progress: "In Progress",
    verifying: "Verifying",
    completed: "Completed",
};
const BANNER = {
    none: { cls: "status-none", title: "All Systems Operational" },
    minor: { cls: "status-minor", title: "Minor Service Outage" },
    major: { cls: "status-major", title: "Partial System Outage" },
    critical: { cls: "status-critical", title: "Major Service Outage" },
    maintenance: { cls: "status-maintenance", title: "Service Under Maintenance" },
};
const BAR_FILL = {
    none: "#3ba55c",
    minor: "#f0b232",
    major: "#e67e22",
    critical: "#e74c3c",
    maintenance: "#3498db",
    null: "#e6e7e8",
};
const OUTAGE_MARK = { critical: "✕", major: "⚠", minor: "⚠", maintenance: "●" };

let metricRange = "day";
let metricSeries = { day: [], week: [], month: [] };
let metricCurrent = null;

const el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (k === "html") node.innerHTML = v;
        else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
        else if (v === true) node.setAttribute(k, "");
        else if (v != null && v !== false) node.setAttribute(k, v);
    }
    for (const child of children.flat()) {
        if (child != null && child !== false) node.append(child instanceof Node ? child : String(child));
    }
    return node;
};

const dayKey = (d) => new Date(d).toISOString().slice(0, 10);
const utcDate = (d) => new Date(`${String(d).slice(0, 10)}T00:00:00Z`);
const fmtDay = (d) =>
    utcDate(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const fmtTipDay = (d) =>
    utcDate(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const fmtStamp = (d) =>
    new Date(d).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const fmtHrsMins = (ms) => {
    const total = Math.max(0, Math.round(Number(ms) / 60000));
    return { hrs: `${Math.floor(total / 60)} hrs`, mins: `${total % 60} mins` };
};

function mockDays() {
    const today = Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate());
    return Array.from({ length: UPTIME_DAYS }, (_, i) => ({
        date: new Date(today - (UPTIME_DAYS - 1 - i) * 86400000).toISOString().slice(0, 10),
        indicator: "none",
        outages: [],
        related: [],
    }));
}

function mockSummary() {
    const names = [
        ["API", "Signing in, sending messages and everything else the app asks the server for."],
        ["Media Proxy", "Attachments, avatars, emoji and embedded images."],
        ["Gateway", "The live connection that delivers new messages, typing and presence."],
        ["Push Notifications", null],
        ["Search", null],
        ["Voice", "Voice and video calls, screen sharing and Stage channels."],
    ];
    return {
        status: { indicator: "none", description: "All Systems Operational" },
        components: names.map(([name, description]) => ({
            name,
            description,
            status: "operational",
            uptime: 100,
            uptime_days: mockDays(),
        })),
        incidents: [],
        scheduled_maintenances: [],
        history: [],
        page: { url: "/" },
    };
}

const tooltip = document.getElementById("bar-tooltip");
function outageIcon(impact) {
    return el("span", { class: `tip-icon impact-${impact}`, "aria-hidden": "true" }, OUTAGE_MARK[impact] || "●");
}

function tipContent(day) {
    const dateLabel = fmtTipDay(day.date);
    const outages = day.outages || [];
    if (day.indicator == null) {
        return el("div", {}, el("div", { class: "tip-date" }, dateLabel), el("div", { class: "tip-empty" }, "No data exists for this day."));
    }
    if (!outages.length) {
        return el("div", {}, el("div", { class: "tip-date" }, dateLabel), el("div", { class: "tip-empty" }, "No downtime recorded on this day."));
    }
    const rows = outages.map((outage) => {
        const dur = fmtHrsMins(outage.duration_ms);
        return el(
            "div",
            { class: `tip-outage impact-${outage.impact}` },
            outageIcon(outage.impact),
            el("span", { class: "tip-outage-label" }, outage.label),
            el("span", { class: "tip-dur" }, el("span", {}, dur.hrs), el("span", {}, dur.mins)),
        );
    });
    const related = (day.related || []).filter(Boolean);
    return el(
        "div",
        {},
        el("div", { class: "tip-date" }, dateLabel),
        ...rows,
        related.length ? el("div", { class: "tip-related-label" }, "Related") : null,
        ...related.map((name) => el("div", { class: "tip-related" }, name)),
    );
}

function showTip(evt, day) {
    const rect = evt.target.getBoundingClientRect();
    tooltip.replaceChildren(tipContent(day));
    tooltip.classList.add("is-visible");
    const center = rect.left + rect.width / 2;
    const width = tooltip.offsetWidth || 280;
    const left = Math.min(window.innerWidth - width / 2 - 12, Math.max(width / 2 + 12, center));
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${rect.bottom}px`;
}
function hideTip() {
    tooltip.classList.remove("is-visible");
}

function renderUptime(component) {
    const days = component.uptime_days?.length ? component.uptime_days : mockDays();
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "uptime-svg");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("viewBox", "0 0 448 34");
    svg.setAttribute("height", "34");
    svg.setAttribute("role", "img");
    const pct = Number(component.uptime ?? 100).toFixed(2);
    svg.setAttribute("aria-label", `${pct}% uptime over the past 90 days`);
    days.slice(-UPTIME_DAYS).forEach((day, i) => {
        const rect = document.createElementNS(ns, "rect");
        const ind = day.indicator === null ? "null" : day.indicator || "none";
        rect.setAttribute("height", "34");
        rect.setAttribute("width", "3");
        rect.setAttribute("x", String(i * 5));
        rect.setAttribute("y", "0");
        rect.setAttribute("fill", BAR_FILL[ind] || BAR_FILL.none);
        rect.setAttribute("tabindex", i === 0 ? "0" : "-1");
        rect.addEventListener("mouseenter", (e) => showTip(e, day));
        rect.addEventListener("focus", (e) => showTip(e, day));
        rect.addEventListener("mouseleave", hideTip);
        rect.addEventListener("blur", hideTip);
        svg.appendChild(rect);
    });
    return el(
        "div",
        { class: "uptime-wrap" },
        svg,
        el(
            "div",
            { class: "uptime-legend" },
            el("span", {}, "90 days ago"),
            el("span", { class: "uptime-value" }, `${pct} % uptime`),
            el("span", {}, "Today"),
        ),
    );
}

function renderComponent(c) {
    const help = c.description
        ? el("button", { class: "help-tip", type: "button", title: c.description, "aria-label": `More information about ${c.name}` }, "?")
        : null;
    return el(
        "div",
        { class: "component-container" },
        el(
            "div",
            { class: "component-header" },
            el("span", { class: "component-name" }, c.name, help),
            el("span", { class: `component-status ${c.status || "operational"}` }, STATE_LABELS[c.status] || "Operational"),
        ),
        renderUptime(c),
    );
}

function renderIncident(i, compact) {
    const updates = (i.incident_updates || []).map((u) =>
        el(
            "div",
            { class: "incident-update" },
            el("strong", {}, STATE_LABELS[u.status] || u.status),
            " — ",
            u.body || "",
            el("time", {}, fmtStamp(u.created_at)),
        ),
    );
    if (compact) {
        return el("div", {}, el("h4", { style: "margin:0 0 6px;font-size:16px;font-weight:600;" }, i.name), updates);
    }
    return el("div", { class: "incident-card" }, el("h3", {}, i.name), updates);
}

function renderHistory(incidents) {
    const byDay = new Map();
    for (const i of incidents || []) {
        const key = dayKey(i.created_at);
        if (!byDay.has(key)) byDay.set(key, []);
        byDay.get(key).push(i);
    }
    const today = Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate());
    return Array.from({ length: HISTORY_DAYS }, (_, n) => {
        const key = dayKey(today - n * 86400000);
        const items = byDay.get(key) ?? [];
        const empty = n === 0 ? "No incidents reported today." : "No incidents reported.";
        return el(
            "div",
            { class: `status-day${items.length ? "" : " no-incidents"}` },
            el("h3", {}, fmtDay(key).replace(/ (\d+),/, " $1,")),
            items.length ? items.map((i) => renderIncident(i, true)) : el("p", { class: "color-secondary" }, empty),
        );
    });
}

function drawMetrics() {
    const svg = document.getElementById("metric-graph");
    const avgEl = document.getElementById("metric-average");
    if (!svg) return;
    const points = metricSeries[metricRange] || [];
    if (!points.length) {
        avgEl.textContent = metricCurrent == null ? "—" : `${metricCurrent} ms`;
        svg.replaceChildren();
        return;
    }
    const w = 800;
    const h = 120;
    const max = Math.max(50, ...points.map((p) => p.ms)) * 1.15;
    const coords = points.map((p, i) => {
        const x = points.length === 1 ? 0 : (i / (points.length - 1)) * w;
        const y = h - (p.ms / max) * (h - 8) - 4;
        return `${x},${y}`;
    });
    const last = coords[coords.length - 1].split(",")[0];
    const ns = "http://www.w3.org/2000/svg";
    const path = document.createElementNS(ns, "polyline");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#5865f2");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("points", coords.join(" "));
    const area = document.createElementNS(ns, "polygon");
    area.setAttribute("fill", "rgba(88,101,242,0.12)");
    area.setAttribute("points", `0,${h} ${coords.join(" ")} ${last},${h}`);
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.replaceChildren(area, path);
    const avg = Math.round(points.reduce((s, p) => s + p.ms, 0) / points.length);
    avgEl.textContent = `${avg} ms`;
}

function renderPage(data) {
    const indicator = data.status?.indicator || "none";
    const banner = BANNER[indicator] || BANNER.none;
    const statusEl = document.getElementById("page-status");
    statusEl.className = `page-status ${banner.cls}`;
    document.getElementById("status-title").textContent = data.status?.description || banner.title;
    const updated = data.page?.updated_at || data.system?.server_time;
    document.getElementById("status-updated").textContent = updated ? `Updated ${fmtStamp(updated)}` : "";

    const open = data.incidents || [];
    const maint = data.scheduled_maintenances || [];
    const unresolved = document.getElementById("unresolved-incidents");
    if (open.length || (indicator === "maintenance" && maint.length)) {
        unresolved.hidden = false;
        unresolved.replaceChildren(...[...open, ...(indicator === "maintenance" ? maint : [])].map((i) => renderIncident(i, false)));
    } else {
        unresolved.hidden = true;
        unresolved.replaceChildren();
    }

    const components = data.components?.length ? data.components : mockSummary().components;
    document.getElementById("components").replaceChildren(...components.map(renderComponent));
    const key = document.getElementById("uptime-key");
    if (key) key.hidden = false;
    document.getElementById("history").replaceChildren(...renderHistory(data.history || []));
    const api = data.metrics?.api_response_time;
    if (api) {
        metricCurrent = api.current;
        metricSeries = {
            day: api.series?.day || [],
            week: api.series?.week || [],
            month: api.series?.month || [],
        };
        if (!metricSeries.day.length && api.current != null) {
            metricSeries.day = [{ t: Date.now(), ms: api.current }];
        }
    }
    drawMetrics();

    const home = document.getElementById("support-home");
    if (data.page?.url && /^https?:\/\//.test(data.page.url)) home.href = data.page.url;
}

async function load() {
    try {
        const res = await fetch("/api/v9/status/summary.json", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        window.__statusData = data;
        renderPage(data);
    } catch {
        if (window.__statusData) renderPage(window.__statusData);
        else renderPage(mockSummary());
    }
}

document.getElementById("subscribe-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const menu = document.getElementById("subscribe-menu");
    const open = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open);
    e.currentTarget.setAttribute("aria-expanded", String(open));
});

document.addEventListener("click", (e) => {
    const wrap = document.querySelector(".updates-dropdown-container");
    if (!wrap.contains(e.target)) {
        document.getElementById("subscribe-menu").classList.remove("is-open");
        document.getElementById("subscribe-btn").setAttribute("aria-expanded", "false");
    }
});

document.querySelectorAll("[data-sub-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelectorAll("[data-sub-tab]").forEach((b) => b.classList.toggle("active", b === btn));
        document.querySelectorAll("[data-sub-panel]").forEach((p) => {
            p.hidden = p.getAttribute("data-sub-panel") !== btn.getAttribute("data-sub-tab");
        });
    });
});

document.getElementById("email-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = e.currentTarget.email.value.trim();
    if (!email) return;
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(INSTANCE + " Status updates")}`;
});

document.getElementById("rss-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    const data = window.__statusData || mockSummary();
    const items = [...(data.incidents || []), ...(data.history || [])]
        .slice(0, 25)
        .map(
            (i) =>
                `<entry><title>${escapeXml(i.name)}</title><updated>${new Date(i.updated_at || i.created_at).toISOString()}</updated><content>${escapeXml((i.incident_updates || [])[0]?.body || "")}</content></entry>`,
        )
        .join("");
    const xml = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>${escapeXml(INSTANCE)} Status</title>${items}</feed>`;
    const url = URL.createObjectURL(new Blob([xml], { type: "application/atom+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "status.atom";
    a.click();
    URL.revokeObjectURL(url);
});

function escapeXml(s) {
    return String(s || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

document.querySelectorAll("[data-range]").forEach((btn) => {
    btn.addEventListener("click", () => {
        metricRange = btn.getAttribute("data-range");
        document.querySelectorAll("[data-range]").forEach((b) => b.classList.toggle("active", b === btn));
        drawMetrics();
    });
});

load();
setInterval(load, 30000);
