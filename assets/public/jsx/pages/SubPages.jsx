import { h } from "../runtime.jsx";

/* ============================================================================
   1. DOWNLOAD PAGE (/download) — Exact 2026 discord.com/download Layout
   ============================================================================ */
export function DownloadPage() {
	return (
		<div>
			{/* Hero */}
			<section className="zy-subhero">
				<div className="zy-container">
					<div className="zy-subhero-inner">
						<img
							src="/site/media/discord/prop-coin.webp"
							alt=""
							aria-hidden="true"
							style={{ width: "86px", height: "auto", marginBottom: "6px", filter: "drop-shadow(0 16px 28px rgba(0,0,0,0.45))" }}
						/>
						<h1 className="zy-subhero-title">Download Zycord wherever you hang out</h1>
						<p className="zy-subhero-sub">
							Talk, play, and hang out with friends around the world over voice, video, or text. Available on Windows, macOS, Linux, iOS, Android, and consoles.
						</p>
						<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginTop: "10px" }}>
							<a className="zy-btn zy-btn-primary" href="/download/windows" style={{ padding: "18px 34px", fontSize: "18px" }}>
								<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
									<polyline points="7 10 12 15 17 10" />
									<line x1="12" y1="15" x2="12" y2="3" />
								</svg>
								<span>Download for Windows</span>
							</a>
							<a className="zy-btn zy-btn-secondary" data-zy-open-app href="/app" style={{ padding: "18px 34px", fontSize: "18px" }}>
								<span>Open Zycord in Browser</span>
							</a>
						</div>
					</div>

					{/* Massive Download Hero Stage with Clyde & Wumpus flanking */}
					<div className="zy-dl-hero-stage">
						<img
							src="/site/media/discord/download-clyde-point.webp"
							alt=""
							aria-hidden="true"
							className="zy-float-prop"
							style={{ width: "clamp(110px, 14vw, 195px)", left: "-4%", bottom: "12%", zIndex: 4 }}
						/>
						<img
							src="/site/media/discord/download-hero.webp"
							alt="Zycord Desktop and Mobile Interface"
							className="zy-dl-hero-img"
						/>
						<img
							src="/site/media/discord/download-leaf.webp"
							alt=""
							aria-hidden="true"
							className="zy-float-prop"
							style={{ width: "clamp(72px, 8vw, 118px)", right: "8%", bottom: "36%", zIndex: 4 }}
						/>
						<img
							src="/site/media/discord/download-wumpus-point.webp"
							alt=""
							aria-hidden="true"
							className="zy-float-prop"
							style={{ width: "clamp(130px, 16vw, 230px)", right: "-5%", bottom: "4%", zIndex: 5 }}
						/>
					</div>
				</div>
			</section>

			{/* Alternating Platform Rows */}
			<section className="zy-section" style={{ paddingTop: "24px" }}>
				<div className="zy-container">
					{/* 1. Desktop */}
					<div className="zy-alt-row">
						<div className="zy-alt-copy">
							<h2 className="zy-alt-title">Download for desktop</h2>
							<p className="zy-body-lg">
								Bring your favorite features to a bigger screen with our desktop app, available on Windows, macOS, and Linux with native system tray and global keybinds.
							</p>
							<div className="zy-pill-btn-row">
								<a className="zy-white-pill-btn" href="/download/windows">
									<span>Windows (64-bit)</span>
									<span>↓</span>
								</a>
								<a className="zy-white-pill-btn" href="/download/windows">
									<span>macOS</span>
									<span>↓</span>
								</a>
								<a className="zy-white-pill-btn" href="/download/windows">
									<span>Linux (deb / tar.gz)</span>
									<span>↓</span>
								</a>
							</div>
						</div>
						<div className="zy-alt-media-card is-green">
							<img src="/site/media/discord/download-desktop-card.webp" alt="Download Zycord for Desktop" />
						</div>
					</div>

					{/* 2. Mobile */}
					<div className="zy-alt-row is-reversed">
						<div className="zy-alt-media-card is-blue">
							<img src="/site/media/discord/download-mobile-card.webp" alt="Download Zycord for Mobile" />
						</div>
						<div className="zy-alt-copy">
							<h2 className="zy-alt-title">Download for mobile</h2>
							<p className="zy-body-lg">
								Keep up with your chats and hop into voice channels wherever you are with our iOS, Android, and instant Web PWA apps.
							</p>
							<div className="zy-pill-btn-row">
								<a className="zy-white-pill-btn" data-zy-open-app href="/app">
									<span>App Store (iOS)</span>
								</a>
								<a className="zy-white-pill-btn" data-zy-open-app href="/app">
									<span>Google Play (Android)</span>
								</a>
								<a className="zy-white-pill-btn" data-zy-open-app href="/app">
									<span>Install Web PWA</span>
								</a>
							</div>
						</div>
					</div>

					{/* 3. Console */}
					<div className="zy-alt-row">
						<div className="zy-alt-copy">
							<h2 className="zy-alt-title">Link your console</h2>
							<p className="zy-body-lg">
								Talk with your friends on Zycord while playing your favorite console games on PlayStation and Xbox, and sync live Rich Presence to your profile.
							</p>
							<div className="zy-pill-btn-row">
								<a className="zy-white-pill-btn" data-zy-open-app href="/app">
									<span>PlayStation</span>
									<span>↗</span>
								</a>
								<a className="zy-white-pill-btn" data-zy-open-app href="/app">
									<span>Xbox</span>
									<span>↗</span>
								</a>
							</div>
						</div>
						<div className="zy-alt-media-card is-pink">
							<img src="/site/media/discord/download-console-card.webp" alt="Link your console to Zycord" />
						</div>
					</div>

					{/* Feeling experimental? PTB Card */}
					<div className="zy-ptb-card">
						<img
							src="/site/media/discord/download-ptb-3d.png"
							alt=""
							aria-hidden="true"
							className="zy-float-prop"
							style={{ width: "118px", top: "-36px", left: "4%" }}
						/>
						<img
							src="/site/media/discord/download-trophy.webp"
							alt=""
							aria-hidden="true"
							className="zy-float-prop"
							style={{ width: "112px", bottom: "-32px", right: "5%" }}
						/>
						<h2 className="zy-alt-title" style={{ textAlign: "center" }}>Feeling experimental?</h2>
						<p className="zy-body-lg" style={{ maxWidth: "600px", textAlign: "center" }}>
							Try out the newest features before they launch by using our Public Test Build or jumping directly into the web client.
						</p>
						<div className="zy-pill-btn-row" style={{ justifyContent: "center" }}>
							<a className="zy-white-pill-btn" href="/download/windows">
								<span>Download Public Test Build</span>
								<span>↓</span>
							</a>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

