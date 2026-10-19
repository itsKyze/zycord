import { h, mountJSX } from "./runtime.jsx";

const plusIcon = '<path fill="currentColor" d="M13 5a1 1 0 1 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6V5Z"/>';
const externalIcon = '<path fill="currentColor" d="M15 2a1 1 0 0 0 0 2h3.59l-5.3 5.3a1 1 0 0 0 1.42 1.4L20 5.42V9a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1h-6Z"/><path fill="currentColor" d="M5 5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-6a1 1 0 1 1 2 0v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h6a1 1 0 1 1 0 2H5Z"/>';
const menuIcon = '<path fill="currentColor" d="M3 5a1 1 0 0 0 0 2h18a1 1 0 1 0 0-2H3ZM2 12a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1ZM2 18a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Z"/>';

const Icon = ({ paths, size = 16 }) => (
	<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: paths }}></svg>
);

// Mirrors discord.com/developers header: logo on the left, Create / Docs / divider / account on the right.
export function DevelopersPortalTopbar() {
	return (
		<header className="dp-header">
			<div className="dp-header-content">
				<div className="dp-header-left">
					<button className="dp-mobile-menu" type="button" aria-label="Open navigation" data-dp-menu>
						<Icon paths={menuIcon} size={24} />
					</button>
					<a className="dp-logo" href="/developers" aria-label="Zycord Developers">
						<img src="/branding/zycord_icon_white.svg" alt="" width="24" height="24" />
						<span>Zycord Developers</span>
					</a>
				</div>
				<div className="dp-header-right">
					<div className="dp-create">
						<button className="dp-button dp-button-secondary dp-button-sm" type="button" aria-haspopup="menu" aria-expanded="false" data-dp-create>
							<Icon paths={plusIcon} />
							<span>Create</span>
						</button>
						<div className="dp-popover" role="menu" hidden data-dp-create-menu>
							<button type="button" role="menuitem" data-dp-create-item="application">Application</button>
							<button type="button" role="menuitem" data-dp-create-item="widget">Profile Widget</button>
						</div>
					</div>
					<a className="dp-header-link" href="/developers/docs">
						<span>Docs</span>
						<Icon paths={externalIcon} size={18} />
					</a>
					<div className="dp-header-divider" role="separator"></div>
					<a className="dp-header-user" href="/channels/@me" title="Open Zycord" data-dp-user>
						<span className="dp-header-avatar" data-dp-user-avatar></span>
						<span className="dp-header-username" data-dp-user-name>Open App</span>
					</a>
				</div>
			</div>
		</header>
	);
}

function initDevelopersPortalShell() {
	const topMount = document.getElementById("zy-dev-topbar-mount");
	if (!topMount) return;
	mountJSX(topMount, <DevelopersPortalTopbar />);

	const header = topMount.querySelector(".dp-header-content");
	const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 0);
	window.addEventListener("scroll", onScroll, { passive: true });
	onScroll();

	const createButton = topMount.querySelector("[data-dp-create]");
	const createMenu = topMount.querySelector("[data-dp-create-menu]");
	const setMenu = (open) => {
		createMenu.hidden = !open;
		createButton.setAttribute("aria-expanded", String(open));
	};
	createButton.addEventListener("click", (event) => {
		event.stopPropagation();
		setMenu(createMenu.hidden);
	});
	createMenu.addEventListener("click", (event) => {
		const item = event.target.closest("[data-dp-create-item]");
		if (!item) return;
		setMenu(false);
		document.dispatchEvent(new CustomEvent("dp:create", { detail: item.dataset.dpCreateItem }));
	});
	document.addEventListener("click", (event) => {
		if (!createMenu.hidden && !createMenu.contains(event.target)) setMenu(false);
	});
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && !createMenu.hidden) {
			setMenu(false);
			createButton.focus();
		}
	});

	topMount.querySelector("[data-dp-menu]").addEventListener("click", () => document.body.classList.toggle("dp-nav-open"));
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initDevelopersPortalShell);
} else {
	initDevelopersPortalShell();
}
