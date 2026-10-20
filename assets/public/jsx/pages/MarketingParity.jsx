import { h, Fragment } from "../runtime.jsx";

const WF = "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2";
const DC = "https://cdn.discordapp.com";

function ExploreMore({ href }) {
	return (
		<a className="zy-dc-explore" href={href}>
			Explore More
		</a>
	);
}

function VerifiedBadge() {
	return (
		<svg className="zy-dc-verified" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
			<path d="M16 7.6c0 .8-.3 1.5-.8 2 .1.4.1.8 0 1.2-.1.4-.3.8-.6 1.1-.3.3-.6.6-1 .8-.2.4-.5.8-.8 1.1-.4.3-.8.5-1.2.6-.3.4-.7.7-1.2.9H8.8c-.5-.1-1-.3-1.4-.6-.4-.2-.8-.4-1.1-.8-.4-.1-.8-.3-1.1-.6-.4-.3-.7-.6-1-.9-.3-.3-.5-.7-.6-1.1-.4-.2-.7-.5-1-.8-.2-.3-.4-.7-.5-1.1 0-.4 0-.8.1-1.2C.3 9.1 0 8.4 0 7.6s.3-1.5.8-2c-.1-.4-.1-.8 0-1.2.1-.4.3-.8.6-1.1.3-.3.6-.6 1-.8.2-.4.5-.8.8-1.1.4-.3.8-.5 1.2-.6C4.9.5 5.3.2 5.8 0h1.6c.5.1 1 .3 1.4.6.4.2.8.4 1.1.8.4.1.8.3 1.1.6.4.3.7.6 1 .9.3.3.5.7.6 1.1.4.2.7.5 1 .8.2.3.4.7.5 1.1 0 .4 0 .8-.1 1.2.5.5.8 1.2.8 2zM6.7 10.7l4.8-4.8-.9-.9-3.9 3.9-1.7-1.7-.9.9 2.6 2.6z" />
		</svg>
	);
}

function Wrap({ light, className, children }) {
	return <div className={`zy-dc-page${light ? " is-light" : ""}${className ? " " + className : ""}`}>{children}</div>;
}