/* ============================================================================
   2. QUESTS PAGE (/quests) — Exact 2026 discord.com/ads/quests Layout
   ============================================================================ */
export function QuestsPage() {
	return (
		<div>
			{/* Hero with official quests-hero-bg.webp & floating cauldron */}
			<section
				className="zy-subhero"
				style={{
					backgroundImage: "linear-gradient(180deg, rgba(16,18,56,0.58) 0%, rgba(16,18,56,0.95) 100%), url('/site/media/discord/quests-hero-bg.webp')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					paddingTop: "80px",
					paddingBottom: "76px"
				}}
			>
				<div className="zy-container">
					<div className="zy-subhero-inner">
						<span className="zy-eyebrow">Zycord Quests &amp; Advertising</span>
						<h1 className="zy-subhero-title">ADVERTISE WHERE THE WORLD PLAYS</h1>
						<p className="zy-subhero-sub">
							Break through to some of the most passionate audiences of players with Zycord Quests — where players earn exclusive collectibles for playing and streaming.
						</p>
						<div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginTop: "10px" }}>
							<a className="zy-btn zy-btn-primary" data-zy-open-app href="/app">Explore Quests in App</a>
							<a className="zy-btn zy-btn-secondary" href="/nitro">View Collectibles Shop</a>
						</div>
						<img
							src="/site/media/discord/quests-cauldron.avif"
							alt=""
							aria-hidden="true"
							style={{ width: "164px", height: "auto", marginTop: "18px", filter: "drop-shadow(0 20px 36px rgba(0,0,0,0.5))" }}
						/>
					</div>
				</div>
			</section>

			{/* Designed for Game Players — 3 Alternating Step Cards */}
			<section className="zy-section" id="stories" style={{ paddingTop: "36px" }}>
				<div className="zy-container">
					<div style={{ textAlign: "center", maxWidth: "740px", margin: "0 auto 40px" }}>
						<h2 className="zy-heading">DESIGNED FOR GAME PLAYERS</h2>
						<p className="zy-body-lg" style={{ marginTop: "12px" }}>
							Players love our Quest format because they are rewarded for engaging. It’s a win-win for players and game studios.
						</p>
					</div>

					<div className="zy-alt-row">
						<div className="zy-alt-copy">
							<span className="zy-eyebrow">Step 1</span>
							<h3 className="zy-alt-title">1. THEY ACCEPT YOUR QUEST</h3>
							<p className="zy-body-lg">
								Actions include watching a trailer, playing a game, streaming to friends in a voice channel, and more.
							</p>
						</div>
						<div className="zy-alt-media-card is-indigo">
							<img src="/site/media/discord/quests-step-1.webp" alt="1. They accept your Quest" />
						</div>
					</div>

					<div className="zy-alt-row is-reversed">
						<div className="zy-alt-media-card is-blue">
							<img src="/site/media/discord/quests-step-2.webp" alt="2. Play or Watch" />
						</div>
						<div className="zy-alt-copy">
							<span className="zy-eyebrow">Step 2</span>
							<h3 className="zy-alt-title">2. PLAY OR WATCH</h3>
							<p className="zy-body-lg">
								Taking the requested action inside Zycord or the connected game automatically progresses and completes the Quest.
							</p>
						</div>
					</div>

					<div className="zy-alt-row">
						<div className="zy-alt-copy">
							<span className="zy-eyebrow">Step 3</span>
							<h3 className="zy-alt-title">3. AND COLLECT REWARDS</h3>
							<p className="zy-body-lg">
								Rewards include in-game loot, Orbs, and exclusive Zycord Avatar Decorations, Nameplates, and Profile Effects.
							</p>
						</div>
						<div className="zy-alt-media-card is-pink">
							<img src="/site/media/discord/quests-step-3.webp" alt="3. And Collect Rewards" />
						</div>
					</div>
				</div>
			</section>

			{/* Explore Our Solutions */}
			<section className="zy-section" style={{ paddingTop: "16px" }}>
				<div className="zy-container">
					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<span className="zy-eyebrow">Quest Formats</span>
								<h2 className="zy-heading">EXPLORE OUR SOLUTIONS</h2>
								<p className="zy-body-lg">
									Whether you’re promoting a tentpole game launch, seasonal update, or community tournament, Quests connect with players at scale.
								</p>
								<div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
									<div className="zy-card" style={{ padding: "18px 22px" }}>
										<h3 className="zy-heading-sm" style={{ fontSize: "19px" }}>PLAY QUESTS</h3>
										<p className="zy-body" style={{ fontSize: "14px" }}>Rewards both new and returning players for playing or streaming your game to friends.</p>
									</div>
									<div className="zy-card" style={{ padding: "18px 22px" }}>
										<h3 className="zy-heading-sm" style={{ fontSize: "19px" }}>VIDEO QUESTS &amp; MISSIONS</h3>
										<p className="zy-body" style={{ fontSize: "14px" }}>Interactive video trailers and native mini-missions that unlock instant profile cosmetics.</p>
									</div>
								</div>
							</div>
							<div className="zy-scene-stage stage-blurple" style={{ flexDirection: "column", gap: "18px" }}>
								<img src="/site/media/discord/quests-wumpus-banner.webp" alt="Zycord Quests Hero Banner" style={{ width: "100%", height: "auto", borderRadius: "24px" }} />
								<img src="/site/media/discord/quests-missions.webp" alt="Zycord Quests Interactive Missions" style={{ width: "100%", height: "auto", borderRadius: "24px" }} />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="zy-section" id="faq" style={{ paddingTop: "16px" }}>
				<div className="zy-container" style={{ maxWidth: "860px" }}>
					<h2 className="zy-heading" style={{ textAlign: "center", marginBottom: "28px" }}>QUESTS FAQ</h2>
					<div className="zy-accordion">
						<div className="zy-accordion-item is-open">
							<button type="button" className="zy-accordion-trigger" data-zy-accordion-trigger aria-expanded="true">
								<span>Where do my unlocked Quest rewards appear?</span>
								<span className="zy-accordion-icon">▾</span>
							</button>
							<div className="zy-accordion-content">
								All unlocked Avatar Decorations, Nameplates, Profile Effects, and Profile Frames appear directly in <strong>User Settings → Profiles</strong> inside Zycord.
							</div>
						</div>
						<div className="zy-accordion-item">
							<button type="button" className="zy-accordion-trigger" data-zy-accordion-trigger aria-expanded="false">
								<span>Can developers create custom activities and Rich Presence quests?</span>
								<span className="zy-accordion-icon">▾</span>
							</button>
							<div className="zy-accordion-content">
								Yes! Visit the <a href="/developers/applications" style={{ color: "#fff", textDecoration: "underline" }}>Zycord Developer Portal</a> to configure Rich Presence assets, Profile Widgets, and embedded Activities.
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

