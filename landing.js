document.documentElement.classList.add("js-enabled");

const revealItems = document.querySelectorAll(".reveal");
const routePanels = Array.from(document.querySelectorAll(".route-panel"));
const mobileRouteMedia = window.matchMedia("(max-width: 980px)");
const contactModal = document.querySelector("#contact-modal");
const contactOpenButton = document.querySelector("[data-contact-open]");
const contactCloseButtons = document.querySelectorAll("[data-contact-close]");
const contactForm = document.querySelector("#contact-form");
const contactFeedback = document.querySelector("[data-contact-feedback]");
let mobileRouteObserver = null;
let lastContactTrigger = null;

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

const setDefaultMobileRouteState = () => {
    if (mobileRouteMedia.matches && routePanels.length > 0) {
        routePanels[0].classList.add("is-mobile-active");
    }
};

const setupMobileRouteReveal = () => {
    if (mobileRouteObserver) {
        mobileRouteObserver.disconnect();
        mobileRouteObserver = null;
    }

    clearMobileRouteState();

    if (!mobileRouteMedia.matches || routePanels.length === 0) {
        return;
    }

    setDefaultMobileRouteState();

    if (!("IntersectionObserver" in window)) {
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

const setContactModalOpen = (isOpen) => {
    if (!contactModal) {
        return;
    }

    contactModal.hidden = !isOpen;
    document.body.classList.toggle("modal-open", isOpen);

    if (contactOpenButton) {
        contactOpenButton.setAttribute("aria-expanded", String(isOpen));
    }

    if (isOpen) {
        window.requestAnimationFrame(() => {
            const firstField = contactModal.querySelector(".contact-form input:not([type='hidden']), .contact-form select, .contact-form textarea, .modal-close");

            if (firstField) {
                firstField.focus();
            }
        });

        return;
    }

    if (lastContactTrigger) {
        lastContactTrigger.focus();
    }
};

if (contactOpenButton) {
    contactOpenButton.addEventListener("click", () => {
        lastContactTrigger = contactOpenButton;
        setContactModalOpen(true);
    });
}

contactCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
        setContactModalOpen(false);
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && contactModal && !contactModal.hidden) {
        setContactModalOpen(false);
    }
});

if (contactForm && "fetch" in window) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector(".contact-submit");

        if (contactFeedback) {
            contactFeedback.textContent = "Sending...";
        }

        if (submitButton) {
            submitButton.disabled = true;
        }

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Contact form submission failed.");
            }

            contactForm.reset();

            if (contactFeedback) {
                contactFeedback.textContent = "Sent. I will reply by email.";
            }
        } catch (error) {
            if (contactFeedback) {
                contactFeedback.textContent = "Could not send yet. Try again in a minute.";
            }
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}
