/**
 * Villas listing page: interactive site-map hotspots + per-villa detail
 * switching. Hover/focus shows a villa's tooltip; activating a hotspot
 * (click, Enter, or a second tap on touch) swaps in that villa's detail
 * block and scrolls to it. Touch gets an extra "select" step (matched via
 * `pointer: coarse`) so a first tap previews the tooltip instead of jumping
 * straight to the detail section.
 */
export function initVillas(): void {
  const map = document.querySelector<HTMLElement>("[data-villa-map]");
  if (!map) return;

  const hotspots = [...map.querySelectorAll<SVGAElement>("[data-villa-hotspot]")];
  const hotspotsById = new Map(hotspots.map((el) => [el.dataset.villaId ?? "", el]));
  const tooltips = new Map(
    [...document.querySelectorAll<HTMLElement>("[data-villa-tooltip]")].map((el) => [el.dataset.villaId ?? "", el]),
  );
  const details = new Map(
    [...document.querySelectorAll<HTMLElement>("[data-villa-detail]")].map((el) => [el.dataset.villaId ?? "", el]),
  );
  if (hotspots.length === 0 || details.size === 0) return;

  const coarsePointer = window.matchMedia("(pointer: coarse)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let selectedId: string | null = null; // touch only: id awaiting a confirming second tap

  const showTooltip = (id: string, show: boolean): void => {
    const el = tooltips.get(id);
    if (!el) return;
    el.classList.toggle("is-active", show);
    hotspotsById.get(id)?.classList.toggle("is-active", show);
    el.style.transform = "";
    if (!show) return;
    // Clamp inside the map container so a fixed-width tooltip near an edge
    // (mainly on narrow screens) never overflows the viewport.
    const mapBounds = map.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    const pad = 8;
    let dx = 0;
    if (box.right > mapBounds.right - pad) dx = mapBounds.right - pad - box.right;
    if (box.left + dx < mapBounds.left + pad) dx = mapBounds.left + pad - box.left;
    if (dx) el.style.transform = `translateX(${dx}px)`;
  };

  const activateVilla = (id: string): void => {
    for (const [detailId, el] of details) el.classList.toggle("is-active", detailId === id);
    for (const [tipId] of tooltips) showTooltip(tipId, tipId === id);
    // Persistent highlight for whichever villa's panel is currently shown —
    // independent of `.is-active` above, which is the transient hover/touch-
    // preview state and gets cleared on pointerleave/blur.
    for (const [hotId, el] of hotspotsById) el.classList.toggle("is-current", hotId === id);
    const detail = details.get(id);
    detail?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
    detail?.focus({ preventScroll: true });
  };

  // Default panel shown before any interaction: the first detail block in
  // document order (Villa 1), matching the map's own reading order.
  const defaultId = [...details.keys()][0] ?? "";
  details.get(defaultId)?.classList.add("is-active");
  hotspotsById.get(defaultId)?.classList.add("is-current");

  for (const hotspot of hotspots) {
    const id = hotspot.dataset.villaId;
    if (!id) continue;

    hotspot.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      showTooltip(id, true);
    });
    hotspot.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch") return;
      if (selectedId !== id) showTooltip(id, false);
    });
    hotspot.addEventListener("focus", () => showTooltip(id, true));
    hotspot.addEventListener("blur", () => {
      if (selectedId !== id) showTooltip(id, false);
    });

    hotspot.addEventListener("click", (event) => {
      if (!coarsePointer.matches) {
        event.preventDefault();
        activateVilla(id);
        return;
      }
      if (selectedId !== id) {
        // First tap: preview only, don't navigate yet.
        event.preventDefault();
        for (const tipId of tooltips.keys()) showTooltip(tipId, tipId === id);
        selectedId = id;
        return;
      }
      event.preventDefault();
      activateVilla(id);
      selectedId = null;
    });
  }

  // Tapping elsewhere on touch clears a pending (first-tap) selection.
  document.addEventListener("pointerdown", (event) => {
    if (!coarsePointer.matches || !selectedId) return;
    const target = event.target;
    if (target instanceof Element && target.closest("[data-villa-hotspot]")) return;
    showTooltip(selectedId, false);
    selectedId = null;
  });
}

/** Dot pagination for the 2-slide floor-plan tracks reused from carousel.ts's scroll-snap tracks. */
export function initFloorplanDots(): void {
  for (const dots of document.querySelectorAll<HTMLElement>("[data-plan-dots]")) {
    const trackId = dots.dataset.dotsFor;
    const track = trackId ? document.getElementById(trackId) : null;
    const items = [...dots.querySelectorAll<HTMLElement>(".plan-dot")];
    if (!track || items.length === 0) continue;

    const update = (): void => {
      const step = track.scrollWidth / items.length;
      const active = Math.min(items.length - 1, Math.round(track.scrollLeft / step));
      items.forEach((dot, i) => dot.classList.toggle("is-active", i === active));
    };
    track.addEventListener("scroll", update, { passive: true });
    new ResizeObserver(update).observe(track);
    update();
  }
}