/* ============================================================================
   3. BLOG PAGE (/blog) — Collections matching Screenshot 4
   ============================================================================ */
export function BlogPage() {
	const posts = [
		{
			cat: "Product & Features",
			id: "product",
			img: "/site/media/discord/sec1-chat-fun.webp",
			title: "Introducing Full Profile Collectibles: Avatar Decorations, Nameplates, Effects & Frames",
			desc: "Customize every layer of your Zycord identity with 1,099+ collectibles across 9 categories, full-card profile effects, and non-obscuring perimeter frames."
		},
		{
			cat: "Engineering & Developers",
			id: "engineering",
			img: "/site/media/discord/dev-hero-16x9.webp",
			title: "How Zycord Routes Sub-20ms WebRTC Voice & 1080p 60fps Video Streams",
			desc: "A deep dive into our SFU media architecture, Opus audio packet prioritization, and hardware-accelerated screen sharing."
		},
		{
			cat: "Policy & Safety",
			id: "safety",
			img: "/site/media/discord/safety-card-1.png",
			title: "End-to-End Encrypted Direct Messages & Passkey Authentication",
			desc: "Protecting private conversations with zero-knowledge client-side WebCrypto keys, recovery codes, and WebAuthn security."
		},
		{
			cat: "Community",
			id: "community",
			img: "/site/media/discord/sec5-activities.webp",
			title: "Community Spotlight: Hosting 100-Player Esports Watch Parties",
			desc: "See how gaming communities use Stage channels, custom soundboards, and Role Icons to run weekly tournaments."
		},
		{
			cat: "Zycord HQ",
			id: "hq",
			img: "/site/media/discord/careers-office-1.webp",
			title: "Inside Zycord HQ: Building the Future of Real-Time Hangouts",
			desc: "Meet the engineering and design teams crafting a faster, more expressive communication platform."
		},
		{
			cat: "How to Zycord",
			id: "guides",
			img: "/site/media/discord/sec4-chill.webp",
			title: "How to Link Steam, Spotify, GitHub, PlayStation & Xbox for Rich Presence",
			desc: "Step-by-step guide to connecting your accounts so friends can see what you're playing and jump right into your lobby."
		}
	];

	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/discord/nav-blog-cube.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "132px", top: "-42px", right: "6%" }} />
					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<div><span className="zy-eyebrow">Zycord Blog &amp; Newsroom</span></div>
								<h1 className="zy-display">STORIES, UPDATES &amp; ENGINEERING</h1>
								<p className="zy-body-lg">
									The latest product releases, engineering deep-dives, community spotlights, and safety updates from the Zycord team.
								</p>
							</div>
							<div className="zy-scene-stage stage-magenta">
								<img src="/site/media/discord/quests-missions.webp" alt="Zycord Featured Update" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="zy-section" style={{ paddingTop: "12px" }}>
				<div className="zy-container">
					<div className="zy-grid-3">
						{posts.map((p) => (
							<article className="zy-card" id={p.id}>
								<img src={p.img} alt={p.title} style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
								<span className="zy-eyebrow" style={{ alignSelf: "flex-start", marginTop: "6px" }}>{p.cat}</span>
								<h3 className="zy-heading-sm" style={{ fontSize: "20px" }}>{p.title}</h3>
								<p className="zy-body" style={{ fontSize: "14px" }}>{p.desc}</p>
								<div style={{ marginTop: "auto", paddingTop: "10px" }}>
									<a className="zy-btn zy-btn-ghost zy-btn-sm" href="/app">Try it in Zycord →</a>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

/* ============================================================================
   4. APP DIRECTORY PAGE (/application-directory)
   ============================================================================ */
export function AppDirectoryPage() {
	const apps = [
		{ name: "ZyGuard AutoMod", cat: "Moderation & Security", installs: "42,800+ Servers", img: "/site/media/discord/safety-card-1.png", desc: "Real-time raid protection, regex keyword filters, anti-phishing links, and automated audit logs." },
		{ name: "WatchParty Cinema", cat: "Activities & Watch Together", installs: "68,400+ Servers", img: "/site/media/discord/sec5-activities.webp", desc: "Synchronized YouTube, Twitch, and media playback right inside any Zycord voice channel." },
		{ name: "Tempo Hi-Fi Music", cat: "Music & Soundboard", installs: "91,200+ Servers", img: "/site/media/discord/sec2-stream.webp", desc: "Lossless 384kbps Opus audio streaming, playlists, and live DJ queue management." },
		{ name: "QuestMaster RPG", cat: "Games & Trivia", installs: "54,100+ Servers", img: "/site/media/discord/quests-card-1.webp", desc: "Turn-based multiplayer dungeon raids, leaderboards, and custom server loot drops." },
		{ name: "GitPulse Notifier", cat: "Developer Tools", installs: "31,900+ Servers", img: "/site/media/discord/dev-card-apps.webp", desc: "Instant rich webhook embeds for GitHub commits, PR reviews, CI/CD builds, and releases." },
		{ name: "LevelUp XP & Roles", cat: "Community Engagement", installs: "77,500+ Servers", img: "/site/media/discord/sec6-platforms.webp", desc: "Customizable rank cards, voice activity XP rewards, and automated role promotions." }
	];
	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/discord/prop-rupee-gem.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "136px", top: "-44px", right: "6%" }} />
					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<div><span className="zy-eyebrow">Official App Directory</span></div>
								<h1 className="zy-display">SUPERCHARGE YOUR SERVER WITH APPS</h1>
								<p className="zy-body-lg">
									Discover thousands of verified bots, slash-command utilities, multiplayer voice Activities, and automated moderation tools built on the Zycord API.
								</p>
								<div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
									<a className="zy-btn zy-btn-primary" href="/app">Browse in Zycord</a>
									<a className="zy-btn zy-btn-secondary" href="/developers/applications">Build Your Own App</a>
								</div>
							</div>
							<div className="zy-scene-stage stage-blurple">
								<img src="/site/media/discord/dev-card-apps.webp" alt="Zycord App Directory" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="zy-section" style={{ paddingTop: "12px" }}>
				<div className="zy-container">
					<div className="zy-grid-3">
						{apps.map((a) => (
							<article className="zy-card">
								<img src={a.img} alt={a.name} style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "16px" }} />
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginTop: "6px" }}>
									<span className="zy-eyebrow">{a.cat}</span>
									<span style={{ fontSize: "12px", color: "var(--color-spring-green)", fontWeight: "700" }}>{a.installs}</span>
								</div>
								<h3 className="zy-heading-sm" style={{ fontSize: "22px" }}>{a.name}</h3>
								<p className="zy-body" style={{ fontSize: "14px" }}>{a.desc}</p>
								<div style={{ marginTop: "auto", paddingTop: "10px" }}>
									<a className="zy-btn zy-btn-primary zy-btn-sm" href="/app">Add to Server</a>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

/* ============================================================================
   5. GIFT CARDS PAGE (/gift-cards)
   ============================================================================ */
export function GiftCardsPage() {
	const tiers = [
		{ title: "1 Month Zycord Nitro", price: "$9.99", badge: "Popular Gift", img: "/site/media/discord/nitro-perk-1.webp", desc: "Unlock 1080p 60fps HD streaming, 500MB uploads, custom emojis everywhere, and 2 free Server Boosts for 30 days." },
		{ title: "1 Year Zycord Nitro", price: "$99.99", badge: "Best Value · 2 Months Free", img: "/site/media/discord/nitro-perk-2.webp", desc: "A full year of complete profile customization, animated avatars, custom banners, profile effects, and 2 Server Boosts." },
		{ title: "Shop Collectibles Bundle", price: "$14.99", badge: "Exclusive Cosmetics", img: "/site/media/discord/nitro-perk-3.webp", desc: "Gift instant access to 1,099+ avatar decorations, animated nameplates, and full-card profile effects." }
	];
	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/discord/nitro-wumpus-jetpack.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "148px", top: "-52px", right: "5%" }} />
					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<div><span className="zy-eyebrow">Zycord Nitro Gift Cards</span></div>
								<h1 className="zy-display">GIVE THE GIFT OF NITRO</h1>
								<p className="zy-body-lg">
									Share HD streaming, animated profile themes, custom emojis, and Server Boosts with your favorite squadmates in seconds.
								</p>
								<div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
									<a className="zy-btn zy-btn-primary" href="/nitro">Gift Nitro Now</a>
									<a className="zy-btn zy-btn-secondary" href="/app">Redeem a Gift Code</a>
								</div>
							</div>
							<div className="zy-scene-stage stage-magenta">
								<img src="/site/media/discord/nitro-banner-media.webp" alt="Zycord Nitro Gift Cards" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="zy-section" style={{ paddingTop: "12px" }}>
				<div className="zy-container">
					<div className="zy-grid-3">
						{tiers.map((t) => (
							<article className="zy-card">
								<img src={t.img} alt={t.title} style={{ width: "100%", height: "190px", objectFit: "contain", background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: "16px" }} />
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
									<span className="zy-eyebrow">{t.badge}</span>
									<span className="zy-heading-sm" style={{ fontSize: "22px", color: "var(--color-spring-green)" }}>{t.price}</span>
								</div>
								<h3 className="zy-heading-sm" style={{ fontSize: "22px" }}>{t.title}</h3>
								<p className="zy-body" style={{ fontSize: "14px" }}>{t.desc}</p>
								<div style={{ marginTop: "auto", paddingTop: "10px" }}>
									<a className="zy-btn zy-btn-primary zy-btn-sm" href="/app">Send Digital Gift</a>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

/* ============================================================================
   6. COMPANY / ABOUT PAGE (/company)
   ============================================================================ */
export function CompanyPage() {
	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/discord/hero-wumpus.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "136px", top: "-46px", right: "6%" }} />
					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<div><span className="zy-eyebrow">About Zycord</span></div>
								<h1 className="zy-display">CREATE SPACE FOR EVERYONE TO FIND BELONGING</h1>
								<p className="zy-body-lg">
									Zycord is the real-time voice, video, and text communication platform where gaming squads, open-source builders, and world-class communities hang out every day.
								</p>
								<div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
									<a className="zy-btn zy-btn-primary" href="/careers">Explore Careers</a>
									<a className="zy-btn zy-btn-secondary" href="/newsroom">Visit Newsroom</a>
								</div>
							</div>
							<div className="zy-scene-stage stage-cerulean">
								<img src="/site/media/discord/careers-hero.webp" alt="About Zycord" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="zy-section" style={{ paddingTop: "12px" }}>
				<div className="zy-container">
					<div className="zy-grid-3">
						<article className="zy-card">
							<img src="/site/media/discord/careers-office-1.webp" alt="Our Story" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>BUILT FOR REAL FRIENDSHIPS</h3>
							<p className="zy-body">
								Unlike endless social feeds designed for passive scrolling, Zycord is designed for active conversation — jumping into voice channels, streaming games, and building lasting memories.
							</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/discord/careers-office-2.webp" alt="Engineering Excellence" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>SUB-20MS GLOBAL INFRASTRUCTURE</h3>
							<p className="zy-body">
								Powered by ultra-low-latency WebRTC voice, 1080p 60fps screen sharing, and end-to-end encrypted direct messaging with Passkey security.
							</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/discord/careers-office-3.webp" alt="Privacy First" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>SAFETY &amp; TRANSPARENCY</h3>
							<p className="zy-body">
								Your conversations belong to you. We empower communities with granular role permissions, AutoMod filters, and zero-knowledge encrypted DMs.
							</p>
						</article>
					</div>
				</div>
			</section>
		</div>
	);
}

