import { h, Fragment } from "../runtime.jsx";
import { ZycordMark } from "../Icons.jsx";

export function HomePage() {
	return (
		<div className="zy-home-wrapper">
			{/* =====================================================================
			    HERO SECTION — OFFICIAL ZYCORD 2026 3D CHARACTERS, WUMPUS, CLYDE & UI
			    ===================================================================== */}
			<section className="hero-section zy-home-sec-tex-hero">
				<img src="/site/media/zycord/star-lg.svg" alt="" aria-hidden="true" className="zy-star d1" style={{ width: "32px", top: "8%", left: "5%" }} />
				<img src="/site/media/zycord/star-m.svg" alt="" aria-hidden="true" className="zy-star d2" style={{ width: "22px", top: "15%", right: "7%" }} />
				<img src="/site/media/zycord/star-sm.svg" alt="" aria-hidden="true" className="zy-star d3" style={{ width: "16px", bottom: "18%", left: "11%" }} />
				<img src="/site/media/zycord/star-lg.svg" alt="" aria-hidden="true" className="zy-star d4" style={{ width: "28px", bottom: "14%", right: "12%" }} />

				<div className="zy-container">
					<div className="hero-grid">
						<div className="hero-copy">
							<div className="hero-crown-wrap">
								<img
									src="/site/media/zycord/careers-crown.webp"
									alt=""
									aria-hidden="true"
									className="hero-crown"
									data-zy-parallax="0.14"
									data-zy-parallax-rotate="-8"
								/>
							</div>
							<h1 className="zy-display" style={{ whiteSpace: "nowrap" }}>
								GROUP CHAT<br />
								THAT'S ALL<br />
								FUN &amp; GAMES
							</h1>
							<p className="zy-body-lg">
								Zycord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.
							</p>
						</div>

						{/* Official Zycord 2026 3D Composite Stage */}
						<div className="hero-art-stage">
							<div className="hero-art-glow"></div>

							{/* Blurred 3D Trophy on far right behind monitor (Matches Screenshot 1) */}
							<img
								src="/site/media/zycord/download-trophy.webp"
								alt=""
								aria-hidden="true"
								className="hero-trophy-blur"
								data-zy-parallax="-0.16"
								data-zy-parallax-rotate="10"
							/>

							{/* Main 3D Devices + Characters Stage (Clean Base + Animated Individual Characters) */}
							<div className="hero-3d-composite">
								<img
									src="/site/media/zycord/hero-base-clean-2026.webp"
									alt="Zycord 3D Desktop and Mobile Interface"
									className="hero-main-devices-img"
									fetchpriority="high"
								/>
								{/* 3D Character Bottom-Left (Girl in pink jacket & blue scarf) */}
								<img
									src="/site/media/zycord/hero-girl-2026.webp"
									alt=""
									aria-hidden="true"
									className="hero-char-girl"
								/>
								{/* 3D Clyde Robot hovering with shadow next to controller */}
								<div className="hero-char-clyde-wrap">
									<img
										src="/site/media/zycord/hero-clyde.webp"
										alt=""
										aria-hidden="true"
										className="hero-char-clyde"
									/>
									<img
										src="/site/media/zycord/hero-clyde-shadow.webp"
										alt=""
										aria-hidden="true"
										className="hero-char-clyde-shadow"
									/>
								</div>
								{/* 3D Wumpus & Floating Leaf standing in front of monitor stand */}
								<div className="hero-char-wumpus-wrap">
									<img
										src="/site/media/zycord/hero-wumpus-leaf.webp"
										alt=""
										aria-hidden="true"
										className="hero-char-wumpus-leaf"
									/>
									<img
										src="/site/media/zycord/hero-wumpus.webp"
										alt="Zycord 3D Wumpus"
										className="hero-char-wumpus"
									/>
								</div>
								{/* 3D Character Bottom-Right (Boy in blue hoodie next to phone) */}
								<img
									src="/site/media/zycord/hero-boy.webp"
									alt=""
									aria-hidden="true"
									className="hero-char-boy"
								/>
							</div>
						</div>
					</div>

					{/* Centered Hero Bottom Dual CTA Pair (Exact Zycord layout) */}
					<div className="hero-bottom-ctas">
						<a className="zy-btn zy-btn-secondary" href="/download/windows">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
								<path d="M17.707 10.708L16.293 9.29398L13 12.587V2.00098H11V12.587L7.70697 9.29398L6.29297 10.708L12 16.415L17.707 10.708Z" />
								<path d="M18 18.001V20.001H6V18.001H4V20.001C4 21.103 4.897 22.001 6 22.001H18C19.104 22.001 20 21.103 20 20.001V18.001H18Z" />
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
			    (Exact Match to Zycord Screenshot 141401.png:
			     - Video on LEFT, Copy on RIGHT
			     - Party Wumpus peeking from behind the top-right of the card (z-index: 0)
			     - Blurred 3D Spotted Egg floating behind/below the bottom-left corner)
			    ===================================================================== */}
			<section className="zy-section zy-home-sec-tex-2" id="chat">
				<div className="zy-container" style={{ position: "relative" }}>
					{/* Animated Party Wumpus peeking from behind top-right of the card */}
					<img
						src="/site/media/zycord/party-wumpus.gif"
						alt=""
						aria-hidden="true"
						style={{
							position: "absolute",
							top: "-82px",
							right: "186px",
							width: "152px",
							zIndex: 0,
							pointerEvents: "none"
						}}
					/>
					{/* Blurred 3D Spotted Egg floating on bottom-left (Screenshot 141401 & 141358) */}
					<img
						src="/site/media/zycord/prop-egg.webp"
						alt=""
						aria-hidden="true"
						className="zy-float-prop"
						data-zy-parallax="0.18"
						data-zy-parallax-rotate="-10"
						style={{
							width: "clamp(180px, 14vw, 224px)",
							bottom: "-148px",
							left: "-42px",
							zIndex: 1,
							filter: "blur(3px) drop-shadow(0 18px 30px rgba(0, 0, 0, 0.48))",
							opacity: "0.92"
						}}
					/>

					<div className="zy-showcase-card is-card-1">
						<div className="zy-showcase-grid is-reversed">
							<div
								className="zy-scene-stage is-sec1 stage-magenta"
								style={{ backgroundImage: "url('/site/media/zycord/sec1-bkg.webp')" }}
							>
								<img
									src="/site/media/zycord/sec1-bkg.webp"
									alt=""
									aria-hidden="true"
									className="zy-stage-bg-img"
								/>
								<video
									className="zy-stage-video"
									autoPlay
									loop
									muted
									playsInline
									style={{ backgroundImage: "url('/site/media/zycord/sec1-bkg.webp')" }}
								>
									<source src="/site/media/zycord/sec1-chat-fun.mp4" type="video/mp4" />
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
			    (Exact Match to Zycord Screenshot 141358.png:
			     - Blurred 3D Clyde Cube floating below bottom-left)
			    ===================================================================== */}
			<section className="zy-section zy-home-sec-tex-3" id="video">
				<div className="zy-container" style={{ position: "relative" }}>
					<img
						src="/site/media/zycord/prop-clyde-cube.webp"
						alt=""
						aria-hidden="true"
						className="zy-float-prop"
						data-zy-parallax="0.16"
						data-zy-parallax-rotate="12"
						style={{
							width: "clamp(155px, 12.5vw, 188px)",
							bottom: "-135px",
							left: "92px",
							zIndex: 1,
							filter: "blur(2.5px) drop-shadow(0 18px 30px rgba(0, 0, 0, 0.46))",
							opacity: "0.9"
						}}
					/>

					<div className="zy-showcase-card is-card-2 is-copy-left">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<h2 className="zy-heading">STREAM LIKE YOU'RE IN THE SAME ROOM</h2>
								<p className="zy-body-lg">
									High quality and low latency streaming makes it feel like you're hanging out on the couch with friends while playing a game, watching shows, looking at photos, or idk doing homework or something.
								</p>
							</div>

							<div
								className="zy-scene-stage is-sec2 stage-cerulean"
								style={{ backgroundImage: "url('/site/media/zycord/sec2-bkg.png')" }}
							>
								<img
									src="/site/media/zycord/sec2-bkg.png"
									alt=""
									aria-hidden="true"
									className="zy-stage-bg-img"
								/>
								<video
									className="zy-stage-video"
									autoPlay
									loop
									muted
									playsInline
									style={{ backgroundImage: "url('/site/media/zycord/sec2-bkg.png')" }}
								>
									<source src="/site/media/zycord/sec2-stream.mp4" type="video/mp4" />
								</video>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    SECTION 3: HOP IN WHEN YOU'RE FREE, NO NEED TO CALL (VIDEO LEFT, COPY RIGHT)
			    (Exact Match to Zycord Screenshot 141355.png:
			     - Sharp 3D Pink/White Box overlapping the top-right border of the card)
			    ===================================================================== */}
			<section className="zy-section zy-home-sec-tex-4" id="voice">
				<div className="zy-container" style={{ position: "relative" }}>
					<img
						src="/site/media/zycord/prop-box.webp"
						alt=""
						aria-hidden="true"
						className="zy-float-prop"
						data-zy-parallax="0.14"
						data-zy-parallax-rotate="-8"
						style={{
							width: "clamp(185px, 14.5vw, 226px)",
							top: "-98px",
							right: "42px",
							zIndex: 6
						}}
					/>

					<div className="zy-showcase-card is-card-3">
						<div className="zy-showcase-grid is-reversed">
							<div
								className="zy-scene-stage is-sec3 stage-emerald"
								style={{ backgroundImage: "url('/site/media/zycord/sec3-bkg.webp')" }}
							>
								<img
									src="/site/media/zycord/sec3-bkg.webp"
									alt=""
									aria-hidden="true"
									className="zy-stage-bg-img"
								/>
								<video
									className="zy-stage-video"
									autoPlay
									loop
									muted
									playsInline
									style={{ backgroundImage: "url('/site/media/zycord/sec3-bkg.webp')" }}
								>
									<source src="/site/media/zycord/sec3-hop-in.mp4" type="video/mp4" />
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
							<span className="zy-marquee-icon"><ZycordMark size={44} color="#ffffff" /></span>
							<span>PLAY</span>
							<span className="zy-marquee-icon"><ZycordMark size={44} color="#ffffff" /></span>
							<span>CHAT</span>
							<span className="zy-marquee-icon"><ZycordMark size={44} color="#ffffff" /></span>
							<span>HANG OUT</span>
							<span className="zy-marquee-icon"><ZycordMark size={44} color="#ffffff" /></span>
						</div>
					))}
				</div>
			</div>

			{/* =====================================================================
			    SECTION 4: SEE WHO'S AROUND TO CHILL (VIDEO RIGHT, COPY LEFT)
			    (Exact Match to Zycord Screenshot 141350.png:
			     - Blurred 3D Coin overlapping bottom-left behind the card)
			    ===================================================================== */}
			<section className="zy-section zy-home-sec-tex-5" id="presence">
				<div className="zy-container" style={{ position: "relative" }}>
					<img
						src="/site/media/zycord/prop-coin.webp"
						alt=""
						aria-hidden="true"
						className="zy-float-prop"
						data-zy-parallax="0.18"
						data-zy-parallax-rotate="14"
						style={{
							width: "clamp(175px, 14vw, 228px)",
							bottom: "-86px",
							left: "-68px",
							filter: "blur(3px) drop-shadow(0 20px 34px rgba(0, 0, 0, 0.48))",
							opacity: "0.88",
							zIndex: 1
						}}
					/>

					<div className="zy-showcase-card is-card-4 is-copy-left">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<h2 className="zy-heading">SEE WHO'S AROUND TO CHILL</h2>
								<p className="zy-body-lg">
									See who's around, playing games, or just hanging out. For supported games, you can see what modes or characters your friends are playing and directly join up.
								</p>
							</div>

							<div
								className="zy-scene-stage is-sec4 stage-magenta"
								style={{ backgroundImage: "url('/site/media/zycord/sec4-bkg.png')" }}
							>
								<img
									src="/site/media/zycord/sec4-bkg.png"
									alt=""
									aria-hidden="true"
									className="zy-stage-bg-img"
								/>
								<video
									className="zy-stage-video"
									autoPlay
									loop
									muted
									playsInline
									style={{ backgroundImage: "url('/site/media/zycord/sec4-bkg.png')" }}
								>
									<source src="/site/media/zycord/sec4-chill.mp4" type="video/mp4" />
								</video>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    SECTION 5: ALWAYS HAVE SOMETHING TO DO TOGETHER
			    (Exact Match to Zycord Screenshot 141345.png:
			     - Green stage with Vibin/YouTube video on LEFT, Copy on RIGHT
			     - Woman & Friends characters sitting along top-right border of card
			     - Sharp 3D Radish/Turnip overlapping bottom-left corner of card
			     - Blurred 3D Plump/Pot floating below bottom-right)
			    ===================================================================== */}
			<section className="zy-section zy-home-sec-tex-6" id="activities" style={{ paddingTop: "136px" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					{/* Sharp 3D Radish/Turnip overlapping bottom-left corner of the card */}
					<img
						src="/site/media/zycord/prop-turnip.webp"
						alt=""
						aria-hidden="true"
						className="zy-float-prop"
						data-zy-parallax="0.14"
						data-zy-parallax-rotate="-8"
						style={{
							width: "clamp(155px, 12.5vw, 196px)",
							bottom: "-54px",
							left: "-24px",
							zIndex: 8
						}}
					/>
					{/* Blurred 3D Plump/Pot floating below bottom-right of Section 5 (Screenshot 141345 & 141340) */}
					<img
						src="/site/media/zycord/prop-plump.webp"
						alt=""
						aria-hidden="true"
						className="zy-float-prop"
						data-zy-parallax="0.16"
						data-zy-parallax-rotate="10"
						style={{
							width: "clamp(150px, 12vw, 192px)",
							bottom: "-142px",
							right: "88px",
							filter: "blur(3.5px) drop-shadow(0 18px 30px rgba(0, 0, 0, 0.45))",
							opacity: "0.86",
							zIndex: 1
						}}
					/>

					<div className="zy-sec5-3d-wrap">
						{/* Woman's upper body & hands OVER the top border of the glass card (z-index: 6) */}
						<img
							src="/site/media/zycord/sec5-card-characters.png"
							alt=""
							aria-hidden="true"
							className="zy-sec5-char-bot"
						/>
						{/* Woman's lower body BEHIND the frosted glass card (z-index: 1) */}
						<img
							src="/site/media/zycord/sec5-woman-bottom.webp"
							alt=""
							aria-hidden="true"
							className="zy-sec5-char-top"
						/>
						{/* Garfield & Simon hugging BEHIND the top-right edge of the card (z-index: 1) */}
						<img
							src="/site/media/zycord/sec5-garfield-simon.webp"
							alt=""
							aria-hidden="true"
							className="zy-sec5-char-friends"
						/>

						<div className="zy-showcase-card is-card-5 is-sec5">
							<div className="zy-showcase-grid is-reversed">
								<div
									className="zy-scene-stage is-sec5 stage-emerald"
									style={{ backgroundImage: "url('/site/media/zycord/sec5-bkg.webp')" }}
								>
									<img
										src="/site/media/zycord/sec5-bkg.webp"
										alt=""
										aria-hidden="true"
										className="zy-stage-bg-img"
									/>
									<video
										className="zy-stage-video"
										autoPlay
										loop
										muted
										playsInline
										style={{ backgroundImage: "url('/site/media/zycord/sec5-bkg.webp')" }}
									>
										<source src="/site/media/zycord/sec5-activities.mp4" type="video/mp4" />
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
				</div>
			</section>

			{/* =====================================================================
			    SECTION 6: WHEREVER YOU GAME, HANG OUT HERE (COPY LEFT, VIDEO RIGHT)
			    (Exact Match to Zycord Screenshot 141340.png & 141338.png)
			    ===================================================================== */}
			<section className="zy-section zy-home-sec-tex-7" id="platforms">
				<div className="zy-container" style={{ position: "relative" }}>
					<div className="zy-showcase-card is-card-6 is-copy-left">
						<div className="zy-showcase-grid">
							<div className="zy-showcase-copy">
								<h2 className="zy-heading">WHEREVER YOU GAME, HANG OUT HERE</h2>
								<p className="zy-body-lg">
									On your PC, phone, or console, you can still hang out on Zycord. Easily switch between devices and use tools to manage multiple group chats with friends.
								</p>
							</div>

							<div
								className="zy-scene-stage is-sec6 stage-cerulean"
								style={{ backgroundImage: "url('/site/media/zycord/sec6-bkg.webp')" }}
							>
								<img
									src="/site/media/zycord/sec6-bkg.webp"
									alt=""
									aria-hidden="true"
									className="zy-stage-bg-img"
								/>
								<video
									className="zy-stage-video"
									autoPlay
									loop
									muted
									playsInline
									style={{ backgroundImage: "url('/site/media/zycord/sec6-bkg.webp')" }}
								>
									<source src="/site/media/zycord/sec6-platforms.mp4" type="video/mp4" />
								</video>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* =====================================================================
			    FINAL CALL TO ACTION + OFFICIAL ZYCORD 2026 HORIZON & WUMPUS SCENE
			    (Exact Match to Zycord Screenshot 2:
			     - Single centered white button "Download for Windows"
			     - Full character lineup + 3D Clyde Robot + Wumpus sitting OVER the footer horizon edge)
			    ===================================================================== */}
			<section className="final-horizon-section zy-home-sec-tex-7" id="about">
				<img src="/site/media/zycord/star-lg.svg" alt="" aria-hidden="true" className="zy-star d1" style={{ width: "30px", top: "10%", left: "14%" }} />
				<img src="/site/media/zycord/star-m.svg" alt="" aria-hidden="true" className="zy-star d3" style={{ width: "22px", top: "16%", right: "16%" }} />

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
							<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
								<path d="M17.707 10.708L16.293 9.29398L13 12.587V2.00098H11V12.587L7.70697 9.29398L6.29297 10.708L12 16.415L17.707 10.708Z" />
								<path d="M18 18.001V20.001H6V18.001H4V20.001C4 21.103 4.897 22.001 6 22.001H18C19.104 22.001 20 21.103 20 20.001V18.001H18Z" />
							</svg>
							<span>Download for Windows</span>
						</a>
					</div>
				</div>

				<div className="final-horizon-art">
					{/* Dark Horizon Floor Shelf (Matches Screenshot 2) */}
					<div className="final-horizon-floor" aria-hidden="true"></div>

					<img
						src="/site/media/zycord/footer-horizon.webp"
						alt="Zycord Cosmic Horizon Lineup"
						className="final-horizon-bg"
						loading="lazy"
					/>
					<img
						src="/site/media/zycord/dev-clyde-3d.webp"
						alt=""
						aria-hidden="true"
						className="final-horizon-clyde"
						loading="lazy"
					/>
					<img
						src="/site/media/zycord/footer-smoke.gif"
						alt=""
						aria-hidden="true"
						className="final-horizon-smoke"
						loading="lazy"
					/>
					{/* 3D Sitting Wumpus with Green Leaf in Center Gap, dangling legs over edge */}
					<div className="final-horizon-wumpus-wrap">
						<img
							src="/site/media/zycord/footer-wumpus-leaf.webp"
							alt=""
							aria-hidden="true"
							className="final-horizon-leaf"
							loading="lazy"
						/>
						<img
							src="/site/media/zycord/footer-wumpus-sitting.webp"
							alt="Wumpus sitting on the cosmic horizon"
							className="final-horizon-wumpus"
							loading="lazy"
						/>
					</div>
				</div>
			</section>
		</div>
	);
}
