/* =========================================================
   ADRITECH.BE — Interactive scripts
   Runs after the HTML has loaded (script is at the bottom of <body>).
   ========================================================= */


/* ---------- 1. MOBILE HAMBURGER MENU ---------- */
/*
    When someone on mobile taps the ☰ button, toggle an "open"
    class on the nav. The CSS already handles the rest.
*/
const navToggle = document.querySelector(".nav-toggle");
const mainNav   = document.querySelector(".main-nav");

navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");

    // Swap the icon between ☰ (closed) and ✕ (open) for visual feedback
    const isOpen = mainNav.classList.contains("open");
    navToggle.textContent = isOpen ? "✕" : "☰";
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

// Close the mobile menu automatically after tapping a link
document.querySelectorAll(".main-nav a").forEach(link => {
    link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        navToggle.textContent = "☰";
    });
});


/* ---------- 2. FADE-IN ON SCROLL ---------- */
/*
    IntersectionObserver watches elements and tells us when they
    enter the viewport. We add a "visible" class; CSS does the fade.
    Very performant — no scroll listener needed.
*/
const fadeTargets = document.querySelectorAll(
    "section h2, .service-card, .about p, .testimonials blockquote, .contact-form"
);

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            fadeObserver.unobserve(entry.target); // animate once, then stop watching
        }
    });
}, {
    threshold: 0.15  // trigger when 15% of the element is in view
});

fadeTargets.forEach(el => {
    el.classList.add("fade-in");
    fadeObserver.observe(el);
});


/* ---------- 3. CONTACT FORM VALIDATION ---------- */
/*
    Before the form submits, check required fields.
    If invalid, show an inline message and prevent submission.
    (Real email submission will be wired up in Step 7.)
*/
const form = document.querySelector(".contact-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault(); // we'll handle submission ourselves

    // Clear any previous errors
    form.querySelectorAll(".field-error").forEach(el => el.remove());
    form.querySelectorAll(".has-error").forEach(el => el.classList.remove("has-error"));

    let valid = true;

    // Name — at least 2 chars
    const name = form.name.value.trim();
    if (name.length < 2) {
        showError(form.name, "Please enter your name.");
        valid = false;
    }

    // Email — basic regex
    const email = form.email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showError(form.email, "Please enter a valid email address.");
        valid = false;
    }

    // Project type
    if (!form["project-type"].value) {
        showError(form["project-type"], "Please select a project type.");
        valid = false;
    }

    // Message — at least 10 chars
    const message = form.message.value.trim();
    if (message.length < 10) {
        showError(form.message, "Please write at least a sentence or two.");
        valid = false;
    }

   if (!valid) return;

    // Submit to Formspree via fetch
    const submitBtn = form.querySelector("button[type='submit']");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending…";
    submitBtn.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: { "Accept": "application/json" }
        });

        if (response.ok) {
            submitBtn.textContent = "Message sent ✓";
            submitBtn.style.background = "#4caf50";
            form.reset();
            showFormSuccess();
        } else {
            throw new Error("Submission failed");
        }
    } catch (err) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        showFormError();
    }
});

function showFormSuccess() {
    removeFormBanners();
    const banner = document.createElement("div");
    banner.className = "form-banner success";
    banner.textContent = "Thanks! I'll get back to you within 24 hours.";
    form.prepend(banner);
    setTimeout(() => banner.remove(), 8000);
}

function showFormError() {
    removeFormBanners();
    const banner = document.createElement("div");
    banner.className = "form-banner error";
    banner.textContent = "Something went wrong. Please try again or email me directly.";
    form.prepend(banner);
}

function removeFormBanners() {
    form.querySelectorAll(".form-banner").forEach(b => b.remove());
}

function showError(field, message) {
    field.classList.add("has-error");
    const err = document.createElement("small");
    err.className = "field-error";
    err.textContent = message;
    field.insertAdjacentElement("afterend", err);
}


/* ---------- 4. LANGUAGE SWITCHER (placeholder) ---------- */
/*
    Clicking FR/NL currently does nothing — they're spans.
    In Phase 2 (Astro migration), these become real links to /fr/ and /nl/.
    For now: a friendly toast if someone clicks the coming-soon ones.
*/
document.querySelectorAll(".lang-switcher .lang-soon").forEach(el => {
    el.addEventListener("click", () => {
        alert("French and Flemish versions coming soon — thanks for your patience!");
    });
});