document.documentElement.classList.add("js-enabled");

const revealItems = document.querySelectorAll(".reveal");
const routePanels = Array.from(document.querySelectorAll(".route-panel"));
const mobileRouteMedia = window.matchMedia("(max-width: 980px)");
let mobileRouteObserver = null;

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.2
    });

    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

const clearMobileRouteState = () => {
    routePanels.forEach((panel) => panel.classList.remove("is-mobile-active"));
};

const setupMobileRouteReveal = () => {
    if (mobileRouteObserver) {
        mobileRouteObserver.disconnect();
        mobileRouteObserver = null;
    }

    clearMobileRouteState();

    if (!mobileRouteMedia.matches || routePanels.length === 0 || !("IntersectionObserver" in window)) {
        return;
    }

    mobileRouteObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle("is-mobile-active", entry.isIntersecting);
        });
    }, {
        root: null,
        rootMargin: "-42% 0px -42% 0px",
        threshold: 0
    });

    routePanels.forEach((panel) => mobileRouteObserver.observe(panel));
};

if (typeof mobileRouteMedia.addEventListener === "function") {
    mobileRouteMedia.addEventListener("change", setupMobileRouteReveal);
} else if (typeof mobileRouteMedia.addListener === "function") {
    mobileRouteMedia.addListener(setupMobileRouteReveal);
}

setupMobileRouteReveal();
