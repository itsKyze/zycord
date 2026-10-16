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

import { In, LessThan, MoreThan, Not } from "typeorm";
import { RESOLVED_INCIDENT_STATES, StatusComponent, StatusComponentStatus, StatusIncident, StatusMetric, getDatabase } from "@spacebar/database";
import { Config, Snowflake } from "@spacebar/util";
import { Monitoring } from "../../../util/monitoring/Monitoring";

// statuspage.io-compatible shapes, so existing status tooling (and the discord client's upcoming.json poll) understand them
const IMPACT_SEVERITY = { none: 0, maintenance: 1, minor: 2, major: 3, critical: 4 } as const;
type Indicator = keyof typeof IMPACT_SEVERITY;

const INDICATOR_DESCRIPTIONS: Record<Indicator, string> = {
    none: "All Systems Operational",
    maintenance: "Service Under Maintenance",
    minor: "Minor Service Outage",
    major: "Partial System Outage",
    critical: "Major Service Outage",
};

const COMPONENT_INDICATOR: Record<StatusComponentStatus, Indicator> = {
    operational: "none",
    under_maintenance: "maintenance",
    degraded_performance: "minor",
    partial_outage: "major",
    major_outage: "critical",
};

export function serializeComponent(component: StatusComponent) {
    return {
        id: component.id,
        name: component.name,
        description: component.description ?? null,
        status: component.status,
        position: component.position,
        updated_at: component.updated_at,
    };
}

export function serializeIncident(incident: StatusIncident, components: StatusComponent[]) {
    return {
        id: incident.id,
        name: incident.name,
        status: incident.status,
        impact: incident.impact,
        created_at: incident.created_at,
        updated_at: incident.updated_at,
        resolved_at: incident.resolved_at ?? null,
        scheduled_for: incident.scheduled_for ?? null,
        scheduled_until: incident.scheduled_until ?? null,
        components: components.filter((c) => incident.component_ids.includes(c.id)).map(serializeComponent),
        incident_updates: [...incident.updates].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    };
}

const DAY = 24 * 60 * 60 * 1000;
const UPTIME_DAYS = 90;
const METRIC_KEEP_MS = 35 * DAY;
const OUTAGE_WEIGHT: Partial<Record<Indicator, number>> = { minor: 0.1, major: 0.3, critical: 1 };
const OUTAGE_LABEL: Partial<Record<Indicator, string>> = {
    minor: "Degraded performance",
    major: "Partial outage",
    critical: "Major outage",
    maintenance: "Maintenance",
};

type DayOutage = { impact: Indicator; label: string; duration_ms: number };
type UptimeDay = { date: string; indicator: Indicator | null; outages: DayOutage[]; related: string[] };

function componentUptime(component: StatusComponent, incidents: StatusIncident[], now: number) {
    const today = Math.floor(now / DAY) * DAY;
    const firstDay = today - (UPTIME_DAYS - 1) * DAY;
    const createdAt = Number(BigInt(component.id) >> 22n) + Snowflake.EPOCH;
    const tracked = Math.max(firstDay, createdAt);
    const days: UptimeDay[] = Array.from({ length: UPTIME_DAYS }, (_, i) => {
        const start = firstDay + i * DAY;
        return {
            date: new Date(start).toISOString().slice(0, 10),
            indicator: start + DAY <= createdAt ? null : ("none" as Indicator | null),
            outages: [] as DayOutage[],
            related: [] as string[],
        };
    });
    const durations = days.map(() => new Map<Indicator, number>());
    const related = days.map(() => new Set<string>());
    let downtime = 0;
    for (const incident of incidents) {
        if (!incident.component_ids.includes(component.id)) continue;
        const start = incident.created_at.getTime();
        const end = incident.resolved_at?.getTime() ?? now;
        if (end <= start) continue;
        const impact = incident.impact as Indicator;
        if (!incident.is_maintenance) {
            const clippedStart = Math.max(start, tracked);
            const clippedEnd = Math.min(end, now);
            if (clippedEnd > clippedStart) downtime += (clippedEnd - clippedStart) * (OUTAGE_WEIGHT[impact] ?? 0);
        }
        for (let day = Math.floor(start / DAY) * DAY; day < end && day <= today; day += DAY) {
            const index = (day - firstDay) / DAY;
            const entry = days[index];
            if (!entry || entry.indicator === null) continue;
            const overlap = Math.min(end, day + DAY) - Math.max(start, day);
            if (overlap <= 0) continue;
            durations[index].set(impact, (durations[index].get(impact) ?? 0) + overlap);
            related[index].add(incident.name);
            if (IMPACT_SEVERITY[impact] > IMPACT_SEVERITY[entry.indicator ?? "none"]) entry.indicator = impact;
        }
    }
    const current = COMPONENT_INDICATOR[component.status];
    const last = days[days.length - 1];
    if (last.indicator !== null && IMPACT_SEVERITY[current] > IMPACT_SEVERITY[last.indicator ?? "none"]) last.indicator = current;
    for (let i = 0; i < days.length; i++) {
        days[i].outages = [...durations[i].entries()]
            .filter(([impact]) => impact !== "none")
            .sort((a, b) => IMPACT_SEVERITY[b[0]] - IMPACT_SEVERITY[a[0]])
            .map(([impact, duration_ms]) => ({ impact, label: OUTAGE_LABEL[impact] || impact, duration_ms: Math.round(duration_ms) }));
        days[i].related = [...related[i]];
    }
    const span = now - tracked;
    return { uptime: span > 0 ? Math.max(0, Math.round((1 - downtime / span) * 10000) / 100) : 100, uptime_days: days };
}