/* ============================================================================
   7. BRANDING PAGE (/branding)
   ============================================================================ */
export function BrandingPage() {
	const colors = [
		{ name: "Zycord Blurple", hex: "#5865F2", rgb: "RGB(88, 101, 242)" },
		{ name: "Deep Space Indigo", hex: "#1B1D68", rgb: "RGB(27, 29, 104)" },
		{ name: "Spring Green", hex: "#57F287", rgb: "RGB(87, 242, 135)" },
		{ name: "Fuchsia Pulse", hex: "#EB459E", rgb: "RGB(235, 69, 158)" },
		{ name: "Solar Amber", hex: "#FEE75C", rgb: "RGB(254, 231, 92)" },
		{ name: "Midnight Onyx", hex: "#0B0C20", rgb: "RGB(11, 12, 32)" }
	];
	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/discord/careers-crown.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "110px", top: "-40px", right: "6%" }} />
					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<div><span className="zy-eyebrow">Official Brand Guidelines</span></div>
								<h1 className="zy-display">OUR BRAND, LOGOS &amp; DESIGN SYSTEM</h1>
								<p className="zy-body-lg">
									Download official Zycord marks, mascot artwork, color tokens, and typography guidelines for press, creators, and community partners.
								</p>
								<div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
									<a className="zy-btn zy-btn-primary" href="/favicon.svg" download="Zycord-Logo.svg">Download SVG Logo Kit</a>
									<a className="zy-btn zy-btn-secondary" href="/branding/preview.html">Interactive Brand Preview</a>
								</div>
							</div>
							<div className="zy-scene-stage stage-blurple" style={{ minHeight: "280px", flexDirection: "column", gap: "16px" }}>
								<img src="/favicon.svg" alt="Zycord Mark" style={{ width: "112px", height: "112px", filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.45))" }} />
								<div className="zy-display" style={{ fontSize: "42px" }}>Zycord</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="zy-section" style={{ paddingTop: "12px" }}>
				<div className="zy-container">
					<h2 className="zy-heading" style={{ marginBottom: "24px" }}>OFFICIAL COLOR PALETTE</h2>
					<div className="zy-grid-3">
						{colors.map((c) => (
							<article className="zy-card">
								<div style={{ height: "120px", borderRadius: "16px", background: c.hex, border: "1px solid rgba(255,255,255,0.22)" }} />
								<h3 className="zy-heading-sm" style={{ fontSize: "20px", marginTop: "8px" }}>{c.name}</h3>
								<p className="zy-body" style={{ fontFamily: "monospace", fontSize: "14px" }}>{c.hex} · {c.rgb}</p>
							</article>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

/* ============================================================================
   8. NEWSROOM PAGE (/newsroom)
   ============================================================================ */
export function NewsroomPage() {
	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/discord/nav-blog-cube.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "128px", top: "-42px", right: "6%" }} />
					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<div><span className="zy-eyebrow">Press &amp; Media Center</span></div>
								<h1 className="zy-display">ZYCORD NEWSROOM</h1>
								<p className="zy-body-lg">
									Official announcements, company milestones, media resources, and executive briefings from Zycord HQ.
								</p>
								<div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
									<a className="zy-btn zy-btn-primary" href="/branding">Download Media Kit</a>
									<a className="zy-btn zy-btn-secondary" href="/blog">Read Engineering Blog</a>
								</div>
							</div>
							<div className="zy-scene-stage stage-sunset">
								<img src="/site/media/discord/careers-office-4.webp" alt="Zycord Newsroom" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
							</div>
						</div>
					</div>
				</div>
			</section>
			<BlogPage />
		</div>
	);
}

