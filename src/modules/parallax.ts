export function initParallax(): void {
  const imgs = document.querySelectorAll<HTMLElement>("[data-parallax-bg]");
  if (imgs.length === 0) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let ticking = false;

  const update = (): void => {
    for (const img of imgs) {
      // Skip images that are in normal flow (mobile breakpoints)
      if (getComputedStyle(img).position === "static") {
        img.style.transform = "";
        continue;
      }
      const section = img.closest<HTMLElement>("section");
      if (!section) continue;
      const rect = section.getBoundingClientRect();
      const mid = rect.top + rect.height / 2 - window.innerHeight / 2;
      img.style.transform = `translate3d(0, ${mid * 0.1}px, 0)`;
    }
    ticking = false;
  };

  const schedule = (): void => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });

  update();
}