type MetricPoint = { t: number; ms: number };
const metricMemory: MetricPoint[] = [];
let metricHydrated = false;
let metricTimer: ReturnType<typeof setInterval> | null = null;
let lastPrune = 0;

function bucketSeries(samples: MetricPoint[], spanMs: number, bucketMs: number, now: number) {
    const start = now - spanMs;
    const buckets = new Map<number, { sum: number; n: number }>();
    for (const sample of samples) {
        if (sample.t < start) continue;
        const key = Math.floor(sample.t / bucketMs) * bucketMs;
        const bucket = buckets.get(key) ?? { sum: 0, n: 0 };
        bucket.sum += sample.ms;
        bucket.n += 1;
        buckets.set(key, bucket);
    }
    return [...buckets.keys()]
        .sort((a, b) => a - b)
        .map((t) => ({ t, ms: Math.round(buckets.get(t)!.sum / buckets.get(t)!.n) }));
}

async function hydrateMetrics() {
    if (metricHydrated) return;
    metricHydrated = true;
    try {
        const rows = await StatusMetric.find({
            where: { recorded_at: MoreThan(new Date(Date.now() - METRIC_KEEP_MS)) },
            order: { recorded_at: "ASC" },
            take: 60_000,
        });
        metricMemory.length = 0;
        for (const row of rows) metricMemory.push({ t: row.recorded_at.getTime(), ms: row.api_ms });
    } catch {
        metricMemory.length = 0;
    }
}

async function persistApiSample() {
    const ms = await Monitoring.sampleHttpMs();
    const point = { t: Date.now(), ms };
    metricMemory.push(point);
    if (metricMemory.length > 60 * 24 * 40) metricMemory.splice(0, metricMemory.length - 60 * 24 * 35);
    try {
        await StatusMetric.create({ recorded_at: new Date(point.t), api_ms: ms }).save();
        if (point.t - lastPrune > DAY) {
            lastPrune = point.t;
            await StatusMetric.delete({ recorded_at: LessThan(new Date(point.t - METRIC_KEEP_MS)) });
        }
    } catch {
        /* table may not exist until migrate */
    }
    return ms;
}

function ensureMetricSampler() {
    if (metricTimer) return;
    metricTimer = setInterval(() => {
        persistApiSample().catch(() => {});
    }, 60_000);
    metricTimer.unref?.();
}

async function apiMetrics() {
    await hydrateMetrics();
    ensureMetricSampler();
    const current = metricMemory.length ? metricMemory[metricMemory.length - 1].ms : await persistApiSample();
    const now = Date.now();
    return {
        api_response_time: {
            unit: "ms",
            current: Math.round(current),
            series: {
                day: bucketSeries(metricMemory, DAY, 15 * 60 * 1000, now),
                week: bucketSeries(metricMemory, 7 * DAY, 60 * 60 * 1000, now),
                month: bucketSeries(metricMemory, 30 * DAY, 3 * 60 * 60 * 1000, now),
            },
        },
    };
}

