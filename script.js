/* ═══════════════════════════════════════════════════════
   MD ZAID — Portfolio JS
   Cinematic interactions, animations, scroll magic
═══════════════════════════════════════════════════════ */

"use strict";

// ─── LOADER ──────────────────────────────────────────────
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add("done");
    // trigger hero reveals after load
    document.querySelectorAll(".hero .reveal-up, .hero .reveal-fade")
      .forEach(el => el.classList.add("visible"));
    // Start counting stats
    animateCounters();
  }, 1400);
});

// ─── CUSTOM CURSOR ────────────────────────────────────────
const dot  = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

if (window.matchMedia("(hover: hover)").matches) {
  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top  = mouseY + "px";
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + "px";
    ring.style.top  = ringY + "px";
    requestAnimationFrame(animateRing);
  })();

  // hover states
  document.querySelectorAll("a, button, .chip, .project-card, .tilt-card")
    .forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("hovered"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hovered"));
    });
}

// ─── NAVBAR ───────────────────────────────────────────────
const nav = document.getElementById("nav");
const hamburger = document.getElementById("navHamburger");
const mobileMenu = document.getElementById("mobileMenu");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
}, { passive: true });

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
  document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
});

// Close mobile menu on link click
document.querySelectorAll(".mobile-link").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
  });
});

// ─── SCROLL REVEAL ────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal-up, .reveal-fade").forEach(el => {
  // Skip hero elements (handled by loader)
  if (!el.closest(".hero")) {
    revealObserver.observe(el);
  }
});

// ─── COUNTER ANIMATION ────────────────────────────────────
function animateCounters() {
  document.querySelectorAll(".stat-num[data-target]").forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    setTimeout(() => requestAnimationFrame(step), 200);
  });
}

// ─── TILT CARDS ───────────────────────────────────────────
document.querySelectorAll(".tilt-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -5;
    const rotY = ((x - cx) / cx) * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.01,1.01,1.01)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    setTimeout(() => { card.style.transition = ""; }, 500);
  });
});

// ─── MAGNETIC BUTTONS ─────────────────────────────────────
if (window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".magnetic").forEach(el => {
    const strength = 0.35;

    el.addEventListener("mousemove", e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
      el.style.transform = "translate(0, 0)";
      setTimeout(() => { el.style.transition = ""; }, 500);
    });
  });
}

// ─── HERO PARALLAX ────────────────────────────────────────
const heroPhoto = document.getElementById("heroPhoto");
const orbs = document.querySelectorAll(".orb");

if (window.matchMedia("(hover: hover)").matches && heroPhoto) {
  document.addEventListener("mousemove", e => {
    const nx = (e.clientX / window.innerWidth  - 0.5);
    const ny = (e.clientY / window.innerHeight - 0.5);

    heroPhoto.style.transform = `translate(${nx * 12}px, ${ny * 8}px) scale(1.02)`;
    heroPhoto.style.transition = "transform 0.8s cubic-bezier(0.16,1,0.3,1)";

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 0.6;
      orb.style.transform = `translate(${nx * factor * 20}px, ${ny * factor * 15}px)`;
    });
  });
}

// ─── SMOOTH SCROLL ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

// ─── SKILL CHIPS STAGGER ──────────────────────────────────
const chipObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const chips = entry.target.querySelectorAll(".chip");
      chips.forEach((chip, i) => {
        chip.style.opacity = "0";
        chip.style.transform = "translateY(10px)";
        setTimeout(() => {
          chip.style.transition = "opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)";
          chip.style.opacity = "1";
          chip.style.transform = "translateY(0)";
        }, i * 60);
      });
      chipObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".skill-group").forEach(g => chipObserver.observe(g));

// ─── ACTIVE NAV SECTION ───────────────────────────────────
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute("href") === `#${id}`
            ? "var(--text-1)"
            : "";
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

// ─── CONTACT SECTION GLOW TRACK ───────────────────────────
const contactCard = document.querySelector(".contact-inner");
if (contactCard && window.matchMedia("(hover: hover)").matches) {
  contactCard.addEventListener("mousemove", e => {
    const rect = contactCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    contactCard.style.setProperty("--gx", `${x}px`);
    contactCard.style.setProperty("--gy", `${y}px`);
  });
}

// ─── PROJECT CARD GLOW FOLLOW ─────────────────────────────
document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
    card.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(59,130,246,0.04), transparent 60%), var(--surface)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.background = "";
  });
});

// ─── TIMELINE CARD REVEAL STAGGER ─────────────────────────
const timelineItems = document.querySelectorAll(".timeline-item");
const tlObserver = new IntersectionObserver(
  entries => {
    entries.forEach((entry, _) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".reveal-up, .reveal-fade")
          .forEach(el => el.classList.add("visible"));
        tlObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
timelineItems.forEach(item => tlObserver.observe(item));

// ─── SCROLL PROGRESS INDICATOR ────────────────────────────
const progressBar = document.createElement("div");
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  z-index: 9990;
  width: 0%;
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.prepend(progressBar);

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const pct = Math.min((scrolled / maxScroll) * 100, 100);
  progressBar.style.width = pct + "%";
}, { passive: true });
