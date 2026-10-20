import { h } from "../runtime.jsx";
import { BlogPage as MarketingBlogPage } from "./MarketingParity.jsx";

/* ============================================================================
   1. DOWNLOAD PAGE (/download) — Exact 2026 Zycord Layout
   ============================================================================ */
export function DownloadPage() {
	return (
		<div className="zy-download-page">
			{/* Hero (.download_hero.is_download) */}
			<section className="zy-dl-hero-section">
				<div className="zy-container">
					<div className="zy-subhero-inner">
						<img
							src="/site/media/zycord/prop-coin.webp"
							alt=""
							aria-hidden="true"
							className="zy-dl-coin"
						/>
						<h1 className="zy-subhero-title">Download Zycord wherever you hang out</h1>
						<p className="zy-subhero-sub">
							Talk, play, and hang out with friends around the world over voice, video, or text. Available on Windows, macOS, Linux, iOS, Android, and consoles.
						</p>
						<div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginTop: "10px" }}>
							<a className="zy-btn zy-btn-primary" href="/download/windows" style={{ padding: "15.5px 28px", fontSize: "18px" }}>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M17.707 10.708L16.293 9.29398L13 12.587V2.00098H11V12.587L7.70697 9.29398L6.29297 10.708L12 16.415L17.707 10.708Z" />
									<path d="M18 18.001V20.001H6V18.001H4V20.001C4 21.103 4.897 22.001 6 22.001H18C19.104 22.001 20 21.103 20 20.001V18.001H18Z" />
								</svg>
								<span>Download for Windows</span>
							</a>
						</div>
					</div>

					{/* Massive Download Hero Stage with Clyde TOP-RIGHT & Wumpus+Leaf BOTTOM-LEFT */}
					<div className="zy-dl-hero-stage">
						<img
							src="/site/media/zycord/download-clyde-point.webp"
							alt=""
							aria-hidden="true"
							className="zy-dl-clyde"
						/>
						<img
							src="/site/media/zycord/download-hero.webp"
							alt="Zycord Desktop and Mobile Interface"
							className="zy-dl-hero-img"
						/>
						<div className="zy-dl-wumpus-wrap">
							<img
								src="/site/media/zycord/download-leaf.webp"
								alt=""
								aria-hidden="true"
								className="zy-dl-wumpus-leaf"
							/>
							<img
								src="/site/media/zycord/download-wumpus-point.webp"
								alt=""
								aria-hidden="true"
								className="zy-dl-wumpus-body"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Alternating Platform Rows */}
			<section className="zy-section zy-dl-rows-section">
				<div className="zy-container zy-dl-container">
					{/* 1. Desktop */}
					<div className="zy-alt-row">
						<div className="zy-alt-copy">
							<h2 className="zy-alt-title">Download for desktop</h2>
							<p className="zy-body-lg">
								Use Zycord to easily talk while playing your favorite PC games, show what you’re playing as your status, and stream your games to your friends.
							</p>
							<div className="zy-pill-btn-row">
								<a className="zy-white-pill-btn" href="/download/macos" download="Zycord-macOS.zip">
									<svg width="24" height="25" viewBox="0 0 24 25" fill="currentColor" aria-hidden="true">
										<path d="M19.6239 8.31868C19.5079 8.40869 17.4597 9.56281 17.4597 12.1291C17.4597 15.0974 20.066 16.1475 20.144 16.1735C20.132 16.2375 19.7299 17.6116 18.7698 19.0118C17.9138 20.2439 17.0197 21.474 15.6595 21.474C14.2994 21.474 13.9494 20.6839 12.3792 20.6839C10.849 20.6839 10.305 21.5 9.06087 21.5C7.81675 21.5 6.94866 20.3599 5.95056 18.9597C4.79444 17.3156 3.86035 14.7613 3.86035 12.3371C3.86035 8.44869 6.3886 6.38649 8.87685 6.38649C10.199 6.38649 11.3011 7.25458 12.1312 7.25458C12.9213 7.25458 14.1534 6.33448 15.6575 6.33448C16.2276 6.33448 18.2758 6.38649 19.6239 8.31868ZM14.9435 4.68832C15.5655 3.95024 16.0056 2.92614 16.0056 1.90204C16.0056 1.76003 15.9936 1.61601 15.9676 1.5C14.9555 1.538 13.7513 2.17407 13.0253 3.01615C12.4552 3.66422 11.9232 4.68832 11.9232 5.72642C11.9232 5.88244 11.9492 6.03845 11.9612 6.08846C12.0252 6.10046 12.1292 6.11446 12.2332 6.11446C13.1413 6.11446 14.2834 5.5064 14.9435 4.68832Z" />
									</svg>
									<span>macOS</span>
								</a>

								{/* Interactive Windows Dropdown (x64 / ARM64) */}
								<div className="zy-action-dropdown" data-zy-dropdown>
									<button type="button" className="zy-white-pill-btn" data-zy-dropdown-toggle style={{ border: "none", cursor: "pointer" }}>
										<svg width="24" height="25" viewBox="0 0 24 25" fill="currentColor" aria-hidden="true">
											<path d="M4 4.5H11.5848V12.0815H4V4.5ZM12.4152 4.5H20V12.0815H12.4152V4.5ZM4 12.9152H11.5848V20.5H4V12.9152ZM12.4152 12.9152H20V20.5H12.4152" />
										</svg>
										<span>Windows</span>
										<svg className="zy-action-dropdown-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
											<polyline points="3.5 6 8 10.5 12.5 6" />
										</svg>
									</button>
									<div className="zy-action-dropdown-menu" role="menu">
										<a className="zy-action-dropdown-item" href="/download/windows?arch=x64">
											<span>x64</span>
										</a>
										<a className="zy-action-dropdown-item" href="/download/windows?arch=arm64">
											<span>ARM64</span>
										</a>
									</div>
								</div>

								{/* Interactive Linux Dropdown (deb / tar.gz / rpm / pkg.tar.zst) */}
								<div className="zy-action-dropdown" data-zy-dropdown>
									<button type="button" className="zy-white-pill-btn" data-zy-dropdown-toggle style={{ border: "none", cursor: "pointer" }}>
										<svg width="24" height="25" viewBox="0 0 24 25" fill="currentColor" aria-hidden="true">
											<path d="M6.09159 20.5316C7.0409 20.645 8.10753 21.2599 9.00016 21.3685C9.89759 21.4818 10.1753 20.7574 10.1753 20.7574C10.1753 20.7574 11.1852 20.5316 12.2469 20.5056C13.3096 20.4758 14.3156 20.7266 14.3156 20.7266C14.3156 20.7266 14.5107 21.1734 14.8749 21.3685C15.2391 21.5674 16.0231 21.5943 16.5256 21.0648C17.0291 20.5316 18.3724 19.8599 19.1267 19.44C19.8858 19.0191 19.7465 18.3773 19.2699 18.1822C18.7934 17.9872 18.4032 17.6797 18.433 17.0897C18.459 16.5046 18.0122 16.1145 18.0122 16.1145C18.0122 16.1145 18.4032 14.8269 18.0391 13.7603C17.6749 12.6986 16.4738 10.9911 15.5504 9.70743C14.6271 8.41988 15.4111 6.93343 14.5704 5.03377C13.7296 3.13126 11.5494 3.24371 10.3743 4.05463C9.19913 4.8656 9.55942 6.87668 9.6161 7.83085C9.67279 8.78017 9.64204 9.45948 9.53347 9.7036C9.4249 9.95148 8.66679 10.8518 8.1633 11.6061C7.66079 12.3642 7.29656 13.9295 6.92856 14.5752C6.56822 15.2171 6.81999 15.8022 6.81999 15.8022C6.81999 15.8022 6.56827 15.8887 6.36936 16.3096C6.17427 16.7256 5.78416 16.9245 5.08176 17.0601C4.38416 17.2032 4.38416 17.6529 4.55233 18.1564C4.72142 18.6589 4.55233 18.9404 4.35725 19.5823C4.16222 20.2241 5.13845 20.4191 6.09159 20.5316ZM15.9597 17.6038C16.4584 17.8219 17.1752 17.5182 17.3933 17.3001C17.6105 17.083 17.7642 16.7601 17.7642 16.7601C17.7642 16.7601 17.9823 16.8687 17.9602 17.2136C17.9371 17.5634 18.1101 18.062 18.4368 18.235C18.7635 18.407 19.2622 18.6472 19.0037 18.8874C18.7404 19.1276 17.2838 19.7138 16.8485 20.1711C16.4171 20.6256 15.8502 20.9975 15.5052 20.8879C15.1564 20.7794 14.8518 20.3028 15.0018 19.6052C15.1564 18.9105 15.2871 18.1485 15.265 17.7132C15.242 17.278 15.1564 16.6919 15.265 16.6054C15.3736 16.5198 15.5466 16.5611 15.5466 16.5611C15.5466 16.5611 15.46 17.3867 15.9597 17.6038ZM12.7235 5.84474C13.2039 5.84474 13.5912 6.32131 13.5912 6.90743C13.5912 7.32348 13.3961 7.68383 13.1107 7.8568C13.0387 7.82703 12.9637 7.79337 12.8811 7.75874C13.054 7.67325 13.1741 7.45514 13.1741 7.20337C13.1741 6.87383 12.9714 6.60286 12.7167 6.60286C12.4688 6.60286 12.2622 6.87377 12.2622 7.20337C12.2622 7.32354 12.292 7.4436 12.341 7.53777C12.1911 7.4772 12.0556 7.42537 11.9471 7.38405C11.8904 7.24085 11.8567 7.07943 11.8567 6.90748C11.8568 6.32137 12.243 5.84474 12.7235 5.84474ZM11.5339 7.67617C11.7703 7.71748 12.4198 7.99903 12.6601 8.08548C12.9003 8.16811 13.1664 8.32183 13.1405 8.4756C13.1107 8.63411 12.9868 8.63411 12.6601 8.83303C12.3372 9.02811 11.632 9.46337 11.4062 9.49314C11.1813 9.52291 11.0535 9.39605 10.8132 9.24137C10.573 9.08377 10.1224 8.71577 10.2358 8.52074C10.2358 8.52074 10.5884 8.25074 10.7422 8.1124C10.8959 7.9692 11.2937 7.63194 11.5339 7.67617ZM10.4981 6.01388C10.8767 6.01388 11.1851 6.46451 11.1851 7.01988C11.1851 7.1208 11.1736 7.21491 11.1554 7.30908C11.0612 7.33886 10.9671 7.38788 10.8767 7.46668C10.8325 7.50417 10.7911 7.53777 10.7537 7.57526C10.8132 7.46286 10.8363 7.30143 10.8094 7.13228C10.7575 6.83251 10.5548 6.61057 10.3559 6.64034C10.156 6.674 10.0368 6.9488 10.0849 7.25246C10.1378 7.55994 10.3366 7.78183 10.5394 7.74823C10.5509 7.7444 10.5615 7.74057 10.573 7.73668C10.476 7.83085 10.3856 7.91348 10.2915 7.98074C10.0176 7.85291 9.8149 7.47051 9.8149 7.01988C9.81496 6.46068 10.1186 6.01388 10.4981 6.01388ZM8.38902 13.2838C8.77913 12.6689 9.03084 11.3246 9.42096 10.8778C9.81496 10.4319 10.1186 9.48165 9.98021 9.06177C9.98021 9.06177 10.821 10.0678 11.4062 9.90251C11.9923 9.73337 13.3096 8.75428 13.5047 8.92245C13.6998 9.09154 15.3774 12.7813 15.5465 13.9564C15.7156 15.1306 15.4341 16.0281 15.4341 16.0281C15.4341 16.0281 14.7923 15.8589 14.7096 16.249C14.627 16.643 14.627 18.0699 14.627 18.0699C14.627 18.0699 13.7593 19.271 12.416 19.4698C11.0727 19.6649 10.4 19.5227 10.4 19.5227L9.64576 18.6588C9.64576 18.6588 10.2319 18.5724 10.1492 17.9834C10.0666 17.3982 8.35816 16.5872 8.05067 15.8589C7.7433 15.1305 7.9941 13.8997 8.38902 13.2838ZM5.0673 17.6903C5.13456 17.402 6.00507 17.4021 6.33947 17.1993C6.67387 16.9966 6.74107 16.4143 7.01113 16.2606C7.27724 16.103 7.76924 16.6622 7.97199 16.9773C8.1709 17.2848 8.9329 18.6291 9.24422 18.9634C9.55936 19.3007 9.84862 19.7475 9.75827 20.1491C9.67279 20.5507 9.19907 20.8438 9.19907 20.8438C8.77536 20.9745 7.59347 20.4643 7.05639 20.2394C6.5193 20.0136 5.1529 19.9463 4.97707 19.7475C4.79645 19.5447 5.06353 19.0979 5.13462 18.6742C5.19799 18.2456 4.99913 17.9795 5.0673 17.6903Z" />
										</svg>
										<span>Linux</span>
										<svg className="zy-action-dropdown-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
											<polyline points="3.5 6 8 10.5 12.5 6" />
										</svg>
									</button>
									<div className="zy-action-dropdown-menu" role="menu">
										<a className="zy-action-dropdown-item" href="/download/linux?format=deb">
											<span>deb</span>
										</a>
										<a className="zy-action-dropdown-item" href="/download/linux?format=tar.gz">
											<span>tar.gz</span>
										</a>
										<a className="zy-action-dropdown-item" href="/download/linux?format=rpm">
											<span>rpm</span>
										</a>
										<a className="zy-action-dropdown-item" href="/download/linux?format=pkg.tar.zst">
											<span>pkg.tar.zst</span>
										</a>
									</div>
								</div>
							</div>
						</div>
						<div className="zy-alt-media-card is-green is-dl-desktop">
							<img src="/site/media/zycord/download-desktop-card.webp" alt="Download Zycord for Desktop" />
						</div>
					</div>

					{/* 2. Mobile */}
					<div className="zy-alt-row is-reversed">
						<div className="zy-alt-media-card is-blue is-dl-mobile">
							<img src="/site/media/zycord/download-mobile-card.webp" alt="Download Zycord for Mobile" />
						</div>
						<div className="zy-alt-copy">
							<h2 className="zy-alt-title">Download for mobile</h2>
							<p className="zy-body-lg">
								Out and about? Sunk in a massive beanbag? Bring Zycord with you and chat whenever, have fun with friends, or just see what’s up.
							</p>
							<div className="zy-pill-btn-row">
								<a className="zy-white-pill-btn" href="/download/Zycord.mobileconfig">
									<svg width="24" height="25" viewBox="0 0 24 25" fill="currentColor" aria-hidden="true">
										<path d="M19.6239 8.31868C19.5079 8.40869 17.4597 9.56281 17.4597 12.1291C17.4597 15.0974 20.066 16.1475 20.144 16.1735C20.132 16.2375 19.7299 17.6116 18.7698 19.0118C17.9138 20.2439 17.0197 21.474 15.6595 21.474C14.2994 21.474 13.9494 20.6839 12.3792 20.6839C10.849 20.6839 10.305 21.5 9.06087 21.5C7.81675 21.5 6.94866 20.3599 5.95056 18.9597C4.79444 17.3156 3.86035 14.7613 3.86035 12.3371C3.86035 8.44869 6.3886 6.38649 8.87685 6.38649C10.199 6.38649 11.3011 7.25458 12.1312 7.25458C12.9213 7.25458 14.1534 6.33448 15.6575 6.33448C16.2276 6.33448 18.2758 6.38649 19.6239 8.31868ZM14.9435 4.68832C15.5655 3.95024 16.0056 2.92614 16.0056 1.90204C16.0056 1.76003 15.9936 1.61601 15.9676 1.5C14.9555 1.538 13.7513 2.17407 13.0253 3.01615C12.4552 3.66422 11.9232 4.68832 11.9232 5.72642C11.9232 5.88244 11.9492 6.03845 11.9612 6.08846C12.0252 6.10046 12.1292 6.11446 12.2332 6.11446C13.1413 6.11446 14.2834 5.5064 14.9435 4.68832Z" />
									</svg>
									<span>iOS</span>
								</a>
								<a className="zy-white-pill-btn" href="/download/android" download="Zycord.apk">
									<svg width="24" height="25" viewBox="0 0 24 25" fill="currentColor" aria-hidden="true">
										<path d="M12.411 13.3719L4.51124 21.248L4.65636 21.3458C5.01074 21.5483 5.44836 21.5517 5.80498 21.3537L15.1942 16.1484L12.411 13.3719ZM4.08374 20.0858L11.6145 12.5776L4.08374 5.0694V20.0858ZM19.9979 11.5145L16.3192 9.47488L13.2075 12.5776L16.218 15.5802L19.9979 13.4855C20.3602 13.2841 20.5841 12.9084 20.5841 12.5C20.5841 12.0916 20.3602 11.7159 19.9979 11.5145ZM4.65636 3.65415L4.42799 3.82515L12.411 11.7834L15.2955 8.90789L5.80498 3.64628C5.44836 3.44828 5.01074 3.45165 4.65636 3.65415Z" />
									</svg>
									<span>Android APK</span>
								</a>
							</div>
						</div>
					</div>

					{/* 3. Console */}
					<div className="zy-alt-row">
						<div className="zy-alt-copy">
							<h2 className="zy-alt-title">Link your console</h2>
							<p className="zy-body-lg">
								Coordinate from the couch and talk with your Zycord friends across PC, mobile, and your fellow console users — supported platforms even let you stream your game directly from your console.
							</p>
							<div className="zy-pill-btn-row">
								<a className="zy-white-pill-btn" href="/blog">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<path d="M14.6814 7.63604V12.9786C16.9395 14.0641 18.7164 12.9772 18.7164 10.1098C18.7164 7.16804 17.6761 5.86227 14.6087 4.81347C13.4028 4.40838 10.8827 3.73515 9.29913 3.4502V19.402L13.2409 20.5474V7.16849C13.2409 6.54142 13.5219 6.12277 13.9748 6.26736C14.5659 6.43137 14.6814 7.00852 14.6814 7.63604ZM19.7146 14.4624C18.5436 13.9992 17.0516 13.8401 15.8335 13.9805L13.5759 14.5016V16.2555L16.5739 15.1539C17.0853 14.9626 17.8355 14.9216 18.25 15.0634C18.6644 15.2052 18.5865 15.4749 18.0758 15.6658L13.5759 17.3387V19.0285L19.6907 16.737C20.5126 16.4222 20.8483 15.9806 20.8483 15.9806C21.1835 15.5387 21.0345 14.8977 19.7146 14.4624ZM3.33921 15.4713C2.69265 15.9491 2.94775 16.7166 4.34774 17.1764C5.86965 17.6763 7.32914 17.9804 8.71894 17.7357L8.99585 17.6859V16.1144L7.70419 16.4963C7.16946 16.6879 6.38308 16.7279 5.94907 16.5864C5.51511 16.4446 5.5968 16.1749 6.13157 15.984L8.99585 15.0096V13.2532L4.95387 14.6976C3.93724 15.0297 3.33921 15.4713 3.33921 15.4713Z" />
									</svg>
									<span>Playstation</span>
								</a>
								<a className="zy-white-pill-btn" href="/blog">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<path d="M11.9824 4C10.4899 4 9.06724 4.41739 7.88739 5.14783C8.8 4.7 11.1 6.2 11.98 6.75C12.9 6.2 15.2 4.7 16.08 5.15C14.9 4.42 13.48 4 11.9824 4ZM6.15 6.54C4.83 7.97 4 9.88 4 12C4 16.42 7.57 20 11.98 20C14.31 20 16.43 18.99 17.88 17.39C16.8 14.8 13.1 10.8 11.98 9.95C10.8 10.8 7.1 14.8 6.15 17.43C5.7 15.8 7.5 11.5 10.5 8.17C9.5 7.1 7.5 6.1 6.15 6.54ZM17.85 6.57C16.5 6.1 14.5 7.1 13.47 8.17C16.5 11.5 18.3 15.8 17.92 17.39C19.2 15.97 20 14.09 20 12C19.97 9.91 19.17 8 17.85 6.57Z" />
									</svg>
									<span>Xbox</span>
								</a>
							</div>
						</div>
						<div className="zy-alt-media-card is-pink is-dl-console">
							<img src="/site/media/zycord/download-console-card.webp" alt="Link your console to Zycord" />
						</div>
					</div>

					{/* 4. VR (Meta Quest — Official download-vr-card.png) */}
					<div className="zy-alt-row is-reversed is-last-dl-row">
						<div className="zy-alt-media-card is-dl-vr"></div>
						<div className="zy-alt-copy">
							<h2 className="zy-alt-title">Download for VR</h2>
							<p className="zy-body-lg">
								Connect with your Zycord communities and DMs from wherever the virtual world takes you. On supported platforms, you’ll be able to join video calls with a digital avatar.
							</p>
							<div className="zy-pill-btn-row">
								<a className="zy-white-pill-btn" data-zy-open-app href="/app">
									<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<path d="M2.59229 14.6835C2.59229 15.6148 2.79343 16.3298 3.05634 16.7624C3.40103 17.329 3.91515 17.569 4.43928 17.569C5.11531 17.569 5.73376 17.3985 6.92558 15.7234C7.88037 14.3807 9.00543 12.4961 9.76241 11.3146L11.0444 9.31292C11.9349 7.92278 12.9656 6.37741 14.1474 5.32993C15.1123 4.47497 16.153 4 17.2004 4C18.959 4 20.634 5.03561 21.916 6.97792C23.319 9.10512 24 11.7845 24 14.5495C24 16.1933 23.6812 17.401 23.1387 18.3552C22.6145 19.278 21.593 20.2 19.8745 20.2V17.569C21.3459 17.569 21.7132 16.195 21.7132 14.6225C21.7132 12.3816 21.1991 9.89476 20.0665 8.11785C19.2628 6.85748 18.2212 6.08734 17.0753 6.08734C15.8359 6.08734 14.8385 7.03729 13.7176 8.73108C13.1217 9.63098 12.5099 10.7277 11.8231 11.9651L11.0669 13.3265C9.54792 16.0635 9.16317 16.6869 8.40367 17.7157C7.07247 19.5172 5.93574 20.2 4.43928 20.2C2.66407 20.2 1.54152 19.4188 0.846293 18.2416C0.278759 17.2823 0 16.0236 0 14.5894L2.59229 14.6835Z" />
										<path d="M2.04395 7.16367C3.23243 5.30194 4.94755 4 6.91472 4C8.05396 4 9.18652 4.34266 10.3692 5.32399C11.6628 6.39692 13.0416 8.16365 14.7617 11.0754L15.3785 12.1204C16.8674 14.6411 17.7146 15.938 18.2103 16.5495C18.8479 17.3349 19.2945 17.569 19.8745 17.569C21.3459 17.569 21.7132 16.195 21.7132 14.6225L24 14.5495C24 16.1933 23.6812 17.401 23.1387 18.3552C22.6145 19.278 21.593 20.2 19.8745 20.2C18.8062 20.2 17.8598 19.9642 16.8132 18.9608C16.0086 18.1907 15.068 16.8226 14.3444 15.5928L12.1919 11.9388C11.112 10.1051 10.1213 8.73786 9.54791 8.1187C8.93113 7.45289 8.13826 6.64883 6.87299 6.64883C5.84892 6.64883 4.97926 7.3791 4.25148 8.49614L2.04395 7.16367Z" />
										<path d="M6.873 6.64883C5.84894 6.64883 4.97927 7.3791 4.2515 8.49614C3.22242 10.0746 2.59229 12.4257 2.59229 14.6835C2.59229 15.6148 2.79343 16.3298 3.05634 16.7624L0.846293 18.2416C0.278759 17.2823 0 16.0236 0 14.5894C0 11.9813 0.70441 9.26288 2.04396 7.16366C3.23244 5.30194 4.94756 4 6.91473 4L6.873 6.64883Z" />
									</svg>
									<span>Meta Quest</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Bottom "Feeling experimental?" Section (.download-banner.is-download.is_new-2026) */}
			<section className="zy-dl-ptb-banner">
				<div className="zy-container">
					<div className="zy-dl-ptb-inner">
						<img
							src="/site/media/zycord/download-ptb-3d.png"
							alt=""
							aria-hidden="true"
							className="zy-dl-ptb-icon"
						/>
						<img
							src="/site/media/zycord/download-trophy.webp"
							alt=""
							aria-hidden="true"
							className="zy-dl-ptb-trophy"
						/>
						<h2 className="zy-dl-ptb-title">Feeling experimental?</h2>
						<p className="zy-dl-ptb-sub">
							Try out the newest features before they launch by using our Public Test Build.
						</p>
						<div className="zy-ptb-dropdown-wrap">
							<div className="zy-action-dropdown zy-ptb-dropdown" data-zy-dropdown>
								<button type="button" className="zy-ptb-dropdown-btn" data-zy-dropdown-toggle>
									<span>Download Test Build</span>
									<svg className="zy-action-dropdown-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M4.66699 6.6665L8.00033 9.99984L11.3337 6.6665" />
									</svg>
								</button>
								<div className="zy-action-dropdown-menu zy-ptb-dropdown-menu" role="menu">
									<a className="zy-ptb-dropdown-item" href="/download/windows?channel=ptb&platform=osx">Mac</a>
									<a className="zy-ptb-dropdown-item" href="/download/windows?channel=ptb&arch=x64">Windows 64-bit</a>
									<a className="zy-ptb-dropdown-item" href="/download/windows?channel=ptb&arch=arm64">Windows ARM64</a>
									<a className="zy-ptb-dropdown-item" href="/download/windows?channel=ptb&platform=linux&format=deb">Linux deb</a>
									<a className="zy-ptb-dropdown-item" href="/download/windows?channel=ptb&platform=linux&format=tar.gz">Linux tar.gz</a>
									<a className="zy-ptb-dropdown-item" href="/download/windows?channel=ptb&platform=linux&format=rpm">Linux rpm</a>
									<a className="zy-ptb-dropdown-item" href="/download/windows?channel=ptb&platform=linux&format=pkg.tar.zst">Linux pkg.tar.zst</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

