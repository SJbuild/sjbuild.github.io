/**
 * Villas carousel: CSS scroll-snap does the scrolling (touch/wheel/keyboard
 * work without JS — the track is focusable and natively scrollable). JS only
 * adds prev/next buttons with disabled-at-ends state and hides the controls
 * when nothing overflows.
 */
export function initCarousel(): void {
  const track = document.querySelector<HTMLElement>("[data-carousel-track]");
  const controls = document.querySelector<HTMLElement>("[data-carousel-controls]");
  const prev = document.querySelector<HTMLButtonElement>("[data-carousel-prev]");
  const next = document.querySelector<HTMLButtonElement>("[data-carousel-next]");
  if (!track || !controls || !prev || !next) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
  new ResizeObserver(update).observe(track);
  update();
}
