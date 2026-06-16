/**
 * Carousels (villas, community, ...): CSS scroll-snap does the scrolling
 * (touch/wheel/keyboard work without JS — each track is focusable and
 * natively scrollable). JS only adds prev/next buttons with disabled-at-ends
 * state and hides the controls when nothing overflows. Supports any number
 * of [data-carousel-controls] blocks; each is wired to the track named by
 * its buttons' aria-controls.
 */
export function initCarousel(): void {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  for (const controls of document.querySelectorAll<HTMLElement>("[data-carousel-controls]")) {
    const prev = controls.querySelector<HTMLButtonElement>("[data-carousel-prev]");
    const next = controls.querySelector<HTMLButtonElement>("[data-carousel-next]");
    const trackId = prev?.getAttribute("aria-controls") ?? next?.getAttribute("aria-controls");
    const track = trackId ? document.getElementById(trackId) : null;
    if (!track || !prev || !next) continue;

    const step = (): number => {
      const card = track.querySelector<HTMLElement>("li");
      if (!card) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    };

    const update = (): void => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      controls.classList.toggle("hidden", maxScroll <= 1);
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= maxScroll - 1;
    };

    const scrollByCard = (direction: -1 | 1): void => {
      track.scrollBy({
        left: direction * step(),
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    };

    prev.addEventListener("click", () => scrollByCard(-1));
    next.addEventListener("click", () => scrollByCard(1));
    track.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(track);
    update();
  }
}
