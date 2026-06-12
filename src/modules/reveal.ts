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
}