/* ============================================================================
   9. CREATORS PAGE (/creators)
   ============================================================================ */
export function CreatorsPage() {
	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/discord/download-trophy.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "118px", top: "-40px", right: "6%" }} />
					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<div><span className="zy-eyebrow">Zycord for Creators</span></div>
								<h1 className="zy-display">TURN YOUR AUDIENCE INTO A THRIVING COMMUNITY</h1>
								<p className="zy-body-lg">
									Host live Stage events, sync Twitch &amp; YouTube subscriber roles automatically, and reward your biggest supporters with custom collectibles.
								</p>
								<div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
									<a className="zy-btn zy-btn-primary" href="/app">Launch Your Creator Server</a>
									<a className="zy-btn zy-btn-secondary" href="/community">Community Guidelines</a>
								</div>
							</div>
							<div className="zy-scene-stage stage-magenta">
								<img src="/site/media/discord/sec2-stream.webp" alt="Zycord for Creators" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="zy-section" style={{ paddingTop: "12px" }}>
				<div className="zy-container">
					<div className="zy-grid-3">
						<article className="zy-card">
							<img src="/site/media/discord/sec3-hop-in.webp" alt="Subscriber Role Sync" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>TWITCH &amp; YOUTUBE ROLE SYNC</h3>
							<p className="zy-body">
								Automatically grant exclusive VIP channels, custom role icons, and soundboard perks to your Twitch subscribers and YouTube channel members.
							</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/discord/sec5-activities.webp" alt="Stage Channels" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>STAGE CHANNELS &amp; AMAs</h3>
							<p className="zy-body">
								Run moderated town halls, live podcast recordings, and interactive Q&amp;A sessions with raised-hand speaker queues for thousands of listeners.
							</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/discord/sec1-chat-fun.webp" alt="Server Shop & Perks" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>CUSTOM EMOJIS &amp; SOUNDBOARDS</h3>
							<p className="zy-body">
								Upload your channel's iconic memes, animated emotes, and catchphrases so your community can react in voice and text.
							</p>
						</article>
					</div>
				</div>
			</section>
		</div>
	);
}