export function NotFoundPage() {
	return (
		<div className="zy-dc-404">
			<div className="zy-dc-404-icon">
				<img src="/static/logo.png" alt="" width="240" height="240" />
			</div>
			<span className="zy-dc-404-badge">Error 404</span>
			<h1 className="zy-dc-404-title">Wrong turn in hyperspace</h1>
			<p className="zy-dc-404-copy">Nothing on Zycord lives at this address. The link might be mistyped, or the channel may have moved.</p>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Discover — discord.com/servers + /trending-games                           */
/* -------------------------------------------------------------------------- */

const SERVERS = [
	{ slug: "midjourney-662267976984297473", name: "Midjourney", cat: "tech", splash: `${DC}/discovery-splashes/662267976984297473/4798759e115d2500fef16347d578729a.jpg?size=2048&format=auto`, icon: `${DC}/icons/662267976984297473/39128f6c9fc33f4c95a27d4c601ad7db.png?size=256`, online: "563,446", members: "18,500,000", verified: true, desc: "The official server for Midjourney, a text-to-image AI where your imagination is the only limit." },
	{ slug: "steal-a-brainrot-1376018788041887795", name: "Steal a Brainrot", cat: "gaming", splash: `${DC}/discovery-splashes/1376018788041887795/7a06ebb2b3d4cb427a4c4358ec29cfa2.jpg?size=2048&format=auto`, icon: `${DC}/icons/1376018788041887795/f9f69ceda1bb918075ee1b2fd4cb5fcc.png?size=256`, online: "412,200", members: "4,800,000", verified: true, desc: "The official Steal a Brainrot community. Trades, raids, and meme drops." },
	{ slug: "marvel-rivals-1193841000108531764", name: "Marvel Rivals", cat: "gaming", splash: `${DC}/discovery-splashes/1193841000108531764/51616fd10037ad2235bfd97ca727070b.jpg?size=2048&format=auto`, icon: `${DC}/icons/1193841000108531764/807325567b1a89e4e6b14d2e33fa36e1.png?size=256`, online: "198,400", members: "2,100,000", verified: true, desc: "Official Marvel Rivals. Squad up, track patches, and watch rivalries unfold." },
	{ slug: "viggle-1181076253172842537", name: "Viggle", cat: "entertainment", splash: `${DC}/discovery-splashes/1181076253172842537/b63947d7c3bf5611b37317d8d5cc4137.jpg?size=2048&format=auto`, icon: `${DC}/icons/1181076253172842537/b0b5c7a17230480cda325c9210f914e6.png?size=256`, online: "88,120", members: "1,240,000", verified: true, desc: "Animate anything. Official Viggle community for creators and clips." },
	{ slug: "blox-fruits-586704051148816385", name: "Blox Fruits", cat: "gaming", splash: `${DC}/discovery-splashes/586704051148816385/8d9f4e10f9394ee7d8ba90bec94ef2a0.jpg?size=2048&format=auto`, icon: `${DC}/icons/586704051148816385/c15726a644529ca99c2052ee4117be73.png?size=256`, online: "320,100", members: "3,800,000", verified: true, desc: "The official community for Blox Fruits. Raids, value lists, and trades." },
	{ slug: "valorant-679875946597056683", name: "VALORANT", cat: "gaming", splash: `${DC}/discovery-splashes/679875946597056683/57f5a8797ab7776e305b86afb6e2b044.jpg?size=2048&format=auto`, icon: `${DC}/icons/679875946597056683/3c3b087e1e823447fb374fcabe424599.png?size=256`, online: "184,200", members: "2,800,000", verified: true, desc: "The official VALORANT server. Patch notes, scrims, and radiant LFG." },
	{ slug: "genshin-impact-official-522681957373575168", name: "Genshin Impact Official", cat: "gaming", splash: `${DC}/discovery-splashes/522681957373575168/c6f80fd820225e92505e757ff5fc5f6b.jpg?size=2048&format=auto`, icon: `${DC}/icons/522681957373575168/b06cfb7692119d88d01191b30a387178.png?size=256`, online: "210,400", members: "2,600,000", verified: true, desc: "Welcome to Teyvat. Story, co-op domains, and redemption codes." },
	{ slug: "geometry-dash-398627612299362304", name: "Geometry Dash", cat: "gaming", splash: `${DC}/discovery-splashes/398627612299362304/f56bff4e7e4b1dcc858a0605eb06748a.jpg?size=2048&format=auto`, icon: `${DC}/icons/398627612299362304/a_6649bc7065295105c6a6ca15c0bf2897.png?size=256`, online: "161,147", members: "2,000,000", verified: true, desc: "Jump, fly, and flip through the official Geometry Dash community." },
	{ slug: "official-fortnite-322850917248663552", name: "Official Fortnite", cat: "gaming", splash: `${DC}/discovery-splashes/322850917248663552/9aba1093c463c84e7d8d34509439a2df.jpg?size=2048&format=auto`, icon: `${DC}/icons/322850917248663552/0a908ee09ce739595c738220b1d252f2.png?size=256`, online: "142,500", members: "2,000,000", verified: true, desc: "The Official Fortnite Server. Live events, LFG, and Creative codes." },
	{ slug: "fisch-1254502244926361620", name: "Fisch", cat: "gaming", splash: `${DC}/discovery-splashes/1254502244926361620/921da2c53f3d934d2ad8bbf646bc5e3c.jpg?size=2048&format=auto`, icon: `${DC}/icons/1254502244926361620/a_54c4bb0500c0b034e6388692c7eb7405.png?size=256`, online: "96,400", members: "1,100,000", verified: true, desc: "Cast a line with the official Fisch fishing community." },
	{ slug: "limewire-1046979304547954728", name: "LimeWire", cat: "entertainment", splash: `${DC}/discovery-splashes/1046979304547954728/e451531fcfc68fe19aca0be8790a645b.jpg?size=2048&format=auto`, icon: `${DC}/icons/1046979304547954728/bbe5d6097255431300cfc18dd629b876.png?size=256`, online: "41,220", members: "620,000", verified: true, desc: "Create, share, and collect. Official LimeWire community." },
	{ slug: "volleyball-legends-1328110081136398427", name: "Volleyball Legends", cat: "gaming", splash: `${DC}/discovery-splashes/1328110081136398427/c4b414334f519b3a04ce38b65671d6e3.jpg?size=2048&format=auto`, icon: `${DC}/discovery-splashes/1328110081136398427/c4b414334f519b3a04ce38b65671d6e3.jpg?size=256&format=auto`, online: "54,800", members: "890,000", verified: true, desc: "Spike, set, and squad up in Volleyball Legends." }
];

const CATS = [
	{ id: "all", label: "All", count: "31731", href: "/servers", icon: "all" },
	{ id: "gaming", label: "Gaming", count: "24463", href: "/servers/gaming", icon: "gaming" },
	{ id: "entertainment", label: "Entertainment", count: "12949", href: "/servers/entertainment", icon: "entertainment" },
	{ id: "education", label: "Education", count: "2366", href: "/servers/education", icon: "education" },
	{ id: "music", label: "Music", count: "2349", href: "/servers/music", icon: "music" },
	{ id: "tech", label: "Science & Tech", count: "2176", href: "/servers/science-tech", icon: "tech" }
];

function CatIcon({ id }) {
	if (id === "gaming") {
		return (
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M5.79 5h12.42c1.57 0 2.88 1.22 2.99 2.79l.66 9.22c.07 1.03-.7 1.92-1.73 2-.04 0-.08 0-.13 0-1.18 0-2.2-.8-2.49-1.94L17 15H7l-.51 2.06c-.29 1.14-1.31 1.94-2.49 1.94-1.03 0-1.86-.83-1.86-1.86 0-.04 0-.09 0-.13l.66-9.22C3 6.22 4.22 5 5.79 5z" />
			</svg>
		);
	}
	if (id === "entertainment") {
		return (
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M16.78 2.27L14.08 5.71H9.92L7.22 2.27 8.78 1 12 5.1 15.22 1l1.56 1.27zM4 6.73h16c1.1 0 2 .92 2 2.04v10.19c0 1.12-.9 2.04-2 2.04H4c-1.1 0-2-.92-2-2.04V8.77c0-1.12.9-2.04 2-2.04z" />
			</svg>
		);
	}
	if (id === "education") {
		return (
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 3L1 8.5 12 14l9-4.5V17h2V8.5L12 3zM5 13.2v3.4C7.2 18.4 9.5 19 12 19s4.8-.6 7-2.4v-3.4L12 16.5 5 13.2z" />
			</svg>
		);
	}
	if (id === "music") {
		return (
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M19.4 3.3c-.38-.28-.88-.37-1.33-.23L8.07 6.06c-.64.19-1.07.78-1.07 1.44v7.55c-.17-.02-.33-.05-.5-.05-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5V8.62L17 6.52v6.53c-.17-.02-.33-.05-.5-.05-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5V4.5c0-.48-.23-.92-.6-1.2z" />
			</svg>
		);
	}
	if (id === "tech") {
		return (
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
			</svg>
		);
	}
	return (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle cx="12" cy="12" r="8.25" stroke="currentColor" stroke-width="1.8" />
			<circle cx="12" cy="12" r="3.4" fill="currentColor" />
		</svg>
	);
}

function formatMembers(n) {
	const raw = String(n).replace(/,/g, "");
	const num = Number(raw);
	if (!Number.isFinite(num)) return n;
	if (num >= 1000000) return `${(num / 1000000).toFixed(num >= 10000000 ? 0 : 1).replace(/\.0$/, "")}M Members`;
	if (num >= 1000) return `${Math.round(num / 1000)}K Members`;
	return `${num} Members`;
}

function ServerCard({ server }) {
	return (
		<a className="zy-dc-server-card" href={`/servers/${server.slug}`} data-server-card data-cat={server.cat} data-name={server.name} data-desc={server.desc}>
			<div className="zy-dc-server-splash">
				<img src={server.splash} alt={`Discovery splash banner for ${server.name} Zycord server`} width="387" height="212" />
				<h2 className="zy-dc-server-splash-name">
					{server.verified ? <VerifiedBadge /> : null}
					{server.name}
				</h2>
			</div>
			<div className="zy-dc-server-meta">
				<img className="zy-dc-server-icon" src={server.icon} alt="" width="32" height="32" />
				<div className="zy-dc-server-counts">
					<span className="zy-dc-online">
						<i />
						{server.online}
					</span>
					<span>{formatMembers(server.members)}</span>
				</div>
			</div>
		</a>
	);
}

function discoverPathParts() {
	const path = (window.location.pathname || "/").toLowerCase();
	const parts = path.replace(/\/+$/, "").split("/").filter(Boolean);
	return { path, parts };
}

function DirectoryView() {
	const { path, parts } = discoverPathParts();
	const catParam = parts[0] === "servers" && parts[1] && !/^\d+$/.test(parts[1].slice(-4)) && !parts[1].match(/-\d{15,}$/) ? parts[1].replace("science-tech", "tech").replace("science%20%26%20tech", "tech") : "all";
	const activeCat = CATS.some((c) => c.id === catParam) ? catParam : "all";
	const filtered = activeCat === "all" ? SERVERS : SERVERS.filter((s) => s.cat === activeCat);
	const resultCount = activeCat === "all" ? "31731" : CATS.find((c) => c.id === activeCat)?.count || String(filtered.length);

	return (
		<div className="zy-dc-discover">
			<section className="zy-dc-discover-hero">
				<img className="zy-dc-megaphone" src={`${DC}/assets/content/425d7ba180181109ee4bb305c836e00bf113565dd08ac65d765c3f3027bd3c9f.png`} alt="" width="220" height="220" />
				<img className="zy-dc-wumpus-lab" src={`${DC}/assets/content/dafda44f44badbcedf8756785503bb2fda6a6ce8211be3bab03633ba1ecdf2cf.png`} alt="" width="231" height="352" />
				<div className="zy-dc-wrap">
					<h1 className="zy-dc-h1">DISCOVER YOUR NEXT FAVORITE SERVER</h1>
					<p>Find a new space to play games, chill with friends, and hang out.</p>
					<nav className="zy-dc-cats" aria-label="Categories">
						{CATS.map((c) => (
							<a className={`zy-dc-cat${c.id === activeCat ? " is-active" : ""}`} href={c.href} data-cat={c.id}>
								<CatIcon id={c.id} />
								<span>
									{c.label} ({c.count})
								</span>
							</a>
						))}
					</nav>
					<div className="zy-dc-search">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#80848e" stroke-width="2" aria-hidden="true">
							<circle cx="11" cy="11" r="8" />
							<line x1="21" y1="21" x2="16.65" y2="16.65" />
						</svg>
						<input id="zy-dc-server-search" type="search" placeholder="Search communities..." aria-label="Search popular communities" />
					</div>
					<h2 className="zy-dc-results" id="zy-dc-result-count">
						{resultCount} Results Found
					</h2>
				</div>
			</section>
			<section className="zy-dc-wrap">
				<div className="zy-dc-server-grid" id="zy-dc-server-grid">
					{filtered.map((s) => (
						<ServerCard server={s} />
					))}
				</div>
				<nav className="zy-dc-pager" aria-label="Pagination">
					<span>Back</span>
					<a className="is-current" href={path}>
						1
					</a>
					<a href={`${path}?page=2`}>2</a>
					<a href={`${path}?page=3`}>3</a>
					<a href={`${path}?page=4`}>4</a>
					<a href={`${path}?page=5`}>5</a>
					<a href={`${path}?page=6`}>6</a>
					<span>…</span>
					<a href={`${path}?page=4398`}>4398</a>
					<a href={`${path}?page=2`}>Next page</a>
				</nav>
				<div className="zy-dc-cta-band">
					<h2>Have a server you want to add to Discovery?</h2>
					<p>Get your community ready, then enable Server Discovery in Server Settings.</p>
					<a className="zy-dc-explore" href="/developers/docs" style={{ background: "#5865f2", color: "#fff" }}>
						Get Your Community Ready
					</a>
				</div>
				<div className="zy-dc-cta-band" style={{ marginTop: "24px", background: "#5865f2", color: "#fff" }}>
					<h2 style={{ color: "#fff" }}>Find your next place to talk, play, &amp; hang out</h2>
					<p style={{ color: "rgba(255,255,255,0.88)" }}>Jump into Zycord and start hanging out with friends.</p>
					<a className="zy-dc-explore" data-zy-open-app href="/app">
						Join Zycord
					</a>
				</div>
			</section>
		</div>
	);
}

const TRENDING = [
	{ rank: 1, name: "ARC Raiders", plays: "+214%", streams: "+110%", members: "1M Members", online: "203K Online", cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co9rk1.jpg", blurb: "ARC Raiders is a multiplayer extraction adventure, set in a lethal future earth, ravaged by a mysterious mechanized threat known as ARC.", cats: "Survival · Shooter" },
	{ rank: 2, name: "ROBLOX", plays: "+2%", streams: "", members: "", online: "", cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co7d4p.jpg", blurb: "Roblox is a massively multiplayer online platform for creators and players of all ages.", cats: "MMO · Sandbox" },
	{ rank: 3, name: "Deadlock", plays: "+28%", streams: "", members: "", online: "", cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co8d2s.jpg", blurb: "Deadlock is an upcoming multiplayer game from Valve in early development.", cats: "MOBA · Shooter" },
	{ rank: 4, name: "Risk of Rain 2", plays: "+186%", streams: "+113%", members: "224K Members", online: "50,106 Online", cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2ef8.jpg", blurb: "The classic multiplayer roguelike returns with randomized stages, enemies, bosses, and items.", cats: "Survival · Indie" },
	{ rank: 5, name: "Gears of War: E-Day", plays: "+75%", streams: "", members: "35K Members", online: "5,197 Online", cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co9g1a.jpg", blurb: "Experience Emergence Day through the eyes of Marcus Fenix in the origin story of the saga.", cats: "Shooter · Sci-Fi" },
	{ rank: 6, name: "AION 2", plays: "+24%", streams: "", members: "168K Members", online: "63,323 Online", cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co9h2b.jpg", blurb: "The only MMORPG built around a world where the sky is the battlefield.", cats: "MMO · Fantasy" },
	{ rank: 7, name: "Overwatch", plays: "+7%", streams: "", members: "783K Members", online: "134,230 Online", cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1vca.jpg", blurb: "A free-to-play, team-based action game where every match is the ultimate 5v5 battlefield brawl.", cats: "FPS · Shooter" },
	{ rank: 8, name: "Dota 2", plays: "+8%", streams: "", members: "", online: "108 Servers", cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2b6k.jpg", blurb: "The stand-alone sequel to Defense of the Ancients, constantly evolving with new heroes and gameplay.", cats: "MOBA · Strategy" },
	{ rank: 9, name: "Dragon's Dogma II", plays: "+303%", streams: "+166%", members: "", online: "", cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6l0x.jpg", blurb: "A narrative-driven action-RPG that challenges players to choose their own experience.", cats: "Fantasy · Open World" },
	{ rank: 10, name: "Geometry Dash", plays: "+16%", streams: "", members: "2M Members", online: "161,147 Online", cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2n0f.jpg", blurb: "Jump and fly your way through danger in this rhythm-based action platformer.", cats: "Indie · Platformer" }
];

function TrendingView() {
	const top = TRENDING.slice(0, 3);
	return (
		<div className="zy-dc-discover">
			<section className="zy-dc-discover-hero">
				<div className="zy-dc-wrap">
					<h1 className="zy-dc-h1">TRENDING GAMES</h1>
					<p>Oct 9 – Oct 15, 2026</p>
					<div className="zy-dc-podium">
						{top.map((g) => (
							<a className="zy-dc-podium-card" href={`/trending-games/${encodeURIComponent(g.name.toLowerCase().replace(/\s+/g, "-"))}`}>
								<img src={g.cover} alt={g.name} />
								<div className="zy-dc-podium-body">
									<span className="zy-dc-rank">{g.rank}</span>
									<h3>{g.name}</h3>
									<div className="zy-dc-delta">Plays {g.plays}{g.streams ? ` · Streams ${g.streams}` : ""}</div>
									<p style={{ marginTop: "8px", fontSize: "14px", color: "#4e5058" }}>{g.blurb}</p>
								</div>
							</a>
						))}
					</div>
				</div>
			</section>
			<section className="zy-dc-wrap">
				<table className="zy-dc-table">
					<thead>
						<tr>
							<th>Rank</th>
							<th>Game</th>
							<th>Plays</th>
							<th>Streams</th>
							<th>Category</th>
							<th>Servers</th>
						</tr>
					</thead>
					<tbody>
						{TRENDING.map((g) => (
							<tr>
								<td>{g.rank}</td>
								<td>
									<strong>{g.name}</strong>
									<div style={{ fontSize: "13px", color: "#4e5058", marginTop: "4px" }}>{g.blurb}</div>
								</td>
								<td>
									<span className="zy-dc-delta">{g.plays}</span>
								</td>
								<td>{g.streams ? <span className="zy-dc-delta">{g.streams}</span> : "—"}</td>
								<td>{g.cats}</td>
								<td>
									{g.online || "Find Servers"}
									<div style={{ fontSize: "12px", color: "#4e5058" }}>{g.members}</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</div>
	);
}

function ServerDetailView({ server }) {
	return (
		<div className="zy-dc-discover">
			<section className="zy-dc-discover-hero">
				<div className="zy-dc-wrap">
					<p style={{ color: "#5865f2", fontWeight: 700, marginBottom: "12px" }}>
						<a href="/servers">Server Directory</a> / {server.name}
					</p>
					<h1 className="zy-dc-h1" style={{ fontSize: "64px", lineHeight: "64px" }}>
						{server.name}
					</h1>
					<p>{server.desc}</p>
					<div className="zy-dc-server-counts" style={{ justifyContent: "center", marginTop: "18px", fontSize: "16px" }}>
						<span className="zy-dc-online">
							<i />
							{server.online} Online
						</span>
						<span>{formatMembers(server.members)}</span>
					</div>
					<div style={{ marginTop: "24px" }}>
						<a className="zy-dc-explore" data-zy-open-app href="/app" style={{ background: "#5865f2", color: "#fff" }}>
							Join Server
						</a>
					</div>
				</div>
			</section>
			<section className="zy-dc-wrap">
				<div className="zy-dc-server-splash" style={{ width: "100%", height: "320px", margin: "0 auto" }}>
					<img src={server.splash} alt="" />
				</div>
			</section>
		</div>
	);
}

export function DiscoverPage() {
	const { path, parts } = discoverPathParts();
	if (path === "/trending-games") {
		return <Wrap light>{<TrendingView />}</Wrap>;
	}
	if (path.startsWith("/trending-games/")) {
		const slug = parts.slice(1).join("/");
		const game = TRENDING.find((g) => g.name.toLowerCase().replace(/\s+/g, "-") === slug);
		if (!game) return <NotFoundPage />;
		return <Wrap light>{<TrendingView />}</Wrap>;
	}
	if (parts[0] === "servers" && parts[1] && /-\d{10,}$/.test(parts[1])) {
		const server = SERVERS.find((s) => s.slug === parts[1]);
		if (!server) return <NotFoundPage />;
		return <Wrap light>{<ServerDetailView server={server} />}</Wrap>;
	}
	if (parts[0] === "servers" && parts[1]) {
		const catId = parts[1].replace("science-tech", "tech").replace("science%20%26%20tech", "tech");
		if (!CATS.some((c) => c.id === catId || c.href === `/servers/${parts[1]}`)) return <NotFoundPage />;
	}
	return <Wrap light>{<DirectoryView />}</Wrap>;
}

/* -------------------------------------------------------------------------- */
/* Safety — discord.com/safety + every hub                                    */
/* -------------------------------------------------------------------------- */

const SAFETY_IMG = {
	library: `${WF}/69d3647d9620243ea45215e5_Image.png`,
	privacy: `${WF}/69d368bbc9a67d4d51731199_Image%20(1).webp`,
	parent: `${WF}/69d36a2bd55e0ad06e426054_Image%20(3).webp`,
	transparency: `${WF}/69d36aead79081d7a0e007dc_Image%20(4).webp`,
	news: `${WF}/69d36b74b02c89db7a5b83be_Image%20(6).webp`,
	policy: `${WF}/69d36be8c9a67d4d51735a75_Image%20(7).png`,
	teen: `${WF}/69d36c2718071ba084dced5b_Image%20(8).png`,
	wellbeing: `${WF}/69d36cad8ce6a8c0cbefa80e_Image%20(9).png`,
	bg: `${WF}/66ea8c7ed0d1a3eeedde846b_Background-brand%20(1).webp`,
	egg: `${WF}/69d363e34841f9e4de8af0e5_Egg.webp`,
	shield: `${WF}/68cbd5c797a4c9ddb9be9873_Safety_Shield_3D_Left%201.webp`
};

const SAFETY_HUBS = [
	{ id: "library", href: "/safety-library", title: "Safety Library", copy: "Everything you could ever want to know about safety on Zycord. Whether you’re a user, a moderator, or a parent, discover all of our tools and resources and how to use them.", img: SAFETY_IMG.library },
	{ id: "privacy", href: "/safety-privacy", title: "Privacy Hub", copy: "Privacy is an essential part of feeling safe. No matter what, we build privacy into our products and keep you informed about what's happening with your data. Learn more about what that means, including the data we collect and the tools that put you in control.", img: SAFETY_IMG.privacy },
	{ id: "parents", href: "/safety-parents", title: "Parent Hub", copy: "Learn more about what we’re doing to help your teen stay safer on our platform, explore our Family Center tool, and download our Parent’s Guide to Zycord.", img: SAFETY_IMG.parent },
	{ id: "transparency", href: "/safety-transparency", title: "Transparency Hub", copy: "Explore data, trends, and analysis into the work done to help keep people on Zycord safe. Transparency reports cover information about enforcement of our platform policies, as well as our response to legal requests.", img: SAFETY_IMG.transparency },
	{ id: "news", href: "/safety-news", title: "Safety News Hub", copy: "The latest news and updates on Zycord’s Safety, Privacy, and Policy initiatives.", img: SAFETY_IMG.news },
	{ id: "policies", href: "/safety-policies", title: "Policy Hub", copy: "Learn about our Community Guidelines, developed to help keep people safe and make Zycord the best place to hang out with friends.", img: SAFETY_IMG.policy },
	{ id: "teen", href: "/safety-teen-charter", title: "Teen Charter", copy: "We work to center youth voices in our product design and policies. We collaborated with teens around the world to create a charter that guides how we make Zycord a better place to hang out.", img: SAFETY_IMG.teen },
	{ id: "wellbeing", href: "/safety-wellbeing", title: "Wellbeing Hub", copy: "Discover resources for ways to protect your wellbeing or to support your teen’s mental health online.", img: SAFETY_IMG.wellbeing }
];

function HubRow({ hub, reverse }) {
	return (
		<section className={`zy-dc-wrap zy-dc-hub${reverse ? " is-reverse" : ""}`}>
			{reverse ? <img className="zy-dc-hub-img" src={hub.img} alt="" width="769" height="577" /> : null}
			<div className="zy-dc-hub-copy">
				<h2 className="zy-dc-h2">{hub.title}</h2>
				<p>{hub.copy}</p>
				{hub.href ? <ExploreMore href={hub.href} /> : null}
			</div>
			{reverse ? null : <img className="zy-dc-hub-img" src={hub.img} alt="" width="769" height="577" />}
		</section>
	);
}

function SafetyHero({ title, lead }) {
	return (
		<section className="zy-dc-hero">
			<img className="zy-dc-hero-bg" src={SAFETY_IMG.bg} alt="" />
			<img className="zy-dc-hero-prop is-left" src={SAFETY_IMG.shield} alt="" width="230" height="246" />
			<img className="zy-dc-hero-prop is-right" src={SAFETY_IMG.egg} alt="" width="230" height="230" />
			<div className="zy-dc-hero-inner">
				<h1 className="zy-dc-h1">{title}</h1>
				<p className="zy-dc-lead">{lead}</p>
			</div>
		</section>
	);
}

export function SafetyPage() {
	return (
		<Wrap>
			<div style={{ background: "#000" }}>
				<SafetyHero
					title="ZYCORD SAFETY CENTER"
					lead="Zycord is a communication platform built for meaningful connections through voice, video, and text, especially around gaming. Find the resources you need whether you’re a teen, parent, educator, or long-time user."
				/>
				{SAFETY_HUBS.map((hub, i) => (
					<HubRow hub={hub} reverse={i % 2 === 1} />
				))}
			</div>
		</Wrap>
	);
}

const HUB_PAGES = {
	"/safety-family-center": {
		title: "ZYCORD FAMILY CENTER",
		lead: "Learn more about what we’re doing to help your teen stay safer on our platform, explore our Family Center tool, and download our Parent's Guide to Zycord.",
		sections: [
			{ h: "For Parents and Guardians", p: "Family Center is designed to help you learn more about how your teen spends their time on Zycord and allows you to play an active role in their experience. Through an Activity Feed, weekly email summaries and tools to manage certain safety and privacy settings of your teen’s account, our goal is to empower families to start collaborative conversations around building positive online behaviors together." },
			{ h: "For Teens", p: "We built Family Center to help you help your parents or guardians easily stay informed and support your safety while also maintaining your privacy and autonomy on Zycord. Similar to how your parents might ask about the clubs you’re a part of or who your friends are at school, we make it easy for you to share the same information about your Zycord experience." },
			{ h: "Zycord’s Approach to Safety", p: "Our Community Guidelines are designed to ensure everyone can find belonging on Zycord. We enforce them through a mix of proactive and reactive measures. Every user is provided with the tools to report content, block users, and limit who can send them friend requests." }
		],
		faq: [
			{ q: "How can Parents/Guardians help their teen stay safe on Zycord?", a: "Talk about Community Guidelines, enable Family Center, review recommended safety settings, and keep 2FA turned on." },
			{ q: "Does Family Center allow my parents/guardians to read my DMs?", a: "No. Family Center is designed so parents know who teens are hanging out with — not so they can read private conversations." },
			{ q: "Will Family Center allow my parents/guardians to remove me from servers?", a: "Parents can help manage certain safety and privacy settings. They cannot silently read messages or impersonate your account." }
		]
	},
	"/safety-library": {
		title: "SAFETY LIBRARY",
		lead: "Everything you could ever want to know about safety on Zycord. Whether you’re a user, a moderator, or a parent, discover all of our tools and resources and how to use them.",
		sections: [
			{ h: "Four Steps to Keeping Your Account Safer", p: "Choose a secure password, consider enabling two-factor authentication (2FA), set your privacy & safety settings, and follow safe account practices." },
			{ h: "1. Choose a secure password", p: "A strong password is key to protecting your account. Choose a long password with a mix of uppercase letters, lowercase letters, and special characters that is hard to guess and that you don’t use for anything else. Zycord will require your password to be at least 8 characters long." },
			{ h: "2. Set your privacy & safety settings", p: "Your settings give you control over who can contact you and what they can send you. Configure sensitive media filters, DM spam filters, direct message permissions, and friend request settings in User Settings." },
			{ h: "3. Follow safe account practices", p: "Don’t click suspicious links, don’t download files from people you don’t trust, and never give away your login, password, or token. Zycord staff will never ask for your password." },
			{ h: "4. Block other users when needed", p: "If you don’t want to interact with someone, block them. Blocking stops DMs, friend requests, and server mentions from that user." }
		]
	},
	"/safety-news": {
		title: "SAFETY NEWS HUB",
		lead: "The latest news and updates on Zycord’s Safety, Privacy, and Policy initiatives.",
		sections: [
			{ h: "Safer for Teens, Same Zycord for Adults", p: "We’re launching a revamped, privacy-focused age assurance solution including methods that won’t require an ID or selfie." },
			{ h: "Family Center updates", p: "New Activity Feed insights and weekly email summaries help parents and teens talk about online habits together." }
		]
	},
	"/safety-teen-charter": {
		title: "TEEN CHARTER",
		lead: "We work to center youth voices in our product design and policies. We collaborated with teens around the world to create a charter that guides how we make Zycord a better place to hang out.",
		sections: [
			{ h: "What teens asked for", p: "Clearer controls, faster reporting, and tools that respect privacy while still letting trusted adults help when it matters." },
			{ h: "How we use the charter", p: "The Teen Charter informs product defaults for users under 18, including friend requests, DMs, and sensitive media filters." }
		]
	},
	"/safety-players-guide": {
		title: "ZYCORD PLAYER'S GUIDE",
		lead: "A practical guide for hanging out, playing, and staying comfortable on Zycord — written for players.",
		sections: [
			{ h: "Set up your space", p: "Customize notifications, privacy, and who can add you. A few minutes in User Settings makes hangouts feel like your own living room." },
			{ h: "Play with people you trust", p: "Use friend requests, server permissions, and reporting tools so games stay fun. Block and report anything that breaks the Community Guidelines." }
		]
	},
	"/safety-parents": {
		title: "ZYCORD PARENT HUB",
		lead: "Learn more about how we help teens have positive experiences on our platform and explore resources specific to parents and guardians.",
		sections: [
			{ h: "A Guardian’s Guide to Zycord", p: "Zycord’s Guardian’s Guide helps adults who are raising teens understand how Zycord works, how their teen might spend time here, and how to talk about keeping online experiences comfortable." },
			{ h: "How Your Teen Uses Zycord", p: "Chatting with friends, hopping into channels, and exploring interest-based communities are the most common ways teens hang out." },
			{ h: "Our Approach to Content Moderation", p: "We use user controls, platform moderation, and community moderation together — always mindful of privacy." },
			{ h: "Reporting on Zycord", p: "Learn how to report content and other users, and help your teen feel confident reporting issues themselves." },
			{ h: "Family Center", p: "Family Center helps you learn more about how your teen spends their time and the communities they are a part of, without reading private messages." }
		]
	},
	"/safety-policies": {
		title: "POLICY HUB",
		lead: "Learn about our Community Guidelines, developed to help keep people safe and make Zycord the best place to hang out with friends.",
		sections: [
			{ h: "Community Guidelines", p: "Our guidelines exist so everyone can find belonging. They cover harassment, hate speech, violent content, exploitation, and scams." },
			{ h: "How we enforce", p: "We combine automated detection, user reports, and trained Trust & Safety review. Actions can include warnings, removals, and account disables." }
		]
	},
	"/safety-privacy": {
		title: "PRIVACY HUB",
		lead: "Privacy is an essential part of feeling safe. No matter what, we build privacy into our products and keep you informed about what's happening with your data.",
		sections: [
			{ h: "Your data, your controls", p: "Review what we collect, how long we keep it, and how to download or delete it from User Settings → Data & Privacy." },
			{ h: "Messages and media", p: "Direct messages are private by default. You control who can DM you, and you can filter spam and sensitive media." }
		]
	},
	"/safety-transparency": {
		title: "TRANSPARENCY HUB",
		lead: "Explore data, trends, and analysis into the work done to help keep people on Zycord safe.",
		sections: [
			{ h: "Enforcement reports", p: "Transparency reports cover enforcement of our platform policies and our response to legal requests." },
			{ h: "What we publish", p: "We share volume of reports, actions taken, and government information requests so you can see how safety work actually looks." }
		]
	},
	"/safety-wellbeing": {
		title: "WELLBEING HUB",
		lead: "Discover resources for ways to protect your wellbeing or to support your teen’s mental health online.",
		sections: [
			{ h: "Take breaks that stick", p: "Use notification schedules, quiet hours, and mute so hangouts don’t follow you to bed." },
			{ h: "When you need more support", p: "If you or someone you know is in crisis, reach out to local emergency services or a trusted adult. Zycord is a hangout — not a substitute for care." }
		]
	}
};

function RelatedHubs({ current }) {
	const others = SAFETY_HUBS.filter((hub) => hub.href !== current).slice(0, 3);
	return (
		<div className="zy-dc-related">
			{others.map((hub) => (
				<a href={hub.href}>
					<h3>{hub.title}</h3>
					<p>{hub.copy}</p>
				</a>
			))}
		</div>
	);
}

export function SafetyHubPage() {
	const path = (window.location.pathname || "/").toLowerCase();
	const page = HUB_PAGES[path];
	if (!page) return <NotFoundPage />;
	return (
		<Wrap>
			<div className="zy-dc-article">
				<SafetyHero title={page.title} lead={page.lead} />
				<div className="zy-dc-wrap">
					<div className="zy-dc-prose">
						{page.sections.map((s) => (
							<Fragment>
								<h2>{s.h}</h2>
								<p>{s.p}</p>
							</Fragment>
						))}
						{page.faq ? (
							<div className="zy-dc-faq" style={{ marginTop: "36px" }}>
								{page.faq.map((item) => (
									<div className="zy-dc-faq-item zy-accordion-item">
										<button type="button" data-zy-accordion-trigger className="zy-accordion-trigger">
											<span>{item.q}</span>
											<span>▾</span>
										</button>
										<div className="zy-dc-faq-body">{item.a}</div>
									</div>
								))}
							</div>
						) : null}
						<p style={{ marginTop: "28px" }}>
							<a className="zy-dc-explore" href="/guidelines">
								Community Guidelines
							</a>
						</p>
					</div>
					<RelatedHubs current={path} />
				</div>
			</div>
		</Wrap>
	);
}

/* -------------------------------------------------------------------------- */
/* Quests — /ads/quests + success stories + FAQ                               */
/* -------------------------------------------------------------------------- */

const QUEST_STORIES = [
	{ title: "The Odyssey", tag: "Featured Story", copy: "Leading up to the release of The Odyssey, fans on Zycord weren’t just invited to watch this landmark film; they got to participate in their very own hero’s journey." },
	{ title: "Monopoly GO!", tag: "Mission Quest", copy: "Monopoly GO! expands its partnership with Zycord to build an engaged community and drive efficient mobile growth." },
	{ title: "Obsession", tag: "Video Quest Reserve", copy: "A brand-new director. A completely unknown horror IP. And Zycord's most powerful theatrical marketing bundle." },
	{ title: "Mouse P.I. For Hire", tag: "Play Quest", copy: "From test to top channel, PlaySide Studios achieved 4.5x net ROAS from Zycord Quest-driven game sales." },
	{ title: "R.E.P.O.", tag: "Community Quest", copy: "By channeling a viral meme, R.E.P.O. transformed organic fandom into a community-led Quest that expanded discovery." },
	{ title: "Walmart Skyward", tag: "Video Quest", copy: "Walmart becomes the first brand to use Video Quests to bring players into its own custom Zycord server experience." }
];

function QuestsSubnav({ active }) {
	const items = [
		{ id: "ads", href: "/ads/quests", label: "Advertising" },
		{ id: "industries", href: "/ads/quests#industries", label: "Industries" },
		{ id: "stories", href: "/ads/quests-success-stories", label: "Success Stories" },
		{ id: "faq", href: "/ads/quests-faq", label: "FAQ" }
	];
	return (
		<nav className="zy-dc-quests-subnav" aria-label="Quests">
			{items.map((item) => (
				<a className={item.id === active ? "is-active" : ""} href={item.href}>
					{item.label}
				</a>
			))}
		</nav>
	);
}

export function QuestsPage() {
	return (
		<Wrap>
			<div className="zy-dc-quests">
				<section className="zy-dc-quests-hero">
					<img className="zy-dc-quests-hero-bg" src="/site/media/zycord/quests-hero-bg.webp" alt="" />
					<QuestsSubnav active="ads" />
					<div className="zy-dc-hero-inner">
						<h1 className="zy-dc-h1">ADVERTISE WHERE THE WORLD PLAYS</h1>
						<p className="zy-dc-lead">Break through to some of the most passionate audiences of players with Zycord Ads.</p>
						<a className="zy-dc-cta-blurple" href="#launch">
							Get Started
						</a>
					</div>
					<img className="zy-dc-quests-trophy" src="/site/media/zycord/nav-quests-trophy.webp" alt="" width="280" height="280" />
				</section>
				<section className="zy-dc-wrap zy-dc-quests-designed">
					<h2 className="zy-dc-h2">DESIGNED FOR GAME PLAYERS</h2>
					<p className="zy-dc-lead">Players like our ad format because they are rewarded for engaging. It’s a win-win for players and advertisers.</p>
					<div className="zy-dc-quests-shots">
						<figure>
							<img src="/site/media/zycord/quests-step-1.webp" alt="Accept a Quest in Zycord" width="467" height="469" />
							<h3>1. They accept your Quest</h3>
							<p>Actions include watching a video, playing a game, streaming and more.</p>
						</figure>
						<figure>
							<img src="/site/media/zycord/quests-card-1.webp" alt="Play or watch to complete a Quest" width="467" height="469" />
							<h3>2. Play or Watch</h3>
							<p>Taking the requested action completes the Quest.</p>
						</figure>
						<figure>
							<img src="/site/media/zycord/quests-step-2.webp" alt="Collect Quest rewards" width="467" height="469" />
							<h3>3. And Collect Rewards</h3>
							<p>Rewards include in-game items and Zycord avatar decorations.</p>
						</figure>
					</div>
				</section>
				<section className="zy-dc-wrap" id="industries" style={{ padding: "48px 0 48px" }}>
					<h2 className="zy-dc-h2">EXPLORE OUR SOLUTIONS</h2>
					<p className="zy-dc-lead" style={{ textAlign: "left", margin: "16px 0 32px", maxWidth: "820px" }}>
						Whether you’re promoting a game, movie, or something else, Quests make it easy to connect with game players at scale.
					</p>
					<div className="zy-dc-related">
						<div>
							<h3>PLAY QUESTS</h3>
							<p>A player-focused ad format that rewards both new and lapsed players for directly playing your game, in exchange for an in-Zycord reward.</p>
						</div>
						<div>
							<h3>VIDEO QUEST RESERVE</h3>
							<p>A guaranteed video ad format where users opt in to watch your content in exchange for an in-Zycord reward.</p>
						</div>
						<div>
							<h3>MISSIONS</h3>
							<p>A fully interactive ad, native to Zycord. Users can complete activities such as mini-games, interactive videos, or quizzes, in exchange for an in-Zycord reward.</p>
						</div>
					</div>
					<div className="zy-dc-related" style={{ marginTop: "20px" }}>
						<div>
							<h3>HERO</h3>
							<p>A large-scale, animated ad unit that spans the top of the Quest home, offering a high-visibility surface to celebrate and promote tentpole launches on Zycord.</p>
						</div>
						<div>
							<h3>Designed with players in mind</h3>
							<p>Our rewarded format motivates even the most skeptical audiences to engage with your ad, driving interest in your content or game.</p>
						</div>
						<div>
							<h3>Leverage friend-to-friend influence</h3>
							<p>When someone accepts a Quest, their friends can see and join in. That’s the ultimate endorsement.</p>
						</div>
					</div>
				</section>
				<section className="zy-dc-wrap zy-dc-stats">
					<div>
						<strong>90M+</strong>
						<span>Daily Active Users</span>
					</div>
					<div>
						<strong>90%+</strong>
						<span>Play Video Games</span>
					</div>
					<div>
						<strong>~40%</strong>
						<span>Start a game within an hour</span>
					</div>
				</section>
				<section className="zy-dc-wrap" style={{ paddingBottom: "64px" }}>
					<h2 className="zy-dc-h2">QUESTS SUCCESS STORIES</h2>
					<div className="zy-dc-post-grid" style={{ marginTop: "36px" }}>
						{QUEST_STORIES.slice(0, 4).map((s) => (
							<article>
								<span className="zy-dc-cat-chip">{s.tag}</span>
								<h3 style={{ margin: "12px 0 8px", fontSize: "28px" }}>{s.title}</h3>
								<p style={{ color: "rgba(255,255,255,0.8)" }}>{s.copy}</p>
							</article>
						))}
					</div>
				</section>
				<section className="zy-dc-wrap" id="launch" style={{ padding: "0 0 96px" }}>
					<h2 className="zy-dc-h2">LAUNCH YOUR QUEST</h2>
					<p className="zy-dc-lead" style={{ textAlign: "left", margin: "16px 0 28px", maxWidth: "720px" }}>
						Zycord Ads can only be purchased through our sales team. If you’re interested in running a campaign, complete this form to get in touch with our team.
					</p>
					<form className="zy-dc-request" data-zy-support-form style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "#fff" }}>
						<label>Work email</label>
						<input type="email" required placeholder="you@company.com" />
						<label>Company</label>
						<input type="text" required />
						<label>What are you looking to advertise?</label>
						<textarea rows="4" required />
						<div style={{ marginTop: "20px" }}>
							<button className="zy-dc-cta-blurple" type="submit">
								Get Started
							</button>
						</div>
					</form>
				</section>
			</div>
		</Wrap>
	);
}

export function QuestsStoriesPage() {
	return (
		<Wrap>
			<div className="zy-dc-quests">
				<section className="zy-dc-quests-hero is-compact">
					<img className="zy-dc-quests-hero-bg" src="/site/media/zycord/quests-hero-bg.webp" alt="" />
					<QuestsSubnav active="stories" />
					<div className="zy-dc-hero-inner">
						<h1 className="zy-dc-h1">SUCCESS STORIES</h1>
						<p className="zy-dc-lead">See how these brands scored big with their advertising campaigns on Zycord.</p>
					</div>
				</section>
				<div className="zy-dc-wrap" style={{ paddingBottom: "80px" }}>
					<div className="zy-dc-post-grid">
						{QUEST_STORIES.map((s) => (
							<article>
								<span className="zy-dc-cat-chip">{s.tag}</span>
								<h3 style={{ margin: "12px 0 8px", fontSize: "28px" }}>{s.title}</h3>
								<p style={{ color: "rgba(255,255,255,0.8)" }}>{s.copy}</p>
							</article>
						))}
					</div>
					<div style={{ marginTop: "48px" }}>
						<a className="zy-dc-cta-blurple" href="/ads/quests#launch">
							Launch Your Quest
						</a>
					</div>
				</div>
			</div>
		</Wrap>
	);
}

export function QuestsFaqPage() {
	const faqs = [
		{ q: "What are Zycord Quests?", a: "Quests are a rewarded ad format. Players opt in, complete an action like watching or playing, and unlock in-Zycord cosmetics or in-game loot." },
		{ q: "Where do Quests show up?", a: "Players find Quests on the Quest home inside the app, in the Quest overlay, and sometimes as Hero units at the top of that surface." },
		{ q: "Where are Quests available?", a: "Quests run on desktop, web, and mobile. Availability can vary by country, age, and partner campaign." },
		{ q: "What Quest formats are there?", a: "Play Quests, Video Quest Reserve, Missions, and Hero units. Each rewards players for a different kind of engagement." },
		{ q: "What are the Quest rewards?", a: "Rewards include Avatar Decorations, Nameplates, Profile Effects, Orbs, and partner in-game items." },
		{ q: "Where can I see active Quests?", a: "Open the Quest tab in the Zycord app, or start from Explore Quests after you log in." },
		{ q: "How much do Quests cost?", a: "Zycord Ads can only be purchased through our sales team. Complete the interest form on the advertising page to get in touch." },
		{ q: "Can non-gaming brands run Zycord Quests?", a: "Yes. Entertainment, retail, and consumer brands have all run Video Quests and Missions." }
	];
	return (
		<Wrap>
			<div className="zy-dc-quests">
				<section className="zy-dc-quests-hero is-compact">
					<img className="zy-dc-quests-hero-bg" src="/site/media/zycord/quests-hero-bg.webp" alt="" />
					<QuestsSubnav active="faq" />
					<div className="zy-dc-hero-inner">
						<h1 className="zy-dc-h1">QUESTS NOOB GUIDE</h1>
						<p className="zy-dc-lead">The ins and outs to our Ads and everything in between.</p>
					</div>
				</section>
				<div className="zy-dc-wrap" style={{ paddingBottom: "80px" }}>
					<div className="zy-dc-faq">
						{faqs.map((item) => (
							<div className="zy-dc-faq-item zy-accordion-item">
								<button type="button" data-zy-accordion-trigger className="zy-accordion-trigger">
									<span>{item.q}</span>
									<span>▾</span>
								</button>
								<div className="zy-dc-faq-body">{item.a}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</Wrap>
	);
}

/* -------------------------------------------------------------------------- */
/* Support Help Center                                                        */
/* -------------------------------------------------------------------------- */

const HELP_TOPICS = [
	{ href: "/support/beginners-guide", title: "Beginner’s Guide", desc: "New to Zycord? Learn how to create an account, join a server, and hop into voice.", icon: "1" },
	{ href: "/support/announcements", title: "We've got our ear to the ground", desc: "Here’s what you need to know about current incidents, known issues, and product changes.", icon: "!" },
	{ href: "/support/account", title: "Account & Profile", desc: "Personalize your profile, security, notifications, and more.", icon: "☺" },
	{ href: "/support/billing", title: "Nitro, Billing & Gifting", desc: "Please don't shop until you drop. Let us help with receipts, gifts, and subscriptions.", icon: "$" },
	{ href: "/support/safety", title: "Trust & Safety", desc: "Keep things safe & sound for you and your buddies.", icon: "✓" },
	{ href: "/support/server-setup", title: "Server Setup", desc: "Roles, channels, permissions, and getting Discovery-ready.", icon: "#" },
	{ href: "/support/voice", title: "Voice, Video & Streaming", desc: "Fix connection issues, device selection, and screen share quality.", icon: "♫" },
	{ href: "/support/apps", title: "Apps, Bots & Developer Support", desc: "Slash commands, OAuth2, and the developer help center.", icon: "{}" },
	{ href: "/support/requests/new", title: "Submit a Request", desc: "Can’t find an answer? Open a ticket with our support team.", icon: "?" }
];

function SupportHero() {
	return (
		<div className="zy-dc-support-hero">
			<h1>Need help? We've got your back.</h1>
			<p>
				From account settings to permissions, find help for everything Zycord. If you're new to Zycord and looking for tips, check out our <a href="/support/beginners-guide" style={{ color: "#5865f2", textDecoration: "underline" }}>Beginner's Guide</a>.
			</p>
			<div className="zy-dc-support-search">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#80848e" stroke-width="2" aria-hidden="true">
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
				<input id="zy-dc-help-search" type="search" placeholder="Search" aria-label="Search help articles" />
			</div>
		</div>
	);
}

export function SupportPage() {
	const path = (window.location.pathname || "/").toLowerCase();
	if (path === "/support/requests/new" || path === "/support/request") {
		return (
			<Wrap light className="zy-dc-support">
				<div className="zy-dc-wrap">
					<h1 style={{ fontFamily: "var(--font-abc-ginto-nord-zycord)", fontSize: "42px" }}>Submit a request</h1>
					<p style={{ color: "#4e5058", marginBottom: "24px" }}>Zycord Support · Tell us what you need help with.</p>
					<form className="zy-dc-request" data-zy-support-form>
						<label>Email address</label>
						<input type="email" required placeholder="you@example.com" />
						<label>What can we help you with?</label>
						<select required>
							<option>Account &amp; login</option>
							<option>Nitro &amp; billing</option>
							<option>Trust &amp; Safety</option>
							<option>Voice &amp; video</option>
							<option>Server setup</option>
							<option>Developers &amp; apps</option>
							<option>Other</option>
						</select>
						<label>Subject</label>
						<input type="text" required />
						<label>Description</label>
						<textarea rows="6" required />
						<div style={{ marginTop: "20px" }}>
							<button className="zy-dc-explore" type="submit" style={{ background: "#5865f2", color: "#fff" }}>
								Submit
							</button>
						</div>
					</form>
				</div>
			</Wrap>
		);
	}

	const topic = HELP_TOPICS.find((t) => t.href === path && t.href !== "/support");
	if (topic && path !== "/support") {
		return (
			<Wrap light className="zy-dc-support">
				<div className="zy-dc-wrap">
					<p style={{ color: "#5865f2", fontWeight: 700 }}>
						<a href="/support">Help Center</a> / {topic.title}
					</p>
					<h1 style={{ fontFamily: "var(--font-abc-ginto-nord-zycord)", fontSize: "42px", margin: "12px 0 16px" }}>{topic.title}</h1>
					<p style={{ maxWidth: "720px", fontSize: "18px", lineHeight: "28px" }}>{topic.desc}</p>
					<div className="zy-dc-prose" style={{ color: "#2e3338", marginTop: "32px" }}>
						<h2 style={{ color: "#23272a" }}>How to get started</h2>
						<p style={{ color: "#4e5058" }}>
							Open User Settings from the gear icon next to your avatar. Most privacy, notification, and billing controls live there. For server tools, open Server Settings from the dropdown on the server name.
						</p>
						<h2 style={{ color: "#23272a" }}>Still stuck?</h2>
						<p style={{ color: "#4e5058" }}>
							<a href="/support/requests/new" style={{ color: "#5865f2" }}>Submit a request</a> or check <a href="/status" style={{ color: "#5865f2" }}>system status</a>.
						</p>
					</div>
				</div>
			</Wrap>
		);
	}

	if (path !== "/support" && path !== "/support/") return <NotFoundPage />;

	return (
		<Wrap light className="zy-dc-support">
			<div className="zy-dc-wrap">
				<SupportHero />
				<div className="zy-dc-help-grid" id="zy-dc-help-grid">
					{HELP_TOPICS.map((t) => (
						<a className="zy-dc-help-card" href={t.href} data-help-card data-name={t.title} data-desc={t.desc}>
							<span className="zy-dc-help-icon">{t.icon}</span>
							<h2>{t.title}</h2>
							<p>{t.desc}</p>
						</a>
					))}
				</div>
				<div className="zy-dc-cta-band" style={{ marginTop: "48px" }}>
					<h2>Developer Support</h2>
					<p>Building an app, bot, or Activity? Visit the Developer Portal and docs, or open a developer request.</p>
					<a className="zy-dc-explore" href="/developers/docs" style={{ background: "#5865f2", color: "#fff" }}>
						Developer Docs
					</a>
				</div>
			</div>
		</Wrap>
	);
}

/* -------------------------------------------------------------------------- */
/* Blog                                                                       */
/* -------------------------------------------------------------------------- */

const POSTS = [
	{ slug: "safer-for-teens-same-zycord-for-adults", cat: "product", catLabel: "Product & Features", title: "Safer for Teens, Same Zycord for Adults", desc: "We’re launching a revamped, privacy-focused age assurance solution including methods that won’t require an ID or selfie. Here’s how it works.", img: "/site/media/zycord/nav-blog-cube.webp", featured: true },
	{ slug: "zycord-update-september-25-2026", cat: "product", catLabel: "Product & Features", title: "Zycord Update: September 25, 2026", desc: "Dive into additional articles and stay informed.", img: "/site/media/zycord/sec1-chat-fun.webp" },
	{ slug: "patch-notes-february-4-2026", cat: "product", catLabel: "Product & Features", title: "Zycord Patch Notes: February 4, 2026", desc: "Fixes, quality-of-life updates, and client improvements.", img: "/site/media/zycord/sec2-stream.webp" },
	{ slug: "how-to-customize-your-zycord-profile", cat: "how-to-discord", catLabel: "How to Zycord", title: "How to Customize Your Zycord Profile", desc: "Avatar decorations, nameplates, effects, and bios — a complete walkthrough.", img: "/site/media/zycord/sec4-chill.webp" },
	{ slug: "patch-notes-december-8-2025", cat: "engineering", catLabel: "Engineering & Developers", title: "Zycord Patch Notes: December 8, 2025", desc: "A look at routing, SFU improvements, and client reliability work.", img: "/site/media/zycord/dev-hero-16x9.webp" },
	{ slug: "staff-picks-september-2025", cat: "community", catLabel: "Community", title: "Staff Picks, September 2025: Welcome to Our Video Game Museum", desc: "Communities our team loved hanging out in this month.", img: "/site/media/zycord/sec5-activities.webp" },
	{ slug: "inside-zycord-hq", cat: "company", catLabel: "Zycord HQ", title: "Inside Zycord HQ: Building the Future of Real-Time Hangouts", desc: "Meet the engineering and design teams crafting a faster hangout.", img: "/site/media/zycord/careers-office-1.webp" },
	{ slug: "end-to-end-encrypted-direct-messages", cat: "safety", catLabel: "Policy & Safety", title: "End-to-End Encrypted Direct Messages & Passkey Authentication", desc: "Protecting private conversations with client-side encryption and WebAuthn.", img: "/site/media/zycord/safety-hub-privacy.webp" }
];

const BLOG_CATS = [
	{ id: "featured", href: "/blog", label: "Featured" },
	{ id: "community", href: "/category/community", label: "Community" },
	{ id: "company", href: "/category/company", label: "Zycord HQ" },
	{ id: "engineering", href: "/category/engineering", label: "Engineering & Developers" },
	{ id: "how-to-discord", href: "/category/how-to-discord", label: "How to Zycord" },
	{ id: "safety", href: "/category/safety", label: "Policy & Safety" },
	{ id: "product", href: "/category/product", label: "Product & Features" }
];

function blogState() {
	const path = (window.location.pathname || "/").toLowerCase();
	if (path.startsWith("/blog/") && path !== "/blog/") {
		const slug = path.replace("/blog/", "");
		return { mode: "post", slug, cat: "featured" };
	}
	if (path.startsWith("/category/")) {
		return { mode: "category", slug: "", cat: path.replace("/category/", "") };
	}
	return { mode: "featured", slug: "", cat: "featured" };
}

export function BlogPage() {
	const state = blogState();
	if (state.mode === "post") {
		const post = POSTS.find((p) => p.slug === state.slug);
		if (!post) return <NotFoundPage />;
		return (
			<Wrap>
				<div className="zy-dc-blog">
					<div className="zy-dc-wrap">
						<p style={{ color: "#c9cdfb", fontWeight: 700 }}>
							<a href="/blog">Zycord Blog</a> / {post.catLabel}
						</p>
						<span className="zy-dc-cat-chip">{post.catLabel}</span>
						<h1 className="zy-dc-h1" style={{ fontSize: "64px", lineHeight: "64px", marginTop: "12px" }}>
							{post.title}
						</h1>
						<p className="zy-dc-lead" style={{ textAlign: "left", margin: "20px 0 32px" }}>
							{post.desc}
						</p>
						<div className="zy-dc-featured-banner">
							<img src={post.img} alt="" />
						</div>
						<div className="zy-dc-prose" style={{ marginTop: "32px" }}>
							<p>
								We’re continuing to invest in the tools that keep hangouts comfortable — without turning Zycord into something it isn’t. Adults keep the same product they know. Teens get stronger defaults, clearer reporting, and age-appropriate safety.
							</p>
							<p>
								If you want to try the latest features, open the app and check User Settings. For policy questions, visit the <a href="/safety" style={{ textDecoration: "underline" }}>Safety Center</a>.
							</p>
						</div>
					</div>
				</div>
			</Wrap>
		);
	}

	const active = state.cat;
	if (state.mode === "category" && !BLOG_CATS.some((c) => c.id === active)) return <NotFoundPage />;
	const list = active === "featured" ? POSTS : POSTS.filter((p) => p.cat === active);
	const featured = POSTS.find((p) => p.featured) || POSTS[0];

	const explore = active === "featured" ? POSTS.filter((p) => p !== featured) : list;

	return (
		<Wrap>
			<div className="zy-dc-blog">
				<div className="zy-dc-wrap">
					<div className="zy-dc-blog-hero">
						<h1>ZYCORD BLOG</h1>
					</div>
					{active === "featured" ? (
						<a className="zy-dc-featured" href={`/blog/${featured.slug}`}>
							<div className="zy-dc-featured-banner">
								<img src={featured.img} alt="" />
							</div>
							<h2>{featured.title}</h2>
							<p>{featured.desc}</p>
						</a>
					) : (
						<h2 className="zy-dc-h2" style={{ marginBottom: "24px", textAlign: "center" }}>
							{BLOG_CATS.find((c) => c.id === active)?.label || "Collection"}
						</h2>
					)}
					<div className="zy-dc-blog-toolbar">
						<nav className="zy-dc-blog-cats" aria-label="Collections">
							{BLOG_CATS.map((c) => (
								<a className={c.id === active ? "is-active" : ""} href={c.href}>
									{c.label}
								</a>
							))}
						</nav>
						<label className="zy-dc-blog-search">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9cdfb" stroke-width="2" aria-hidden="true">
								<circle cx="11" cy="11" r="8" />
								<line x1="21" y1="21" x2="16.65" y2="16.65" />
							</svg>
							<input type="search" placeholder="Search" aria-label="Search the blog" />
						</label>
					</div>
					<h2 className="zy-dc-h2 zy-dc-blog-explore">Explore Further</h2>
					<div className="zy-dc-post-grid">
						{explore.map((p) => (
							<a className="zy-dc-post-card" href={`/blog/${p.slug}`}>
								<img src={p.img} alt="" />
								<span className="zy-dc-cat-chip">{p.catLabel}</span>
								<h3>{p.title}</h3>
								<p>{p.desc}</p>
							</a>
						))}
					</div>
				</div>
			</div>
		</Wrap>
	);
}

export function MarketingDispatchPage() {
	const path = (window.location.pathname || "/").toLowerCase();
	if (path === "/discover" || path.startsWith("/servers") || path.startsWith("/trending-games")) return <DiscoverPage />;
	if (path === "/safety") return <SafetyPage />;
	if (path.startsWith("/safety-")) return <SafetyHubPage />;
	if (path === "/quests" || path === "/ads/quests") return <QuestsPage />;
	if (path.includes("quests-success")) return <QuestsStoriesPage />;
	if (path.includes("quests-faq")) return <QuestsFaqPage />;
	if (path.startsWith("/support")) return <SupportPage />;
	if (path.startsWith("/blog") || path.startsWith("/category/")) return <BlogPage />;
	return <NotFoundPage />;
}
