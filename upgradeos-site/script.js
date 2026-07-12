// ============================================================
// UpgradeOS — shared site behavior
// ============================================================

(function () {
  "use strict";

  /* ---- Theme (session only — no persistence storage used) ---- */
  const root = document.documentElement;
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.setAttribute("aria-pressed", t === "light");
    });
  }
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(prefersLight ? "light" : "dark");

  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(current);
    });
  });

  /* ---- Nav scroll state ---- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile menu ---- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("mobile-open");
      navToggle.setAttribute("aria-expanded", open);
    });
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 60 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---- Active nav link ---- */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  /* ---- Simple contact/email-capture forms (no backend) ---- */
  document.querySelectorAll("form[data-noop]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const original = btn ? btn.textContent : null;
      if (btn) {
        btn.textContent = "Sent \u2713";
        btn.disabled = true;
      }
      const note = form.querySelector(".form-note");
      if (note) note.textContent = "Thanks — we'll be in touch.";
      setTimeout(() => {
        if (btn && original) {
          btn.textContent = original;
          btn.disabled = false;
        }
        form.reset();
      }, 2600);
    });
  });
})();
