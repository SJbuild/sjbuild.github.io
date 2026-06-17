/**
 * Carousels (villas, community, ...): CSS scroll-snap does the scrolling
 * (touch/wheel/keyboard work without JS — each track is focusable and
 * natively scrollable). JS only adds prev/next buttons with disabled-at-ends
 * state and hides the controls when nothing overflows. Supports any number
 * of [data-carousel-controls] blocks; each is wired to the track named by
 * its buttons' aria-controls.
 *
 * [data-carousel-fade] on the controls block switches the track to
 * sliding-window mode: a fixed-size window of cards, stepping by one card
 * at a time, positioned with `transform: translateX()` instead of native
 * scrolling (so the track is never clipped — cards outside the window are
 * hidden purely via opacity/inert). A card sliding out of the window stays
 * visible, dimming as it travels past the edge, rather than being cut off
 * by a mask; the entering card brightens as it travels in. Both fades run
 * concurrently with the slide. Cards that stay in the window the whole time
 * are left untouched. Navigating works via the arrow buttons, a horizontal
 * swipe/drag, or a trackpad horizontal wheel gesture.
 */
export function initCarousel(): void {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  for (const controls of document.querySelectorAll<HTMLElement>("[data-carousel-controls]")) {
    const prev = controls.querySelector<HTMLButtonElement>("[data-carousel-prev]");
    const next = controls.querySelector<HTMLButtonElement>("[data-carousel-next]");
    const trackId = prev?.getAttribute("aria-controls") ?? next?.getAttribute("aria-controls");
    const track = trackId ? document.getElementById(trackId) : null;
    if (!track || !prev || !next) continue;

    if (controls.hasAttribute("data-carousel-fade")) {
      initFadeCarousel(controls, prev, next, track, reducedMotion);
    } else {
      initScrollCarousel(prev, next, track);
    }
  }
}

// Native-scroll mode: CSS scroll-snap does the work, JS just tracks
// scrollLeft to toggle disabled state and hide controls when nothing overflows.
function initScrollCarousel(prev: HTMLButtonElement, next: HTMLButtonElement, track: HTMLElement): void {
  const controls = prev.closest<HTMLElement>("[data-carousel-controls]");

  const cardStep = (): number => {
    const card = track.querySelector<HTMLElement>("li");
    if (!card) return track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const update = (): void => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    controls?.classList.toggle("hidden", maxScroll <= 1);
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= maxScroll - 1;
  };

  prev.addEventListener("click", () => track.scrollBy({ left: -cardStep(), behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: cardStep(), behavior: "smooth" }));
  track.addEventListener("scroll", update, { passive: true });
  new ResizeObserver(update).observe(track);
  update();
}

// Sliding-window fade mode: index-based, positioned with a transform so the
// track is never clipped.
function initFadeCarousel(
  controls: HTMLElement,
  prev: HTMLButtonElement,
  next: HTMLButtonElement,
  track: HTMLElement,
  reducedMotion: MediaQueryList,
): void {
  let fading = false;
  let currentIndex = 0;

  const cards = (): HTMLElement[] => Array.from(track.children) as HTMLElement[];

  const cardStep = (): number => {
    const card = track.querySelector<HTMLElement>("li");
    if (!card) return track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const windowSize = (): number => Math.max(1, Math.round(track.clientWidth / cardStep()));
  const maxIndex = (): number => Math.max(0, cards().length - windowSize());

  const setTransform = (index: number, animated: boolean): void => {
    track.style.transition = animated ? "transform 360ms ease-out" : "none";
    track.style.transform = `translateX(${-(index * cardStep())}px)`;
  };

  // Hide every card outside the current window via opacity + inert (not
  // clipping), and restore the ones inside it. Skipped while a fade is in
  // progress so it doesn't stomp on an in-flight transition; resize can
  // change the window size (e.g. mobile 1-card breakpoint), so this also
  // re-syncs on every resize.
  const syncVisibility = (): void => {
    const size = windowSize();
    cards().forEach((card, i) => {
      card.style.transition = "";
      if (i >= currentIndex && i < currentIndex + size) {
        card.style.opacity = "";
        card.inert = false;
      } else {
        card.style.opacity = "0";
        card.inert = true;
      }
    });
  };

  const update = (): void => {
    const max = maxIndex();
    controls.classList.toggle("hidden", max <= 0);
    prev.disabled = currentIndex <= 0;
    next.disabled = currentIndex >= max;
    if (!fading) syncVisibility();
  };

  const navigate = (direction: -1 | 1): void => {
    if (fading) return;

    const max = maxIndex();
    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex > max) return;

    const size = windowSize();
    const outgoingIndex = direction === 1 ? currentIndex : currentIndex + size - 1;
    const incomingIndex = direction === 1 ? newIndex + size - 1 : newIndex;
    const outgoing = cards()[outgoingIndex];
    const incoming = cards()[incomingIndex];

    fading = true;

    if (reducedMotion.matches) {
      currentIndex = newIndex;
      setTransform(currentIndex, false);
      fading = false;
      syncVisibility();
      update();
      return;
    }

    const duration = 360;

    // Fade and slide run concurrently: the leaving card dims while it
    // travels past the edge, the entering card brightens while it travels in.
    if (incoming) {
      incoming.inert = false;
      incoming.style.transition = "none";
      incoming.style.opacity = "0";
      requestAnimationFrame(() => {
        incoming.style.transition = `opacity ${duration}ms ease`;
        incoming.style.opacity = "1";
      });
    }
    if (outgoing) {
      outgoing.style.transition = `opacity ${duration}ms ease`;
      outgoing.style.opacity = "0";
    }

    currentIndex = newIndex;
    setTransform(currentIndex, true);
    setTimeout(() => {
      fading = false;
      syncVisibility();
      update();
    }, duration);
  };

  prev.addEventListener("click", () => navigate(-1));
  next.addEventListener("click", () => navigate(1));
  new ResizeObserver(update).observe(track);
  setTransform(currentIndex, false);
  update();

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
      }, 400);
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
