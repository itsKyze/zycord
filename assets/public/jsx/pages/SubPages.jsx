import { h } from "../runtime.jsx";

/* ============================================================================
   1. DOWNLOAD PAGE (/download) — Official Discord 3D Download Assets
   ============================================================================ */
export function DownloadPage() {
	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<img src="/site/media/discord/star-lg.svg" alt="" aria-hidden="true" className="zy-star d1" style={{ width: "28px", top: "8%", left: "6%" }} />
				<img src="/site/media/discord/star-m.svg" alt="" aria-hidden="true" className="zy-star d2" style={{ width: "22px", top: "14%", right: "9%" }} />

				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/discord/download-clyde-point.webp" alt="" aria-hidden="true" className="zy-float-prop" style={{ width: "128px", top: "-46px", right: "5%" }} />

					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<div>
									<span className="zy-eyebrow">
										<span className="zy-eyebrow-dot" data-zy-status-dot></span>
										<span>Latest Release v4.0 · 64-bit Desktop &amp; Web</span>
									</span>
								</div>
								<h1 className="zy-display">GET ZYCORD FOR ANY DEVICE</h1>
								<p className="zy-body-lg">
									An adventure awaits. Hang out with your friends on our desktop app and keep the conversation going on mobile and web.
								</p>
								<div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "8px" }}>
									<a className="zy-btn zy-btn-primary" href="/download/windows">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
											<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
											<polyline points="7 10 12 15 17 10" />
											<line x1="12" y1="15" x2="12" y2="3" />
										</svg>
										<span>Download for Windows</span>
									</a>
									<a className="zy-btn zy-btn-secondary" data-zy-open-app href="/app">
										<span>Open Zycord in Browser</span>
									</a>
								</div>
								<div style={{ fontSize: "13px", color: "var(--color-fog)" }}>
									Windows 10 / 11 (64-bit) · Signed NSIS Installer (ZycordSetup.exe)
								</div>
							</div>

							<div className="zy-scene-stage stage-cerulean" style={{ position: "relative" }}>
								<img
									src="/site/media/discord/download-hero.webp"
									alt="Zycord on Desktop and Mobile"
									style={{ width: "100%", height: "auto", borderRadius: "20px", display: "block" }}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="zy-section" style={{ paddingTop: "16px" }}>
				<div className="zy-container">
					<div className="zy-grid-3">
						<article className="zy-card">
							<img src="/site/media/discord/download-desktop-card.webp" alt="Zycord for Desktop" style={{ width: "100%", height: "210px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "24px", marginTop: "8px" }}>WINDOWS DESKTOP</h3>
							<p className="zy-body">
								Native desktop client with system tray integration, global push-to-talk keybinds, and hardware-accelerated 1080p 60fps screen share.
							</p>
							<div style={{ marginTop: "auto", paddingTop: "12px" }}>
								<a className="zy-btn zy-btn-primary zy-btn-sm" href="/download/windows">Download for Windows</a>
							</div>
						</article>

						<article className="zy-card">
							<img src="/site/media/discord/download-mobile-card.webp" alt="Zycord for Mobile & Web" style={{ width: "100%", height: "210px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "24px", marginTop: "8px" }}>WEB &amp; MOBILE PWA</h3>
							<p className="zy-body">
								Instant browser access on Chrome, Edge, Firefox, and Safari — plus installable PWA for iOS, Android, macOS, and Linux.
							</p>
							<div style={{ marginTop: "auto", paddingTop: "12px" }}>
								<a className="zy-btn zy-btn-secondary zy-btn-sm" data-zy-open-app href="/app">Launch Web App</a>
							</div>
						</article>

						<article className="zy-card">
							<img src="/site/media/discord/download-console-card.webp" alt="Zycord Rich Presence & Console Sync" style={{ width: "100%", height: "210px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "24px", marginTop: "8px" }}>CONNECTED ACCOUNTS</h3>
							<p className="zy-body">
								Link Steam, PlayStation, Xbox, Epic Games, Spotify, Twitch, YouTube, and GitHub to display live Rich Presence on your profile.
							</p>
							<div style={{ marginTop: "auto", paddingTop: "12px" }}>
								<a className="zy-btn zy-btn-ghost zy-btn-sm" data-zy-open-app href="/app">Connect Accounts →</a>
							</div>
						</article>
					</div>
				</div>
			</section>
		</div>
	);
}

/* ============================================================================
   2. QUESTS PAGE (/quests) — Official Discord 3D Quests Assets & Trophy
   ============================================================================ */
export function QuestsPage() {
	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<img src="/site/media/discord/star-lg.svg" alt="" aria-hidden="true" className="zy-star d1" style={{ width: "28px", top: "8%", left: "6%" }} />
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/discord/nav-quests-trophy.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "136px", top: "-46px", right: "6%" }} />

					<div
						className="zy-showcase-card"
						style={{
							backgroundImage: "linear-gradient(135deg, rgba(16,19,62,0.88), rgba(45,56,195,0.78)), url('/site/media/discord/quests-hero-bg.webp')",
							backgroundSize: "cover",
							backgroundPosition: "center"
						}}
					>
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<div>
									<span className="zy-eyebrow">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
										<span>Zycord Quests &amp; Rewards</span>
									</span>
								</div>
								<h1 className="zy-display">PLAY GAMES. COMPLETE QUESTS. EARN REWARDS.</h1>
								<p className="zy-body-lg">
									Stream your favorite games to friends on Zycord, discover new titles, and unlock exclusive Avatar Decorations, Nameplates, Profile Effects, and Profile Frames.
								</p>
								<div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "8px" }}>
									<a className="zy-btn zy-btn-primary" data-zy-open-app href="/app">Explore Quests in App</a>
									<a className="zy-btn zy-btn-secondary" href="/nitro">View Collectibles Shop</a>
								</div>
							</div>

							<div className="zy-scene-stage stage-blurple">
								<img
									src="/site/media/discord/quests-wumpus-banner.webp"
									alt="Zycord Quests Wumpus Spellcraft Reward Banner"
									style={{ width: "100%", height: "auto", borderRadius: "20px", display: "block" }}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="zy-section" id="stories" style={{ paddingTop: "16px" }}>
				<div className="zy-container">
					<div style={{ textAlign: "center", maxWidth: "740px", margin: "0 auto 40px" }}>
						<span className="zy-eyebrow">How Quests Work</span>
						<h2 className="zy-heading" style={{ marginTop: "14px" }}>THREE STEPS TO UNLOCK COLLECTIBLES</h2>
					</div>
					<div className="zy-grid-3">
						<article className="zy-card">
							<img src="/site/media/discord/quests-step-1.webp" alt="Accept a Quest" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px" }}>1. ACCEPT YOUR QUEST</h3>
							<p className="zy-body">Browse active Quests in Zycord User Settings or the Discover tab and enroll with a single click.</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/discord/quests-step-2.webp" alt="Play or Stream" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px" }}>2. PLAY OR STREAM TO FRIENDS</h3>
							<p className="zy-body">Hop into a voice channel and stream 1080p 60fps gameplay to your squad while Rich Presence tracks your progress.</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/discord/quests-step-3.webp" alt="Claim Your Reward" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px" }}>3. EQUIP YOUR REWARD</h3>
							<p className="zy-body">Claim limited-edition Avatar Decorations, Nameplates, Profile Effects, and Profile Frames immediately.</p>
						</article>
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
