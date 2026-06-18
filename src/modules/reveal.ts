/**
 * Reveal-on-scroll. The hidden initial state only exists under `html.js`
 * (no-JS users see everything), and CSS removes all transitions under
 * prefers-reduced-motion — the early return here is belt and braces.
 */
export function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (items.length === 0) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (const el of items) el.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px" },
  );
  for (const el of items) observer.observe(el);

  // A same-page anchor (e.g. the "Get a quote" CTAs targeting #contact-form)
  // jumps straight past the normal scroll-triggered threshold, so the
  // destination would otherwise sit at opacity:0 until the observer catches
  // up — reveal its whole section immediately instead, with no slide/fade
  // transition (it should already look "settled" the instant we land there).
  const revealHashTarget = (): void => {
    const section = document.getElementById(location.hash.slice(1))?.closest("section");
    if (!section) return;
    for (const el of section.querySelectorAll<HTMLElement>("[data-reveal]")) {
      el.style.transition = "none";
      el.classList.add("is-visible");
      observer.unobserve(el);
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        for (const el of section.querySelectorAll<HTMLElement>("[data-reveal]")) {
          el.style.transition = "";
        }
      });
    });
  };
  if (location.hash) revealHashTarget();
  window.addEventListener("hashchange", revealHashTarget);
}