/* ============================================================================
   10. COMMUNITY PAGE (/community)
   ============================================================================ */
export function CommunityPage() {
	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/discord/sec5-card-characters.png" alt="" aria-hidden="true" className="zy-float-prop" style={{ width: "156px", top: "-52px", right: "6%" }} />
					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<div><span className="zy-eyebrow">Zycord Communities</span></div>
								<h1 className="zy-display">WHERE PASSIONATE COMMUNITIES GROW</h1>
								<p className="zy-body-lg">
									From university study groups and open-source maintainers to global esports organizations, Zycord gives community leaders every tool to welcome and organize members.
								</p>
								<div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
									<a className="zy-btn zy-btn-primary" href="/discover">Explore Public Servers</a>
									<a className="zy-btn zy-btn-secondary" href="/app">Create a Community Server</a>
								</div>
							</div>
							<div className="zy-scene-stage stage-emerald">
								<img src="/site/media/discord/sec6-platforms.webp" alt="Zycord Community" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="zy-section" style={{ paddingTop: "12px" }}>
				<div className="zy-container">
					<div className="zy-grid-3">
						<article className="zy-card">
							<img src="/site/media/discord/safety-card-2.webp" alt="Onboarding" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>GUIDED SERVER ONBOARDING</h3>
							<p className="zy-body">
								Welcome new members with interactive role-picker questions, custom rules screening, and curated default channels.
							</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/discord/sec4-chill.webp" alt="Forum Channels" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>FORUM &amp; THREAD CHANNELS</h3>
							<p className="zy-body">
								Keep busy discussions organized with searchable topic tags, pinned guidelines, and dedicated threads that never clutter main chat.
							</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/discord/safety-card-4.png" alt="Community Insights" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>AUTO-MODERATION &amp; SAFETY</h3>
							<p className="zy-body">
								Protect your space effortlessly with customizable keyword filters, raid alerts, and granular role-based permission hierarchies.
							</p>
						</article>
					</div>
				</div>
			</section>
		</div>
	);
}