/* ============================================================================
   2. QUESTS PAGE (/quests) — Exact 2026 Zycord Layout
   ============================================================================ */
export function QuestsPage() {
	return (
		<div className="zy-quests-page">
			{/* Hero with official quests-hero-bg.webp & floating cauldron */}
			<section
				className="zy-subhero"
				style={{
					backgroundImage: "linear-gradient(180deg, rgba(16,18,56,0.58) 0%, rgba(16,18,56,0.95) 100%), url('/site/media/zycord/quests-hero-bg.webp')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					paddingTop: "140px",
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
							src="/site/media/zycord/quests-cauldron.avif"
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
							<img src="/site/media/zycord/quests-step-1.webp" alt="1. They accept your Quest" />
						</div>
					</div>

					<div className="zy-alt-row is-reversed">
						<div className="zy-alt-media-card is-blue">
							<img src="/site/media/zycord/quests-step-2.webp" alt="2. Play or Watch" />
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
							<img src="/site/media/zycord/quests-step-3.webp" alt="3. And Collect Rewards" />
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
								<img src="/site/media/zycord/quests-wumpus-banner.webp" alt="Zycord Quests Hero Banner" style={{ width: "100%", height: "auto", borderRadius: "24px" }} />
								<img src="/site/media/zycord/quests-missions.webp" alt="Zycord Quests Interactive Missions" style={{ width: "100%", height: "auto", borderRadius: "24px" }} />
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

			{/* Bottom CTA Banner */}
			<section className="zy-dl-ptb-banner" style={{ paddingBottom: "10rem" }}>
				<div className="zy-container">
					<div className="zy-dl-ptb-inner">
						<img src="/site/media/zycord/quests-cauldron.avif" alt="" aria-hidden="true" className="zy-dl-ptb-icon" style={{ width: "160px" }} />
						<img src="/site/media/zycord/download-trophy.webp" alt="" aria-hidden="true" className="zy-dl-ptb-trophy" style={{ width: "170px" }} />
						<h2 className="zy-dl-ptb-title">READY TO LAUNCH YOUR QUEST?</h2>
						<p className="zy-dl-ptb-sub">
							Reward players with exclusive Avatar Decorations, Orbs, and in-game loot on Zycord.
						</p>
						<div className="zy-pill-btn-row" style={{ justifyContent: "center", marginTop: "12px" }}>
							<a className="zy-btn zy-btn-primary" data-zy-open-app href="/app">Explore Quests in App</a>
							<a className="zy-btn zy-btn-secondary" href="/developers">Developer Solutions</a>
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
			img: "/site/media/zycord/sec1-chat-fun.webp",
			title: "Introducing Full Profile Collectibles: Avatar Decorations, Nameplates, Effects & Frames",
			desc: "Customize every layer of your Zycord identity with 1,099+ collectibles across 9 categories, full-card profile effects, and non-obscuring perimeter frames."
		},
		{
			cat: "Engineering & Developers",
			id: "engineering",
			img: "/site/media/zycord/dev-hero-16x9.webp",
			title: "How Zycord Routes Sub-20ms WebRTC Voice & 1080p 60fps Video Streams",
			desc: "A deep dive into our SFU media architecture, Opus audio packet prioritization, and hardware-accelerated screen sharing."
		},
		{
			cat: "Policy & Safety",
			id: "safety",
			img: "/site/media/zycord/safety-card-1.png",
			title: "End-to-End Encrypted Direct Messages & Passkey Authentication",
			desc: "Protecting private conversations with zero-knowledge client-side WebCrypto keys, recovery codes, and WebAuthn security."
		},
		{
			cat: "Community",
			id: "community",
			img: "/site/media/zycord/sec5-activities.webp",
			title: "Community Spotlight: Hosting 100-Player Esports Watch Parties",
			desc: "See how gaming communities use Stage channels, custom soundboards, and Role Icons to run weekly tournaments."
		},
		{
			cat: "Zycord HQ",
			id: "hq",
			img: "/site/media/zycord/careers-office-1.webp",
			title: "Inside Zycord HQ: Building the Future of Real-Time Hangouts",
			desc: "Meet the engineering and design teams crafting a faster, more expressive communication platform."
		},
		{
			cat: "How to Zycord",
			id: "guides",
			img: "/site/media/zycord/sec4-chill.webp",
			title: "How to Link Steam, Spotify, GitHub, PlayStation & Xbox for Rich Presence",
			desc: "Step-by-step guide to connecting your accounts so friends can see what you're playing and jump right into your lobby."
		}
	];

	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/zycord/nav-blog-cube.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "132px", top: "-42px", right: "6%" }} />
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
								<img src="/site/media/zycord/quests-missions.webp" alt="Zycord Featured Update" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
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
		{ name: "ZyGuard AutoMod", cat: "Moderation & Security", installs: "42,800+ Servers", img: "/site/media/zycord/safety-card-1.png", desc: "Real-time raid protection, regex keyword filters, anti-phishing links, and automated audit logs." },
		{ name: "WatchParty Cinema", cat: "Activities & Watch Together", installs: "68,400+ Servers", img: "/site/media/zycord/sec5-activities.webp", desc: "Synchronized YouTube, Twitch, and media playback right inside any Zycord voice channel." },
		{ name: "Tempo Hi-Fi Music", cat: "Music & Soundboard", installs: "91,200+ Servers", img: "/site/media/zycord/sec2-stream.webp", desc: "Lossless 384kbps Opus audio streaming, playlists, and live DJ queue management." },
		{ name: "QuestMaster RPG", cat: "Games & Trivia", installs: "54,100+ Servers", img: "/site/media/zycord/quests-card-1.webp", desc: "Turn-based multiplayer dungeon raids, leaderboards, and custom server loot drops." },
		{ name: "GitPulse Notifier", cat: "Developer Tools", installs: "31,900+ Servers", img: "/site/media/zycord/dev-card-apps.webp", desc: "Instant rich webhook embeds for GitHub commits, PR reviews, CI/CD builds, and releases." },
		{ name: "LevelUp XP & Roles", cat: "Community Engagement", installs: "77,500+ Servers", img: "/site/media/zycord/sec6-platforms.webp", desc: "Customizable rank cards, voice activity XP rewards, and automated role promotions." }
	];
	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/zycord/prop-rupee-gem.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "136px", top: "-44px", right: "6%" }} />
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
								<img src="/site/media/zycord/dev-card-apps.webp" alt="Zycord App Directory" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
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
		{ title: "1 Month Zycord Nitro", price: "$9.99", badge: "Popular Gift", img: "/site/media/zycord/nitro-perk-1.webp", desc: "Unlock 1080p 60fps HD streaming, 500MB uploads, custom emojis everywhere, and 2 free Server Boosts for 30 days." },
		{ title: "1 Year Zycord Nitro", price: "$99.99", badge: "Best Value · 2 Months Free", img: "/site/media/zycord/nitro-perk-2.webp", desc: "A full year of complete profile customization, animated avatars, custom banners, profile effects, and 2 Server Boosts." },
		{ title: "Shop Collectibles Bundle", price: "$14.99", badge: "Exclusive Cosmetics", img: "/site/media/zycord/nitro-perk-3.webp", desc: "Gift instant access to 1,099+ avatar decorations, animated nameplates, and full-card profile effects." }
	];
	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/zycord/nitro-wumpus-jetpack.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "148px", top: "-52px", right: "5%" }} />
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
								<img src="/site/media/zycord/nitro-banner-media.webp" alt="Zycord Nitro Gift Cards" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
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
					<img src="/site/media/zycord/hero-wumpus.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "136px", top: "-46px", right: "6%" }} />
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
								<img src="/site/media/zycord/careers-hero.webp" alt="About Zycord" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="zy-section" style={{ paddingTop: "12px" }}>
				<div className="zy-container">
					<div className="zy-grid-3">
						<article className="zy-card">
							<img src="/site/media/zycord/careers-office-1.webp" alt="Our Story" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>BUILT FOR REAL FRIENDSHIPS</h3>
							<p className="zy-body">
								Unlike endless social feeds designed for passive scrolling, Zycord is designed for active conversation — jumping into voice channels, streaming games, and building lasting memories.
							</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/zycord/careers-office-2.webp" alt="Engineering Excellence" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>SUB-20MS GLOBAL INFRASTRUCTURE</h3>
							<p className="zy-body">
								Powered by ultra-low-latency WebRTC voice, 1080p 60fps screen sharing, and end-to-end encrypted direct messaging with Passkey security.
							</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/zycord/careers-office-3.webp" alt="Privacy First" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
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
					<img src="/site/media/zycord/careers-crown.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "110px", top: "-40px", right: "6%" }} />
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
					<img src="/site/media/zycord/nav-blog-cube.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "128px", top: "-42px", right: "6%" }} />
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
								<img src="/site/media/zycord/careers-office-4.webp" alt="Zycord Newsroom" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
							</div>
						</div>
					</div>
				</div>
			</section>
			<MarketingBlogPage />
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
					<img src="/site/media/zycord/download-trophy.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "118px", top: "-40px", right: "6%" }} />
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
								<img src="/site/media/zycord/sec2-stream.webp" alt="Zycord for Creators" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="zy-section" style={{ paddingTop: "12px" }}>
				<div className="zy-container">
					<div className="zy-grid-3">
						<article className="zy-card">
							<img src="/site/media/zycord/sec3-hop-in.webp" alt="Subscriber Role Sync" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>TWITCH &amp; YOUTUBE ROLE SYNC</h3>
							<p className="zy-body">
								Automatically grant exclusive VIP channels, custom role icons, and soundboard perks to your Twitch subscribers and YouTube channel members.
							</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/zycord/sec5-activities.webp" alt="Stage Channels" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>STAGE CHANNELS &amp; AMAs</h3>
							<p className="zy-body">
								Run moderated town halls, live podcast recordings, and interactive Q&amp;A sessions with raised-hand speaker queues for thousands of listeners.
							</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/zycord/sec1-chat-fun.webp" alt="Server Shop & Perks" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
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
					<img src="/site/media/zycord/sec5-card-characters.png" alt="" aria-hidden="true" className="zy-float-prop" style={{ width: "156px", top: "-52px", right: "6%" }} />
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
								<img src="/site/media/zycord/sec6-platforms.webp" alt="Zycord Community" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="zy-section" style={{ paddingTop: "12px" }}>
				<div className="zy-container">
					<div className="zy-grid-3">
						<article className="zy-card">
							<img src="/site/media/zycord/safety-card-2.webp" alt="Onboarding" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>GUIDED SERVER ONBOARDING</h3>
							<p className="zy-body">
								Welcome new members with interactive role-picker questions, custom rules screening, and curated default channels.
							</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/zycord/sec4-chill.webp" alt="Forum Channels" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
							<h3 className="zy-heading-sm" style={{ fontSize: "22px", marginTop: "8px" }}>FORUM &amp; THREAD CHANNELS</h3>
							<p className="zy-body">
								Keep busy discussions organized with searchable topic tags, pinned guidelines, and dedicated threads that never clutter main chat.
							</p>
						</article>
						<article className="zy-card">
							<img src="/site/media/zycord/safety-card-4.png" alt="Community Insights" style={{ width: "100%", height: "190px", objectFit: "cover", borderRadius: "16px" }} />
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
		{ name: "Wumpus Plushie Collector Edition", price: "$34.00", tag: "Limited Drop", img: "/site/media/zycord/hero-wumpus.webp", desc: "Ultra-soft 12-inch embroidered Wumpus plush with magnetic leaf accessory." },
		{ name: "Blurple Heavyweight Hoodie", price: "$68.00", tag: "Apparel", img: "/site/media/zycord/nitro-wumpus-wheel.webp", desc: "450gsm brushed cotton fleece in signature Zycord Blurple with puff-print wordmark." },
		{ name: "3D Keycap & Desk Mat Bundle", price: "$49.00", tag: "Hardware Gear", img: "/site/media/zycord/dev-clyde-3d.webp", desc: "Artisan resin Clyde keycap paired with an XXL stitched-edge midnight desk pad." }
	];
	return (
		<div>
			<section className="zy-section" style={{ paddingTop: "48px", position: "relative", overflow: "hidden" }}>
				<div className="zy-container" style={{ position: "relative" }}>
					<img src="/site/media/zycord/nitro-star.webp" alt="" aria-hidden="true" className="zy-float-prop tilt" style={{ width: "110px", top: "-36px", right: "6%" }} />
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
								<img src="/site/media/zycord/nitro-banner-media.webp" alt="Zycord Merch" style={{ width: "100%", height: "auto", borderRadius: "20px" }} />
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
					<img src="/site/media/zycord/download-clyde-point.webp" alt="" aria-hidden="true" className="zy-float-prop" style={{ width: "124px", top: "-42px", right: "6%" }} />
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

