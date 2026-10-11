import { h } from "../runtime.jsx";
import { ZycordMark } from "../Icons.jsx";

export function HomePage() {
	return (
		<div>
			{/* =====================================================================
			    HERO SECTION — OFFICIAL DISCORD 2026 3D CHARACTERS, WUMPUS, CLYDE & UI
			    ===================================================================== */}
			<section className="hero-section">
				<img src="/site/media/discord/star-lg.svg" alt="" aria-hidden="true" className="zy-star d1" style={{ width: "32px", top: "8%", left: "5%" }} />
				<img src="/site/media/discord/star-m.svg" alt="" aria-hidden="true" className="zy-star d2" style={{ width: "22px", top: "15%", right: "7%" }} />
				<img src="/site/media/discord/star-sm.svg" alt="" aria-hidden="true" className="zy-star d3" style={{ width: "16px", bottom: "18%", left: "11%" }} />
				<img src="/site/media/discord/star-lg.svg" alt="" aria-hidden="true" className="zy-star d4" style={{ width: "28px", bottom: "14%", right: "12%" }} />

				<div className="zy-container">
					<div className="hero-grid">
						<div className="hero-copy">
							<div className="hero-crown-wrap">
								<img
									src="/site/media/discord/careers-crown.webp"
									alt=""
									aria-hidden="true"
									className="hero-crown"
									data-zy-parallax="0.14"
									data-zy-parallax-rotate="-8"
								/>
							</div>
							<h1 className="zy-display">GROUP CHAT THAT'S ALL FUN &amp; GAMES</h1>
							<p className="zy-body-lg">
								Zycord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.
							</p>
						</div>

						{/* Official Discord 2026 3D Composite Stage */}
						<div className="hero-art-stage">
							<div className="hero-art-glow"></div>

							{/* Blurred 3D Trophy on far right behind monitor (Matches Screenshot 1) */}
							<img
								src="/site/media/discord/download-trophy.webp"
								alt=""
								aria-hidden="true"
								className="hero-trophy-blur"
								data-zy-parallax="-0.16"
								data-zy-parallax-rotate="10"
							/>

							{/* Main 3D Devices + Characters Stage */}
							<div className="hero-3d-composite">
								<img
									src="/site/media/discord/hero-devices-2026.webp"
									alt="Zycord 3D Desktop and Mobile Interface with Characters"
									className="hero-main-devices-img"
									fetchpriority="high"
								/>
								{/* 3D Character Bottom-Left (Girl in pink jacket & blue scarf) */}
								<img
									src="/site/media/discord/hero-girl-2026.webp"
									alt=""
									aria-hidden="true"
									className="hero-char-girl"
								/>
								{/* 3D Clyde Robot standing next to Girl at bottom-left */}
								<img
									src="/site/media/discord/hero-clyde.webp"
									alt=""
									aria-hidden="true"
									className="hero-char-clyde"
								/>
								{/* 3D Wumpus & Leaf in front of monitor stand */}
								<img
									src="/site/media/discord/hero-wumpus-leaf.webp"
									alt=""
									aria-hidden="true"
									className="hero-char-wumpus-leaf"
								/>
								<img
									src="/site/media/discord/hero-wumpus.webp"
									alt=""
									aria-hidden="true"
									className="hero-char-wumpus"
								/>
								{/* 3D Character Bottom-Right (Boy in blue hoodie next to phone) */}
								<img
									src="/site/media/discord/hero-boy.webp"
									alt=""
									aria-hidden="true"
									className="hero-char-boy"
								/>
							</div>
						</div>
					</div>

					{/* Centered Hero Bottom Dual CTA Pair (Exact Discord.com layout) */}
					<div className="hero-bottom-ctas">
						<a className="zy-btn zy-btn-secondary" href="/download/windows">
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="7 10 12 15 17 10" />
								<line x1="12" y1="15" x2="12" y2="3" />
							</svg>
							<span>Download for Windows</span>
						</a>
						<a
							className="zy-btn zy-btn-primary"
							data-zy-open-app
							data-zy-open-label-authed="Open Zycord in your browser"
							href="/app"
						>
							<span>Open Zycord in your browser</span>
						</a>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    SECTION 1: MAKE YOUR GROUP CHATS MORE FUN
			    (Exact Match to Discord.com:
			     - Video on LEFT, Copy on RIGHT
			     - Party Wumpus peeking from behind the top-right of the card (z-index: 0)
			     - Large 3D Spotted Egg (Egg (1).webp) floating on the bottom-left with scroll parallax)
			    ===================================================================== */}
			<section className="zy-section" id="chat">
				<div className="zy-container" style={{ position: "relative" }}>
					{/* Animated Party Wumpus peeking from behind top-right of the card (matches .chats_top.is_2025) */}
					<img
						src="/site/media/discord/party-wumpus.gif"
						alt=""
						aria-hidden="true"
						style={{
							position: "absolute",
							top: "-98px",
							right: "224px",
							width: "172px",
							zIndex: 0,
							pointerEvents: "none"
						}}
					/>
					{/* Large 3D Spotted Egg (Egg (1).webp) floating on bottom-left with scroll-down parallax */}
					<img
						src="/site/media/discord/prop-egg.webp"
						alt=""
						aria-hidden="true"
						className="zy-float-prop"
						data-zy-parallax="0.22"
						data-zy-parallax-rotate="-12"
						style={{
							width: "clamp(220px, 18vw, 316px)",
							bottom: "-250px",
							left: "-115px",
							zIndex: 1,
							opacity: "0.94"
						}}
					/>

					<div className="zy-showcase-card">
						<div className="zy-showcase-grid is-reversed">
							<div
								className="zy-scene-stage stage-magenta"
								style={{ backgroundImage: "url('/site/media/discord/sec1-bkg.webp')" }}
							>
								<video
									className="zy-stage-video"
									autoPlay
									loop
									muted
									playsInline
									poster="/site/media/discord/sec1-chat-fun.webp"
								>
									<source src="/site/media/discord/sec1-chat-fun.mp4" type="video/mp4" />
								</video>
							</div>

							<div className="zy-showcase-copy">
								<h2 className="zy-heading">MAKE YOUR GROUP CHATS MORE FUN</h2>
								<p className="zy-body-lg">
									Use custom emoji, stickers, soundboard effects and more to add your personality to your voice, video, or text chat. Set your avatar and a custom status, and write your own profile to show up in chat your way.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    SECTION 2: STREAM LIKE YOU'RE IN THE SAME ROOM (COPY LEFT, VIDEO RIGHT)
			    (Exact Match to Discord.com:
			     - 3D Clyde Cube (Clyde Cube.webp) floating below bottom-left with scroll parallax)
			    ===================================================================== */}
			<section className="zy-section" id="video">
				<div className="zy-container" style={{ position: "relative" }}>
					<img
						src="/site/media/discord/prop-clyde-cube.webp"
						alt=""
						aria-hidden="true"
						className="zy-float-prop"
						data-zy-parallax="0.2"
						data-zy-parallax-rotate="14"
						style={{
							width: "clamp(185px, 15vw, 224px)",
							bottom: "-165px",
							left: "56px",
							zIndex: 1
						}}
					/>

					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<h2 className="zy-heading">STREAM LIKE YOU'RE IN THE SAME ROOM</h2>
								<p className="zy-body-lg">
									High quality and low latency streaming makes it feel like you're hanging out on the couch with friends while playing a game, watching shows, looking at photos, or idk doing homework or something.
								</p>
							</div>

							<div
								className="zy-scene-stage stage-cerulean"
								style={{ backgroundImage: "url('/site/media/discord/sec2-bkg.svg')" }}
							>
								<video
									className="zy-stage-video"
									autoPlay
									loop
									muted
									playsInline
									poster="/site/media/discord/sec2-stream.webp"
								>
									<source src="/site/media/discord/sec2-stream.mp4" type="video/mp4" />
								</video>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    SECTION 3: HOP IN WHEN YOU'RE FREE, NO NEED TO CALL (VIDEO LEFT, COPY RIGHT)
			    (Exact Match to Discord.com:
			     - Large 3D Box (Box.webp) on top-right with scroll parallax)
			    ===================================================================== */}
			<section className="zy-section" id="voice">
				<div className="zy-container" style={{ position: "relative" }}>
					<img
						src="/site/media/discord/prop-box.webp"
						alt=""
						aria-hidden="true"
						className="zy-float-prop"
						data-zy-parallax="0.18"
						data-zy-parallax-rotate="-10"
						style={{
							width: "clamp(215px, 16.5vw, 295px)",
							top: "-132px",
							right: "-36px",
							zIndex: 4
						}}
					/>
					<img
						src="/site/media/discord/prop-rupee-gem.webp"
						alt=""
						aria-hidden="true"
						className="zy-float-prop"
						data-zy-parallax="-0.15"
						data-zy-parallax-rotate="12"
						style={{
							width: "clamp(130px, 10vw, 175px)",
							bottom: "-72px",
							left: "2%",
							zIndex: 2
						}}
					/>

					<div className="zy-showcase-card">
						<div className="zy-showcase-grid is-reversed">
							<div
								className="zy-scene-stage stage-emerald"
								style={{ backgroundImage: "url('/site/media/discord/sec3-bkg.webp')" }}
							>
								<video
									className="zy-stage-video"
									autoPlay
									loop
									muted
									playsInline
									poster="/site/media/discord/sec3-hop-in.webp"
								>
									<source src="/site/media/discord/sec3-hop-in.mp4" type="video/mp4" />
								</video>
							</div>

							<div className="zy-showcase-copy">
								<h2 className="zy-heading">HOP IN WHEN YOU'RE FREE, NO NEED TO CALL</h2>
								<p className="zy-body-lg">
									Easily hop in and out of voice or text chats without having to call or invite anyone, so your party chat lasts before, during, and after your game session.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    INFINITE SCROLLING MARQUEE RIBBON ("TALK ✦ PLAY ✦ CHAT ✦ HANG OUT")
			    ===================================================================== */}
			<div className="zy-marquee-band" aria-hidden="true">
				<div className="zy-marquee-track">
					{[0, 1, 2, 3].map(() => (
						<div className="zy-marquee-item">
							<span>TALK</span>
							<span className="zy-marquee-icon"><ZycordMark size={42} color="#ffffff" /></span>
							<span>PLAY</span>
							<span className="zy-marquee-icon"><ZycordMark size={42} color="#ffffff" /></span>
							<span>CHAT</span>
							<span className="zy-marquee-icon"><ZycordMark size={42} color="#ffffff" /></span>
							<span>HANG OUT</span>
							<span className="zy-marquee-icon"><ZycordMark size={42} color="#ffffff" /></span>
						</div>
					))}
				</div>
			</div>

			{/* =====================================================================
			    SECTION 4: SEE WHO'S AROUND TO CHILL (VIDEO RIGHT, COPY LEFT)
			    (Exact Match to Discord.com:
			     - Large 3D Coin (Set 3 3.webp) floating between Section 4 and Section 5 on the left)
			    ===================================================================== */}
			<section className="zy-section" id="presence">
				<div className="zy-container" style={{ position: "relative" }}>
					{/* Large 3D Discord Coin (Set 3 3.webp) floating in background bottom-left with scroll parallax */}
					<img
						src="/site/media/discord/prop-coin.webp"
						alt=""
						aria-hidden="true"
						className="zy-float-prop"
						data-zy-parallax="0.24"
						data-zy-parallax-rotate="16"
						style={{
							width: "clamp(190px, 16vw, 282px)",
							bottom: "-220px",
							left: "-105px",
							filter: "blur(2.5px) drop-shadow(0 22px 38px rgba(0, 0, 0, 0.48))",
							opacity: "0.86",
							zIndex: 1
						}}
					/>

					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<h2 className="zy-heading">SEE WHO'S AROUND TO CHILL</h2>
								<p className="zy-body-lg">
									See who's around, playing games, or just hanging out. For supported games, you can see what modes or characters your friends are playing and directly join up.
								</p>
							</div>

							<div
								className="zy-scene-stage stage-magenta"
								style={{ backgroundImage: "url('/site/media/discord/sec4-bkg.svg')" }}
							>
								<video
									className="zy-stage-video"
									autoPlay
									loop
									muted
									playsInline
									poster="/site/media/discord/sec4-chill.webp"
								>
									<source src="/site/media/discord/sec4-chill.mp4" type="video/mp4" />
								</video>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    SECTION 5: ALWAYS HAVE SOMETHING TO DO TOGETHER
			    (Exact Match to Discord.com:
			     - Green stage with Vibin/YouTube video on LEFT, Copy on RIGHT
			     - Woman upper body (sec5-card-characters.png) leaning hands OVER top edge of card
			     - Woman legs (sec5-woman-bottom.webp) behind the translucent glass card
			     - Two friends hugging (sec5-garfield-simon.webp) next to her along top-right edge
			     - Large 3D Radish/Turnip (Set 2 4.webp / prop-turnip.webp) on BOTTOM-LEFT corner with scroll parallax)
			    ===================================================================== */}
			<section className="zy-section" id="activities" style={{ paddingTop: "112px" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					{/* Woman's legs behind the frosted glass card */}
					<img
						src="/site/media/discord/sec5-woman-bottom.webp"
						alt=""
						aria-hidden="true"
						style={{
							position: "absolute",
							top: "6px",
							right: "25.5%",
							width: "168px",
							height: "auto",
							zIndex: 0,
							opacity: "0.45",
							pointerEvents: "none"
						}}
					/>
					{/* Woman in pink jacket with green headphones leaning hands on top border of card */}
					<img
						src="/site/media/discord/sec5-card-characters.png"
						alt=""
						aria-hidden="true"
						style={{
							position: "absolute",
							top: "-96px",
							right: "23.8%",
							width: "212px",
							height: "auto",
							zIndex: 6,
							pointerEvents: "none"
						}}
					/>
					{/* Two friends hugging (Garfield & Simon) sitting along top-right edge of card */}
					<img
						src="/site/media/discord/sec5-garfield-simon.webp"
						alt=""
						aria-hidden="true"
						style={{
							position: "absolute",
							top: "-132px",
							right: "7.5%",
							width: "198px",
							height: "auto",
							zIndex: 1,
							clipPath: "inset(0 0 43.5% 0)",
							pointerEvents: "none"
						}}
					/>
					{/* Large 3D Radish/Turnip (Set 2 4.webp) overlapping bottom-left corner of the card with scroll parallax */}
					<img
						src="/site/media/discord/prop-turnip.webp"
						alt=""
						aria-hidden="true"
						className="zy-float-prop"
						data-zy-parallax="0.18"
						data-zy-parallax-rotate="-10"
						style={{
							width: "clamp(185px, 14.5vw, 244px)",
							bottom: "-96px",
							left: "-58px",
							zIndex: 8
						}}
					/>

					<div className="zy-showcase-card">
						<div className="zy-showcase-grid is-reversed">
							<div
								className="zy-scene-stage stage-emerald"
								style={{ backgroundImage: "url('/site/media/discord/sec5-bkg.webp')" }}
							>
								<video
									className="zy-stage-video"
									autoPlay
									loop
									muted
									playsInline
									poster="/site/media/discord/sec5-activities.webp"
								>
									<source src="/site/media/discord/sec5-activities.mp4" type="video/mp4" />
								</video>
							</div>

							<div className="zy-showcase-copy">
								<h2 className="zy-heading">ALWAYS HAVE SOMETHING TO DO TOGETHER</h2>
								<p className="zy-body-lg">
									Watch videos, play built-in games, listen to music, or just scroll together and spam memes. Seamlessly text, call, video chat, and play games, all in one group chat.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    SECTION 6: WHEREVER YOU GAME, HANG OUT HERE (COPY LEFT, VIDEO RIGHT)
			    (Exact Match to Discord.com:
			     - Large 3D Plump/Pan prop (Set 3 4.webp) above top-right with scroll parallax)
			    ===================================================================== */}
			<section className="zy-section" id="platforms">
				<div className="zy-container" style={{ position: "relative" }}>
					<img
						src="/site/media/discord/prop-plump.webp"
						alt=""
						aria-hidden="true"
						className="zy-float-prop"
						data-zy-parallax="0.2"
						data-zy-parallax-rotate="12"
						style={{
							width: "clamp(175px, 15vw, 276px)",
							top: "-165px",
							right: "36px",
							zIndex: 1
						}}
					/>

					<div className="zy-showcase-card">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<h2 className="zy-heading">WHEREVER YOU GAME, HANG OUT HERE</h2>
								<p className="zy-body-lg">
									On your PC, phone, or console, you can still hang out on Zycord. Easily switch between devices and use tools to manage multiple group chats with friends.
								</p>
							</div>

							<div
								className="zy-scene-stage stage-cerulean"
								style={{ backgroundImage: "url('/site/media/discord/sec6-bkg.webp')" }}
							>
								<video
									className="zy-stage-video"
									autoPlay
									loop
									muted
									playsInline
									poster="/site/media/discord/sec6-platforms.webp"
								>
									<source src="/site/media/discord/sec6-platforms.mp4" type="video/mp4" />
								</video>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    FINAL CALL TO ACTION + OFFICIAL DISCORD 2026 HORIZON & WUMPUS SCENE
			    (Exact Match to Discord.com Screenshot 2:
			     - Single centered white button "Download for Windows"
			     - Full character lineup + 3D Clyde Robot + Wumpus sitting OVER the footer horizon edge)
			    ===================================================================== */}
			<section className="final-horizon-section" id="about">
				<img src="/site/media/discord/star-lg.svg" alt="" aria-hidden="true" className="zy-star d1" style={{ width: "30px", top: "10%", left: "14%" }} />
				<img src="/site/media/discord/star-m.svg" alt="" aria-hidden="true" className="zy-star d3" style={{ width: "22px", top: "16%", right: "16%" }} />

				<div className="zy-container">
					<h2
						className="zy-display"
						style={{
							fontSize: "clamp(32px, 4.8vw, 58px)",
							maxWidth: "920px",
							margin: "0 auto"
						}}
					>
						YOU CAN'T SCROLL ANYMORE. BETTER GO CHAT.
					</h2>
					<div className="hero-bottom-ctas" style={{ marginTop: "32px" }}>
						<a className="zy-btn zy-btn-secondary" href="/download/windows">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="7 10 12 15 17 10" />
								<line x1="12" y1="15" x2="12" y2="3" />
							</svg>
							<span>Download for Windows</span>
						</a>
					</div>
				</div>

				<div className="final-horizon-art">
					<img
						src="/site/media/discord/footer-horizon.webp"
						alt="Zycord Cosmic Horizon Lineup"
						className="final-horizon-bg"
						loading="lazy"
					/>
					<img
						src="/site/media/discord/dev-clyde-3d.webp"
						alt=""
						aria-hidden="true"
						className="final-horizon-clyde"
						loading="lazy"
					/>
					<img
						src="/site/media/discord/footer-smoke.gif"
						alt=""
						aria-hidden="true"
						className="final-horizon-smoke"
						loading="lazy"
					/>
					<img
						src="/site/media/discord/footer-wumpus-leaf.webp"
						alt=""
						aria-hidden="true"
						className="final-horizon-leaf"
						loading="lazy"
					/>
					<img
						src="/site/media/discord/footer-wumpus-sitting.webp"
						alt="Wumpus sitting on the cosmic horizon"
						className="final-horizon-wumpus"
						loading="lazy"
					/>
				</div>
			</section>
		</div>
	);
}
