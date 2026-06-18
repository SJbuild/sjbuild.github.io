/**
 * Villa media lightbox: a single shared overlay (#villa-gallery) populated
 * from a per-page JSON manifest (#gallery-data), opened by any
 * [data-gallery-trigger][data-gallery-id] element (card cover image or the
 * "Learn more" link — both point at the same villa id). Reuses nav.ts's
 * focus-trap / scroll-lock idioms, scoped to the overlay instead of the
 * header+drawer.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type GalleryItem =
  | { kind: "image"; src: string; thumb: string }
  | { kind: "pdf"; src: string; label: string };

type GalleryEntry = { title: string; items: GalleryItem[] };

export function initGallery(): void {
  const overlay = document.getElementById("villa-gallery");
  const dataEl = document.getElementById("gallery-data");
  if (!overlay || !dataEl) return;

  const manifest: Record<string, GalleryEntry> = JSON.parse(dataEl.textContent ?? "{}");

  const closeBtn = overlay.querySelector<HTMLButtonElement>("[data-gallery-close]");
  const prevBtn = overlay.querySelector<HTMLButtonElement>("[data-gallery-prev]");
  const nextBtn = overlay.querySelector<HTMLButtonElement>("[data-gallery-next]");
  const stage = overlay.querySelector<HTMLElement>("[data-gallery-stage]");
  const titleEl = overlay.querySelector<HTMLElement>("[data-gallery-title]");
  const thumbsEl = overlay.querySelector<HTMLElement>("[data-gallery-thumbs]");
  const downloadLink = overlay.querySelector<HTMLAnchorElement>("[data-gallery-download]");
  if (!closeBtn || !prevBtn || !nextBtn || !stage || !titleEl || !thumbsEl || !downloadLink) return;

  let entry: GalleryEntry | null = null;
  let index = 0;
  let lastTrigger: HTMLElement | null = null;
  let isOpen = false;

  const renderStage = (): void => {
    if (!entry) return;
    const item = entry.items[index];
    if (!item) return;
    stage.innerHTML = "";
    if (item.kind === "image") {
      downloadLink.classList.add("hidden");
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = "";
      img.className = "mx-auto max-h-full w-auto max-w-full object-contain";
      stage.append(img);
    } else {
      const iframe = document.createElement("iframe");
      iframe.src = item.src;
      iframe.title = item.label;
      iframe.className = "h-full w-full rounded-card bg-white";
      stage.append(iframe);
      downloadLink.href = item.src;
      downloadLink.classList.remove("hidden");
    }

    let activeThumb: HTMLButtonElement | null = null;
    for (const [i, btn] of thumbsEl.querySelectorAll<HTMLButtonElement>("[data-gallery-thumb]").entries()) {
      const isActive = i === index;
      btn.setAttribute("aria-current", String(isActive));
      if (isActive) activeThumb = btn;
    }
    centerActiveThumb(activeThumb);
  };

  // Keeps the active thumbnail as close to the center of the strip as
  // possible, naturally stopping once either end of the row is reached
  // (scrollLeft clamps itself, so no extra edge-case handling is needed).
  const centerActiveThumb = (thumb: HTMLButtonElement | null): void => {
    if (!thumb) return;
    const target = thumb.offsetLeft + thumb.offsetWidth / 2 - thumbsEl.clientWidth / 2;
    thumbsEl.scrollTo({ left: target, behavior: "smooth" });
  };

  const renderThumbs = (): void => {
    if (!entry) return;
    thumbsEl.innerHTML = "";
    entry.items.forEach((item, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.galleryThumb = "";
      btn.className = "relative h-14 w-20 shrink-0 overflow-hidden rounded-md";
      btn.setAttribute("aria-label", item.kind === "image" ? `Изображение ${i + 1}` : item.label);
      if (item.kind === "image") {
        const img = document.createElement("img");
        img.src = item.thumb;
        img.alt = "";
        img.className = "h-full w-full object-cover";
        btn.append(img);
      } else {
        btn.classList.add("bg-boxes");
        const badge = document.createElement("span");
        badge.className = "thumb-pdf-badge";
        badge.textContent = "PDF";
        btn.append(badge);
      }
      btn.addEventListener("click", () => {
        index = i;
        renderStage();
      });
      li.append(btn);
      thumbsEl.append(li);
    });
  };

  const open = (id: string, trigger: HTMLElement): void => {
    const found = manifest[id];
    if (!found) return;
    entry = found;
    index = 0;
    lastTrigger = trigger;
    isOpen = true;
    titleEl.textContent = found.title;
    document.body.classList.add("overflow-hidden");
    overlay.classList.remove("hidden");
    renderThumbs();
    renderStage();
    closeBtn.focus();
  };

  const close = (): void => {
    isOpen = false;
    overlay.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    stage.innerHTML = "";
    lastTrigger?.focus();
  };

  const navigate = (direction: -1 | 1): void => {
    if (!entry) return;
    index = (index + direction + entry.items.length) % entry.items.length;
    renderStage();
  };

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const trigger = target.closest<HTMLElement>("[data-gallery-trigger]");
    if (!trigger) return;
    const id = trigger.getAttribute("data-gallery-id");
    if (id) open(id, trigger);
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => navigate(-1));
  nextBtn.addEventListener("click", () => navigate(1));

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  document.addEventListener("keydown", (event) => {
    if (!isOpen) return;
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key === "ArrowLeft") {
      navigate(-1);
      return;
    }
    if (event.key === "ArrowRight") {
      navigate(1);
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...overlay.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (el) => el.offsetParent !== null,
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === last) {
      first.focus();
      event.preventDefault();
    }
  });

  // Pointer drag swipe on the stage
  let dragging = false;
  let dragStartX = 0;
  let dragDeltaX = 0;
  const swipeThreshold = 40;

  stage.addEventListener("pointerdown", (e) => {
    dragging = true;
    dragStartX = e.clientX;
    dragDeltaX = 0;
  });
  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    dragDeltaX = e.clientX - dragStartX;
  });
  const endDrag = (): void => {
    if (!dragging) return;
    dragging = false;
    if (dragDeltaX <= -swipeThreshold) navigate(1);
    else if (dragDeltaX >= swipeThreshold) navigate(-1);
  };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);
}
