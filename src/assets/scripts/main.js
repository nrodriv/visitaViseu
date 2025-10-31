/**
 * main.js
 *
 * - VanillaTilt on cards
 * - Header nav active state
 */

import VanillaTilt from "vanilla-tilt";

console.log("Hello, UOC!");

// Tilt effect on cards
VanillaTilt.init(document.querySelectorAll(".uoc-home__card[data-tilt]"), {
  max: 15,
  speed: 400,
  glare: true,
  "max-glare": 0.3,
  scale: 1.05,
});

// Header nav elements
const navItems = document.querySelectorAll(".uoc-header__item");
const navLinks = document.querySelectorAll(".uoc-header__link");

/**
 * Returns the current location to match against nav links.
 */
function getCurrentTarget() {
  const hash = window.location.hash;
  if (hash && hash !== "#") return hash;

  const file = window.location.pathname.split("/").pop();
  return "/" + file;
}

/**
 * Each nav link can define one or more targets.
 */
function getLinkTargets(link) {
  const many = link.getAttribute("data-targets");
  if (many) {
    return many.split(" ").filter(Boolean);
  }

  const single = link.getAttribute("data-target");
  return single ? [single] : [];
}

/**
 * Updates header nav state
 */
function syncActiveNav() {
  const current = getCurrentTarget();

  // reset
  navItems.forEach((item) => {
    item.classList.remove("uoc-header__item--active");
  });
  navLinks.forEach((link) => {
    link.removeAttribute("aria-current");
  });

  // match
  const activeLink = Array.from(navLinks).find((link) => {
    const targets = getLinkTargets(link);
    return targets.includes(current);
  });

  // apply
  if (activeLink) {
    activeLink.setAttribute("aria-current", "page");

    const parentItem = activeLink.closest(".uoc-header__item");
    if (parentItem) {
      parentItem.classList.add("uoc-header__item--active");
    }
  }
}

// init on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", syncActiveNav);
} else {
  syncActiveNav();
}

// update on hash change
window.addEventListener("hashchange", syncActiveNav);

// update after clicking a header link
document.addEventListener("click", (event) => {
  const link = event.target.closest(".uoc-header__link");
  if (!link) return;

  requestAnimationFrame(syncActiveNav);
});
