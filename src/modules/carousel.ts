/**
 * Carousels (villas, community, ...): CSS scroll-snap does the scrolling
 * (touch/wheel/keyboard work without JS — each track is focusable and
 * natively scrollable). JS only adds prev/next buttons with disabled-at-ends
 * state and hides the controls when nothing overflows. Supports any number
 * of [data-carousel-controls] blocks; each is wired to the track named by
 * its buttons' aria-controls.
 *
 * [data-carousel-fade] on the controls block enables sliding-window mode:
 * the track clips to a fixed-size window of cards (no free scrolling) and
 * steps by one card at a time. Navigating — via the arrow buttons, a
 * horizontal swipe/drag, or a trackpad horizontal wheel gesture — slides the
 * track to the next position while the entering card fades in (starting
 * just before the slide) and the leaving card fades out only once it has
 * fully exited the window. Cards that stay in the window the whole time are
 * left untouched.
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

    // Top-level cards currently fully inside the visible track area
    const visibleItems = (): HTMLElement[] => {
      const trackRect = track.getBoundingClientRect();
      return Array.from(track.children).filter((li) => {
        const r = li.getBoundingClientRect();
        return r.left >= trackRect.left - 1 && r.right <= trackRect.right + 1;
      }) as HTMLElement[];
    };

    const update = (): void => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      controls.classList.toggle("hidden", maxScroll <= 1);
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= maxScroll - 1;

      // Guard against a card left mid-fade (e.g. by a viewport resize) being
      // stranded invisible once it's genuinely back in the visible window.
      if (isFade && !fading) {
        for (const li of visibleItems()) {
          li.style.transition = "";
          li.style.opacity = "";
        }
      }
    };

    // Animate scrollLeft over `duration`ms with an ease-out curve, resolving when done.
    const slideTo = (target: number, duration: number): Promise<void> =>
      new Promise((resolve) => {
        const start = track.scrollLeft;
        const delta = target - start;
        const startTime = performance.now();
        const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;
        const step = (now: number): void => {
          const t = Math.min(1, (now - startTime) / duration);
          track.scrollLeft = start + delta * easeOutCubic(t);
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });

    const navigate = (direction: -1 | 1): void => {
      if (isFade && fading) return;

      const maxScroll = track.scrollWidth - track.clientWidth;
      if (isFade && ((direction === -1 && track.scrollLeft <= 1) || (direction === 1 && track.scrollLeft >= maxScroll - 1))) {
        return;
      }

      const distance = direction * cardStep();

      if (!isFade || reducedMotion.matches) {
        track.scrollBy({ left: distance, behavior: reducedMotion.matches ? "auto" : "smooth" });
        return;
      }

      const before = visibleItems();
      const firstVisible = before[0];
      const lastVisible = before[before.length - 1];
      if (!firstVisible || !lastVisible) return;

      fading = true;
      const outgoing = direction === 1 ? firstVisible : lastVisible;
      const incoming = (direction === 1 ? lastVisible.nextElementSibling : firstVisible.previousElementSibling) as HTMLElement | null;

      // Fade-in starts right away, ahead of the slide, so the card is
      // already brightening as it slides into the window.
      if (incoming) {
        incoming.style.transition = "none";
        incoming.style.opacity = "0";
        requestAnimationFrame(() => {
          incoming.style.transition = "opacity 360ms ease";
          incoming.style.opacity = "1";
        });
      }

      void slideTo(track.scrollLeft + distance, 360).then(() => {
        // Fade-out only starts once the card has fully left the window —
        // it's already clipped by then, so this is a clean reset, not a
        // visible flicker.
        if (outgoing) {
          outgoing.style.transition = "opacity 160ms ease";
          outgoing.style.opacity = "0";
        }
        setTimeout(
          () => {
            // Leave the outgoing card's opacity at 0 — it's clipped out of
            // view now, and resetting it to "" here would snap it back to
            // fully opaque before it has a chance to become "incoming"
            // again, causing a visible flash. It's properly faded back in
            // the next time it enters the window.
            if (outgoing) outgoing.style.transition = "";
            if (incoming) {
              incoming.style.transition = "";
              incoming.style.opacity = "";
            }
            fading = false;
          },
          outgoing ? 160 : 0,
        );
      });
    };

    prev.addEventListener("click", () => navigate(-1));
    next.addEventListener("click", () => navigate(1));
    track.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(track);
    update();

    if (isFade) {
      // Trackpad/mouse-wheel horizontal swipe
      let wheelLocked = false;
      track.addEventListener(
        "wheel",
        (e) => {
          if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
          e.preventDefault();
          if (wheelLocked || fading) return;
          wheelLocked = true;
          navigate(e.deltaX > 0 ? 1 : -1);
          setTimeout(() => {
            wheelLocked = false;
          }, 350);
        },
        { passive: false },
      );

      // Pointer drag swipe (mouse drag and touch)
      let dragging = false;
      let dragStartX = 0;
      let dragDeltaX = 0;
      const swipeThreshold = 40;

      track.addEventListener("pointerdown", (e) => {
        if (fading) return;
        dragging = true;
        dragStartX = e.clientX;
        dragDeltaX = 0;
      });

      track.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        dragDeltaX = e.clientX - dragStartX;
      });

      const endDrag = (): void => {
        if (!dragging) return;
        dragging = false;
        if (dragDeltaX <= -swipeThreshold) navigate(1);
        else if (dragDeltaX >= swipeThreshold) navigate(-1);
      };

      track.addEventListener("pointerup", endDrag);
      track.addEventListener("pointercancel", endDrag);
    }
  }
}
