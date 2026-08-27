/* ═══════════════════════════════════════════
   MARSHYA SALSABILLA — PORTFOLIO SCRIPTS
   ═══════════════════════════════════════════ */

/* ──────────────────────────────────────────
   1. SCROLL PROGRESS BAR
────────────────────────────────────────── */
const progressBar = document.getElementById("progress");

function updateProgress() {
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  const pct = total > 0 ? (scrolled / total) * 100 : 0;
  progressBar.style.width = pct + "%";
}

window.addEventListener("scroll", updateProgress, { passive: true });

/* ──────────────────────────────────────────
   2. SCROLL REVEAL
────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

const typingLines = [...document.querySelectorAll("[data-typing-line]")];
let typingLineIndex = 0;
let typingCharacterIndex = 0;

function runTypingAnimation() {
  if (!typingLines.length) return;

  const activeLine = typingLines[typingLineIndex];
  const lineText = activeLine.dataset.typingLine;
  activeLine.textContent = lineText.slice(0, typingCharacterIndex + 1);
  activeLine.classList.add("is-typing");
  typingCharacterIndex += 1;

  if (typingCharacterIndex === lineText.length) {
    activeLine.classList.remove("is-typing");
    typingLineIndex += 1;
    typingCharacterIndex = 0;

    if (typingLineIndex === typingLines.length) {
      setTimeout(() => {
        typingLines.forEach((line) => {
          line.textContent = "";
        });
        typingLineIndex = 0;
        runTypingAnimation();
      }, 2400);
      return;
    }
  }

  setTimeout(runTypingAnimation, 220);
}

typingLines.forEach((line) => line.classList.remove("is-typing"));
setTimeout(runTypingAnimation, 700);

/* ──────────────────────────────────────────
   3. MOBILE MENU
────────────────────────────────────────── */
const burgerBtn = document.getElementById("burgerBtn");
const mobMenu = document.getElementById("mobMenu");
const mobClose = document.getElementById("mobClose");
const themeToggleButtons = document.querySelectorAll("[data-theme-toggle]");
const themeStorageKey = "portfolio-theme";

function getStoredTheme() {
  return localStorage.getItem(themeStorageKey);
}

function getPreferredTheme() {
  return "dark";
}

function applyTheme(theme) {
  const resolvedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", resolvedTheme);

  themeToggleButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(resolvedTheme === "dark"));
    button.setAttribute(
      "aria-label",
      resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode",
    );
  });
}

applyTheme(getStoredTheme() || getPreferredTheme());

themeToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    localStorage.setItem(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
  });
});

function openMobMenu() {
  mobMenu.classList.add("open");
}
function closeMobMenu() {
  mobMenu.classList.remove("open");
}

burgerBtn.addEventListener("click", openMobMenu);
mobClose.addEventListener("click", closeMobMenu);
mobMenu
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMobMenu));

/* ──────────────────────────────────────────
  4. SWIPEABLE MEDIA CARDS
   (Certificates + Organizations)
   — drag to swipe
   — arrow buttons appear on hover
   — dots update to reflect current slide
────────────────────────────────────────── */
document.querySelectorAll("[data-swipe]").forEach((card) => {
  card.setAttribute("tabindex", "0");
  const viewport = card.querySelector(".media-viewport");
  const track = card.querySelector("[data-track]");
  const slides = card.querySelectorAll(".media-slide");
  const dots = card.querySelectorAll(".dt");
  const countEl = card.querySelector("[data-count]");
  const arrowBtns = card.querySelectorAll(".slide-arrow");
  const total = slides.length;
  let idx = 0;

  if (total === 1) card.classList.add("single-slide");

  /* ── go to a specific slide index ── */
  function goTo(i) {
    idx = Math.max(0, Math.min(total - 1, i));

    // slide the track
    track.classList.remove("no-anim");
    track.style.transform = `translateX(-${idx * 100}%)`;

    // sync dots
    dots.forEach((d, j) => d.classList.toggle("active", j === idx));

    // sync counter
    if (countEl) countEl.textContent = idx + 1 + " / " + total;

    // sync arrow disabled states
    arrowBtns.forEach((btn) => {
      const dir = parseInt(btn.dataset.dir, 10);
      if (dir === -1) btn.disabled = idx === 0;
      if (dir === 1) btn.disabled = idx === total - 1;
    });
  }

  /* ── arrow button clicks ── */
  arrowBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      goTo(idx + parseInt(btn.dataset.dir, 10));
    });
  });

  /* ── drag / swipe (mouse) ── */
  let startX = 0;
  let dragging = false;
  let moved = false;
  let hoverActive = false;

  function syncHoverState() {
    const shouldShow = hoverActive || card.matches(":focus-within");
    card.classList.toggle("show-controls", shouldShow);
  }

  viewport.addEventListener("mouseenter", () => {
    hoverActive = true;
    syncHoverState();
  });

  viewport.addEventListener("mouseleave", () => {
    hoverActive = false;
    syncHoverState();
  });

  card.addEventListener("focusin", syncHoverState);
  card.addEventListener("focusout", () => {
    if (!card.matches(":focus-within")) {
      card.classList.remove("show-controls");
    }
  });

  viewport.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    dragging = true;
    moved = false;
    track.classList.add("no-anim");
    track.style.transition = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    if (Math.abs(e.clientX - startX) > 4) moved = true;
  });

  document.addEventListener("mouseup", (e) => {
    if (!dragging) return;
    dragging = false;
    track.style.transition = "";
    const dx = e.clientX - startX;
    if (moved) {
      if (dx < -40) goTo(idx + 1);
      else if (dx > 40) goTo(idx - 1);
      else goTo(idx);
    }
  });

  /* ── drag / swipe (touch) ── */
  let touchStartX = 0;
  let touchMoved = false;

  viewport.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchMoved = false;
      track.classList.add("no-anim");
    },
    { passive: true },
  );

  viewport.addEventListener(
    "touchmove",
    (e) => {
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - e.touches[0].clientY; // unused but readable
      if (Math.abs(dx) > 4) touchMoved = true;
      // only prevent scroll when moving horizontally
      if (Math.abs(dx) > Math.abs(e.touches[0].clientY - touchStartX)) {
        e.preventDefault();
      }
    },
    { passive: false },
  );

  viewport.addEventListener("touchend", (e) => {
    track.classList.remove("no-anim");
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (touchMoved) {
      if (dx < -40) goTo(idx + 1);
      else if (dx > 40) goTo(idx - 1);
      else goTo(idx);
    }
  });

  viewport.addEventListener("click", (e) => {
    if (e.target.closest(".slide-arrow")) return;
    const rect = viewport.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) {
      goTo(idx - 1);
    } else {
      goTo(idx + 1);
    }
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(idx - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(idx + 1);
    }
  });

  // initialise
  goTo(0);
});

/* ──────────────────────────────────────────
   5. MAGNETIC BUTTON EFFECT
   Elements with class .mag gently follow
   the cursor while hovered.
────────────────────────────────────────── */
document.querySelectorAll(".mag").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
    // preserve any existing hover transform from CSS by only setting translate
    el.style.transform = `translate(${x}px, ${y}px)`;
  });

  el.addEventListener("mouseleave", () => {
    el.style.transform = "";
  });
});

const mainContent = document.querySelector("main");
const journeySection = document.getElementById("organizations");
const projectsSection = document.getElementById("projects");

if (mainContent && journeySection && projectsSection) {
  mainContent.insertBefore(journeySection, projectsSection);
}
