/**
 * Carousels (villas, community, ...): CSS scroll-snap does the scrolling
 * (touch/wheel/keyboard work without JS — each track is focusable and
 * natively scrollable). JS only adds prev/next buttons with disabled-at-ends
 * state and hides the controls when nothing overflows. Supports any number
 * of [data-carousel-controls] blocks; each is wired to the track named by
 * its buttons' aria-controls.
 *
 * [data-carousel-fade] on the controls block enables fade mode: the track
 * fades out, jumps instantly to the next page of cards, then fades back in.
 */
export function initCarousel(): void {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  for (const controls of document.querySelectorAll<HTMLElement>("[data-carousel-controls]")) {
    const prev = controls.querySelector<HTMLButtonElement>("[data-carousel-prev]");
    const next = controls.querySelector<HTMLButtonElement>("[data-carousel-next]");
    const trackId = prev?.getAttribute("aria-controls") ?? next?.getAttribute("aria-controls");
    const track = trackId ? document.getElementById(trackId) : null;
    if (!track || !prev || !next) continue;

    const isFade = controls.hasAttribute("data-carousel-fade");
    let fading = false;

    const cardStep = (): number => {
      const card = track.querySelector<HTMLElement>("li");
      if (!card) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    };

    // How many cards fit in the visible track area (used for page-at-a-time fade)
    const perPage = (): number => {
      const s = cardStep();
      return s > 0 ? Math.max(1, Math.floor(track.clientWidth / s)) : 1;
    };

    const update = (): void => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      controls.classList.toggle("hidden", maxScroll <= 1);
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= maxScroll - 1;
    };

    const navigate = (direction: -1 | 1): void => {
      if (isFade && fading) return;

      const distance = direction * cardStep() * (isFade ? perPage() : 1);

      if (!isFade || reducedMotion.matches) {
        track.scrollBy({ left: distance, behavior: reducedMotion.matches ? "auto" : "smooth" });
        return;
      }

      fading = true;
      track.style.transition = "opacity 220ms ease";
      track.style.opacity = "0";

      setTimeout(() => {
        track.scrollBy({ left: distance, behavior: "instant" });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            track.style.opacity = "1";
            setTimeout(() => {
              fading = false;
            }, 220);
          });
        });
      }, 220);
    };

    prev.addEventListener("click", () => navigate(-1));
    next.addEventListener("click", () => navigate(1));
    track.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(track);
    update();
  }
}
