window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
};

window.gtag("js", new Date());
window.gtag("config", "G-F7PQGV9T6P");

window.trackEvent = function trackEvent(eventName, details = {}) {
    if (!eventName || typeof window.gtag !== "function") {
        return;
    }

    window.gtag("event", eventName, {
        transport_type: "beacon",
        page_path: window.location.pathname,
        page_title: document.title,
        ...details
    });
};

const normalizeText = (value) => {
    return String(value || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 120);
};

const getUrlDetails = (url) => {
    return {
        link_host: url.host,
        link_path: url.pathname
    };
};

document.addEventListener("click", (event) => {
    const trackedElement = event.target.closest("[data-analytics-event]");

    if (trackedElement instanceof Element) {
        const href = trackedElement.getAttribute("href");
        let urlDetails = {};

        if (href) {
            try {
                urlDetails = getUrlDetails(new URL(href, window.location.href));
            } catch (error) {
                urlDetails = {};
            }
        }

        window.trackEvent(trackedElement.dataset.analyticsEvent, {
            link_text: normalizeText(trackedElement.dataset.analyticsLabel || trackedElement.textContent),
            section: trackedElement.dataset.analyticsSection || "",
            destination: trackedElement.dataset.analyticsDestination || "",
            ...urlDetails
        });
        return;
    }

    const link = event.target.closest("a[href]");

    if (!(link instanceof HTMLAnchorElement) || link.hasAttribute("data-analytics-ignore")) {
        return;
    }

    const href = link.getAttribute("href");

    if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
        return;
    }

    if (href.startsWith("mailto:")) {
        window.trackEvent("email_link_click", {
            link_text: normalizeText(link.textContent),
            email_address: href.replace(/^mailto:/i, "")
        });
        return;
    }

    let url;

    try {
        url = new URL(href, window.location.href);
    } catch (error) {
        return;
    }

    const path = url.pathname.toLowerCase();
    const baseDetails = {
        link_text: normalizeText(link.textContent),
        ...getUrlDetails(url)
    };

    if (path.endsWith(".pdf")) {
        const fileName = path.split("/").pop() || "";

        window.trackEvent(fileName.includes("resume") ? "resume_open" : "file_link_click", {
            ...baseDetails,
            file_name: fileName
        });
        return;
    }

    if (url.origin !== window.location.origin) {
        window.trackEvent("outbound_link_click", baseDetails);
    }
});
