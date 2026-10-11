import { h, mountJSX, replaceJSX } from "./runtime.jsx";
import { ZycordNavbar, NAVIGATION_ITEMS, hasActiveSession } from "./Navbar.jsx";
import { ZycordFooter, FOOTER_COLUMNS } from "./Footer.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import {
	DownloadPage,
	QuestsPage,
	BlogPage,
	AppDirectoryPage,
	GiftCardsPage,
	CompanyPage,
	BrandingPage,
	NewsroomPage,
	CreatorsPage,
	CommunityPage,
	MerchPage,
	FeedbackPage
} from "./pages/SubPages.jsx";
import { DevelopersHubPage } from "./pages/DevelopersHubPage.jsx";

const PAGE_COMPONENTS = {
	home: HomePage,
	download: DownloadPage,
	quests: QuestsPage,
	blog: BlogPage,
	developers: DevelopersHubPage,
	"application-directory": AppDirectoryPage,
	"gift-cards": GiftCardsPage,
	company: CompanyPage,
	branding: BrandingPage,
	newsroom: NewsroomPage,
	creators: CreatorsPage,
	community: CommunityPage,
	merch: MerchPage,
	feedback: FeedbackPage
};

function bindScrollNavbar() {
	const navbar = document.getElementById("zy-navbar");
	if (!navbar) return;
	const onScroll = () => {
		navbar.classList.toggle("is-scrolled", window.scrollY > 12);
	};
	window.addEventListener("scroll", onScroll, { passive: true });
	onScroll();
}

function upgradeAuthLinks() {
	const authed = hasActiveSession();
	const appBtns = document.querySelectorAll("[data-zy-open-app]");
	for (let i = 0; i < appBtns.length; i++) {
		const btn = appBtns[i];
		btn.setAttribute("href", "/app");
		if (authed && btn.hasAttribute("data-zy-open-label-authed")) {
			const span = btn.querySelector("span") || btn;
			span.textContent = btn.getAttribute("data-zy-open-label-authed");
		}
	}
}

function hydrateLiveStatus() {
	fetch("/status/summary.json", { credentials: "same-origin" })
		.then((r) => {
			if (!r.ok) throw new Error("status unavailable");
			return r.json();
		})
		.then((data) => {
			const status = (data && data.overallStatus) || "operational";
			let label = "All Systems Operational";
			let color = "#57f287";
			if (status === "degraded") {
				label = "Partial Degradation";
				color = "#fda220";
			} else if (status === "outage") {
				label = "Service Disruption";
				color = "#de2761";
			}
			const labels = document.querySelectorAll("[data-zy-status-label]");
			for (let i = 0; i < labels.length; i++) {
				labels[i].textContent = label;
			}
			const dots = document.querySelectorAll("[data-zy-status-dot]");
			for (let j = 0; j < dots.length; j++) {
				dots[j].style.background = color;
				dots[j].style.boxShadow = "0 0 10px " + color;
			}
		})
		.catch(() => {});
}

function bindAccordions() {
	const triggers = document.querySelectorAll("[data-zy-accordion-trigger]");
	for (let i = 0; i < triggers.length; i++) {
		triggers[i].addEventListener("click", function () {
			const item = this.closest(".zy-accordion-item");
			if (!item) return;
			const isOpen = item.classList.contains("is-open");
			item.classList.toggle("is-open", !isOpen);
			this.setAttribute("aria-expanded", !isOpen ? "true" : "false");
		});
	}
}

function bindTabGroups() {
	const groups = document.querySelectorAll("[data-zy-tabs]");
	for (let i = 0; i < groups.length; i++) {
		((group) => {
			const buttons = group.querySelectorAll("[data-zy-tab]");
			const targetContainerId = group.getAttribute("data-zy-tabs");
			const container = targetContainerId
				? document.getElementById(targetContainerId)
				: group.parentElement;
			if (!container) return;

			for (let b = 0; b < buttons.length; b++) {
				buttons[b].addEventListener("click", function () {
					const tabName = this.getAttribute("data-zy-tab");
					for (let k = 0; k < buttons.length; k++) {
						buttons[k].classList.toggle("is-active", buttons[k] === this);
					}
					const panels = container.querySelectorAll("[data-zy-panel]");
					for (let p = 0; p < panels.length; p++) {
						const match = panels[p].getAttribute("data-zy-panel") === tabName;
						panels[p].style.display = match ? "" : "none";
					}
				});
			}
		})(groups[i]);
	}
}

function bindReactions() {
	const pills = document.querySelectorAll("[data-zy-reaction]");
	for (let i = 0; i < pills.length; i++) {
		pills[i].addEventListener("click", function () {
			const countNode = this.querySelector("[data-zy-reaction-count]");
			if (!countNode) return;
			const current = parseInt(countNode.textContent || "0", 10) || 0;
			const inactive = this.classList.contains("is-inactive");
			if (inactive) {
				this.classList.remove("is-inactive");
				countNode.textContent = String(current + 1);
			} else {
				this.classList.add("is-inactive");
				countNode.textContent = String(Math.max(1, current - 1));
			}
		});
	}
}

function initSiteJSX() {
	const navMount = document.querySelector("[data-zy-navbar]");
	if (navMount) {
		replaceJSX(navMount, <ZycordNavbar />);
		bindScrollNavbar();
	}

	const pageMount = document.querySelector("[data-zy-jsx-page]");
	if (pageMount) {
		const pageName = pageMount.getAttribute("data-zy-jsx-page");
		const PageComp = PAGE_COMPONENTS[pageName];
		if (PageComp) {
			mountJSX(pageMount, <PageComp />);
		}
	}

	const footerMount = document.querySelector("[data-zy-footer]");
	if (footerMount) {
		replaceJSX(footerMount, <ZycordFooter />);
	}

	upgradeAuthLinks();
	hydrateLiveStatus();
	bindAccordions();
	bindTabGroups();
	bindReactions();
}

window.ZycordSite = {
	NAVIGATION_ITEMS,
	FOOTER_COLUMNS,
	hasActiveSession,
	PAGE_COMPONENTS
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initSiteJSX);
} else {
	initSiteJSX();
}