export async function getStatusSummary() {
    const now = Date.now();
    const components = await StatusComponent.find({ order: { position: "ASC", id: "ASC" } });
    const open = await StatusIncident.find({ where: { status: Not(In(RESOLVED_INCIDENT_STATES)) }, order: { created_at: "DESC" } });
    const recent = await StatusIncident.find({
        where: { status: In(RESOLVED_INCIDENT_STATES), resolved_at: MoreThan(new Date(now - 14 * DAY)) },
        order: { resolved_at: "DESC" },
        take: 25,
    });
    const quarter = components.length
        ? await StatusIncident.find({ where: { status: In(RESOLVED_INCIDENT_STATES), resolved_at: MoreThan(new Date(now - UPTIME_DAYS * DAY)) } })
        : [];

    const incidents = open.filter((i) => !i.is_maintenance);
    const maintenances = open.filter((i) => i.is_maintenance);
    // upcoming maintenance shouldn't colour the page until it starts
    const activeMaintenances = maintenances.filter((i) => i.status !== "scheduled");

    let indicator: Indicator = "none";
    const raise = (candidate: Indicator) => {
        if (IMPACT_SEVERITY[candidate] > IMPACT_SEVERITY[indicator]) indicator = candidate;
    };
    for (const incident of [...incidents, ...activeMaintenances]) raise(incident.impact);
    for (const component of components) raise(COMPONENT_INDICATOR[component.status]);

    const updatedAt = [...components.map((c) => c.updated_at), ...open.map((i) => i.updated_at), ...recent.map((i) => i.updated_at)].reduce(
        (latest: Date | null, d) => (!latest || d > latest ? d : latest),
        null,
    );

    let traffic = null;
    try {
        const snap = await Monitoring.snapshot();
        traffic = {
            total_requests: snap.requests,
            errors: snap.errors,
            rate_limited: snap.rate_limited,
            memory_heap_used: snap.memory.heapUsed,
            memory_rss: snap.memory.rss,
            event_loop_ms: Math.round(snap.event_loop.mean_ms * 100) / 100,
        };
    } catch {
        const mem = process.memoryUsage();
        traffic = {
            total_requests: 0,
            errors: 0,
            rate_limited: 0,
            memory_heap_used: mem.heapUsed,
            memory_rss: mem.rss,
            event_loop_ms: 0,
        };
    }

    const metrics = await apiMetrics();

    return {
        page: {
            id: Config.get().general.instanceId,
            name: Config.get().general.instanceName,
            url: Config.get().general.frontPage,
            updated_at: updatedAt ?? new Date(0),
        },
        system: {
            uptime_seconds: Math.floor(process.uptime()),
            server_time: now,
            database_connected: !!getDatabase(),
            traffic,
        },
        status: { indicator, description: INDICATOR_DESCRIPTIONS[indicator] },
        components: components.map((c) => ({ ...serializeComponent(c), ...componentUptime(c, [...open, ...quarter], now) })),
        incidents: incidents.map((i) => serializeIncident(i, components)),
        scheduled_maintenances: maintenances.map((i) => serializeIncident(i, components)),
        history: recent.map((i) => serializeIncident(i, components)),
        metrics,
    };
}

export async function setComponentsStatus(ids: string[], status: StatusComponentStatus) {
    if (!ids.length) return;
    await StatusComponent.update({ id: In(ids) }, { status, updated_at: new Date() });
}

// once an incident closes, put its components back to operational unless another open incident still covers them
export async function releaseComponents(incident: StatusIncident) {
    if (!incident.component_ids.length) return;
    const stillOpen = await StatusIncident.find({ where: { status: Not(In(RESOLVED_INCIDENT_STATES)), id: Not(incident.id) }, select: { id: true, component_ids: true } });
    const busy = new Set(stillOpen.flatMap((i) => i.component_ids));
    await setComponentsStatus(
        incident.component_ids.filter((id) => !busy.has(id)),
        "operational",
    );
}
