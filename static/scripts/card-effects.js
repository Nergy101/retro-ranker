(() => {
  const selector = [
    ".device-search-card",
    ".small-card",
    ".device-card-row",
  ].join(",");

  function attachRipple(el) {
    if (el.__rippleBound) return;
    el.__rippleBound = true;

    el.addEventListener("pointerdown", (e) => {
      try {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const maxX = Math.max(x, rect.width - x);
        const maxY = Math.max(y, rect.height - y);
        const radius = Math.sqrt(maxX * maxX + maxY * maxY) * 2;

        el.style.setProperty("--ripple-x", `${x}px`);
        el.style.setProperty("--ripple-y", `${y}px`);
        el.style.setProperty("--ripple-size", `${radius}px`);

        el.classList.remove("ripple-animate");
        // Force reflow to restart animation
        el.offsetHeight;
        el.classList.add("ripple-animate");

        // Clean up after animation
        setTimeout(() => el.classList.remove("ripple-animate"), 700);
      } catch (_) {
        /* no-op */
      }
    }, { passive: true });
  }

  function init() {
    document.querySelectorAll(selector).forEach(attachRipple);

    const observer = new MutationObserver(() => {
      document.querySelectorAll(selector).forEach(attachRipple);
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