/* ============================================================================
   11. OFFICIAL MERCH PAGE (/merch)
   ============================================================================ */
export function MerchPage() {
	const items = [
		{ name: "Wumpus Plushie Collector Edition", price: "$34.00", tag: "Limited Drop", img: "/site/media/discord/hero-wumpus.webp", desc: "Ultra-soft 12-inch embroidered Wumpus plush with magnetic leaf accessory." },
		{ name: "Blurple Heavyweight Hoodie", price: "$68.00", tag: "Apparel", img: "/site/media/discord/nitro-wumpus-wheel.webp", desc: "450gsm brushed cotton fleece in signature Zycord Blurple with puff-print wordmark." },
		{ name: "3D Keycap & Desk Mat Bundle", price: "$49.00", tag: "Hardware Gear", img: "/site/media/discord/dev-clyde-3d.webp", desc: "Artisan resin Clyde keycap paired with an XXL stitched-edge midnight desk pad." }
	];
	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/discord/nitro-star.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "110px", top: "-36px", right: "6%" }} />
					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<div><span className="zy-eyebrow">Official Zycord Store</span></div>
								<h1 className="zy-display">OFFICIAL MERCH &amp; COLLECTIBLES</h1>
								<p className="zy-body-lg">
									Rep your favorite hangout IRL with limited-edition apparel, plushies, desk gear, and digital profile collectibles.
								</p>
								<div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
									<a className="zy-btn zy-btn-primary" href="/app">Open Digital Collectibles Shop</a>
									<a className="zy-btn zy-btn-secondary" href="/gift-cards">Shop Gift Cards</a>
								</div>
							</div>
							<div className="zy-scene-stage stage-blurple">
								<img src="/site/media/discord/nitro-banner-media.webp" alt="Zycord Merch" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="zy-section" style={{ paddingTop: "12px" }}>
				<div className="zy-container">
					<div className="zy-grid-3">
						{items.map((it) => (
							<article className="zy-card">
								<img src={it.img} alt={it.name} style={{ width: "100%", height: "200px", objectFit: "contain", background: "rgba(255,255,255,0.05)", padding: "18px", borderRadius: "16px" }} />
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
									<span className="zy-eyebrow">{it.tag}</span>
									<span className="zy-heading-sm" style={{ fontSize: "20px", color: "var(--color-spring-green)" }}>{it.price}</span>
								</div>
								<h3 className="zy-heading-sm" style={{ fontSize: "22px" }}>{it.name}</h3>
								<p className="zy-body" style={{ fontSize: "14px" }}>{it.desc}</p>
								<div style={{ marginTop: "auto", paddingTop: "10px" }}>
									<a className="zy-btn zy-btn-primary zy-btn-sm" href="/app">View in Shop</a>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

/* ============================================================================
   12. FEEDBACK PAGE (/feedback)
   ============================================================================ */
export function FeedbackPage() {
	function handleFeedbackSubmit(e) {
		e.preventDefault();
		const statusEl = document.getElementById("zy-feedback-status");
		if (statusEl) {
			statusEl.style.display = "block";
			statusEl.textContent = "Thank you! Your feedback has been submitted to the Zycord Product Team.";
		}
		e.target.reset();
	}

	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/discord/download-clyde-point.webp" alt="" aria-hidden="true" className="zy-float-prop" style={{ width: "124px", top: "-42px", right: "6%" }} />
					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<div><span className="zy-eyebrow">Product Feedback &amp; Feature Requests</span></div>
								<h1 className="zy-display">HELP SHAPE THE FUTURE OF ZYCORD</h1>
								<p className="zy-body-lg">
									Have an idea for Voice &amp; Video, Collectibles, Server Moderation, or Developer APIs? Submit your feedback directly to our engineering team.
								</p>
							</div>
							<div className="zy-card" style={{ background: "rgba(13, 15, 44, 0.88)" }}>
								<h3 className="zy-heading-sm" style={{ fontSize: "22px" }}>Submit a Feature Request</h3>
								<form onSubmit={handleFeedbackSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "8px" }}>
									<select required style={{ padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "15px" }}>
										<option value="voice" style={{ background: "#1b1e4b" }}>Voice, Video &amp; Screen Share</option>
										<option value="chat" style={{ background: "#1b1e4b" }}>Text Channels, Threads &amp; Polls</option>
										<option value="nitro" style={{ background: "#1b1e4b" }}>Nitro &amp; Profile Collectibles</option>
										<option value="api" style={{ background: "#1b1e4b" }}>Bots, Webhooks &amp; Developer API</option>
										<option value="safety" style={{ background: "#1b1e4b" }}>Safety, Privacy &amp; Moderation</option>
									</select>
									<input
										type="text"
										required
										placeholder="Short title for your suggestion..."
										style={{ padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "15px" }}
									/>
									<textarea
										rows="4"
										required
										placeholder="Describe how this feature would help you and your server..."
										style={{ padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "15px", resize: "vertical" }}
									/>
									<button type="submit" className="zy-btn zy-btn-primary">Submit Feedback</button>
									<div id="zy-feedback-status" style={{ display: "none", padding: "12px", borderRadius: "12px", background: "rgba(87, 242, 135, 0.18)", border: "1px solid rgba(87, 242, 135, 0.45)", color: "#57f287", fontWeight: "700", fontSize: "14px" }} />
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

