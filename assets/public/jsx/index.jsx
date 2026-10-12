import { h, mountJSX, replaceJSX } from "./runtime.jsx";
import { ZycordNavbar, NAVIGATION_ITEMS, hasActiveSession } from "./Navbar.jsx";
import { ZycordFooter, FOOTER_COLUMNS } from "./Footer.jsx";
import { applySiteLanguage, getSavedLanguage } from "./i18n.js";
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

function bindScrollParallax() {
	const items = document.querySelectorAll("[data-zy-parallax]");
	if (!items.length) return;

	let ticking = false;
	const updateParallax = () => {
		ticking = false;
		const vh = window.innerHeight || 900;
		for (let i = 0; i < items.length; i++) {
			const el = items[i];
			const speed = parseFloat(el.getAttribute("data-zy-parallax") || "0.18");
			const maxRot = parseFloat(el.getAttribute("data-zy-parallax-rotate") || "0");
			const parent = el.parentElement || el;
			const rect = parent.getBoundingClientRect();
			const centerDelta = (vh * 0.5) - (rect.top + rect.height * 0.5);
			const clamped = Math.max(-650, Math.min(650, centerDelta));
			const translateY = clamped * speed;
			const rotateDeg = (clamped / 500) * maxRot;
			el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) rotate(${rotateDeg.toFixed(2)}deg)`;
		}
	};

	const requestTick = () => {
		if (!ticking) {
			ticking = true;
			window.requestAnimationFrame(updateParallax);
		}
	};

	window.addEventListener("scroll", requestTick, { passive: true });
	window.addEventListener("resize", requestTick, { passive: true });
	updateParallax();
}

function bindActionDropdowns() {
	const toggles = document.querySelectorAll("[data-zy-dropdown-toggle]");
	if (!toggles.length) return;

	const closeAll = (except) => {
		const openMenus = document.querySelectorAll(".zy-action-dropdown.is-open");
		for (let i = 0; i < openMenus.length; i++) {
			if (openMenus[i] !== except) {
				openMenus[i].classList.remove("is-open");
			}
		}
	};

	for (let i = 0; i < toggles.length; i++) {
		toggles[i].addEventListener("click", function (e) {
			e.preventDefault();
			e.stopPropagation();
			const wrap = this.closest(".zy-action-dropdown");
			if (!wrap) return;
			const willOpen = !wrap.classList.contains("is-open");
			closeAll(wrap);
			wrap.classList.toggle("is-open", willOpen);
		});
	}

	document.addEventListener("click", (e) => {
		if (!e.target || !e.target.closest || !e.target.closest(".zy-action-dropdown")) {
			closeAll(null);
		}
	});
}

function bindCarousels() {
	const wraps = document.querySelectorAll("[data-zy-carousel]");
	for (let i = 0; i < wraps.length; i++) {
		((wrap) => {
			const track = wrap.querySelector("[data-zy-carousel-track]");
			const prevBtn = wrap.querySelector("[data-zy-carousel-prev]");
			const nextBtn = wrap.querySelector("[data-zy-carousel-next]");
			if (!track) return;

			const getStep = () => Math.max(280, Math.round(track.clientWidth * 0.65));

			if (prevBtn) {
				prevBtn.addEventListener("click", (e) => {
					e.preventDefault();
					track.scrollBy({ left: -getStep(), behavior: "smooth" });
				});
			}
			if (nextBtn) {
				nextBtn.addEventListener("click", (e) => {
					e.preventDefault();
					track.scrollBy({ left: getStep(), behavior: "smooth" });
				});
			}
		})(wraps[i]);
	}
}

function bindJobFilters() {
	const items = document.querySelectorAll("[data-zy-job-filter]");
	if (!items.length) return;
	const labelEl = document.querySelector("[data-zy-job-filter-label]");
	const cards = document.querySelectorAll("[data-zy-job-dept]");

	for (let i = 0; i < items.length; i++) {
		items[i].addEventListener("click", function (e) {
			e.preventDefault();
			const dept = this.getAttribute("data-zy-job-filter") || "all";
			const text = this.textContent || "Featured";
			if (labelEl) labelEl.textContent = text;

			for (let k = 0; k < items.length; k++) {
				items[k].classList.toggle("is-active", items[k] === this);
			}
			for (let c = 0; c < cards.length; c++) {
				const cardDept = cards[c].getAttribute("data-zy-job-dept") || "";
				const show = dept === "all" || cardDept.toLowerCase() === dept.toLowerCase();
				cards[c].style.display = show ? "" : "none";
			}

			const dd = this.closest(".zy-action-dropdown");
			if (dd) dd.classList.remove("is-open");
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
	bindScrollParallax();
	bindActionDropdowns();
	bindCarousels();
	bindJobFilters();

	const savedLang = getSavedLanguage();
	applySiteLanguage(savedLang.code, savedLang.label);
}

window.ZycordSite = {
	NAVIGATION_ITEMS,
	FOOTER_COLUMNS,
	hasActiveSession,
	PAGE_COMPONENTS,
	applySiteLanguage,
	getSavedLanguage
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initSiteJSX);
} else {
	initSiteJSX();
}


