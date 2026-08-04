/**
 * Fullscreen viewer for villa floor-plan / render images: opened by tapping
 * any <img> inside a villa detail's [data-carousel-track]. Items are read
 * straight from the DOM (the clicked image's track siblings) — no manifest.
 * Unlike gallery.ts's lightbox, navigation does not loop: prev/next hide at
 * the first/last item instead of wrapping.
 */
const FOCUSABLE = "button:not([disabled])";

export function initImageLightbox(): void {
  const overlay = document.getElementById("image-lightbox");
  const closeBtn = overlay?.querySelector<HTMLButtonElement>("[data-lightbox-close]");
  const prevBtn = overlay?.querySelector<HTMLButtonElement>("[data-lightbox-prev]");
  const nextBtn = overlay?.querySelector<HTMLButtonElement>("[data-lightbox-next]");
  const stage = overlay?.querySelector<HTMLImageElement>("[data-lightbox-stage]");
  if (!overlay || !closeBtn || !prevBtn || !nextBtn || !stage) return;

  let items: { src: string; alt: string }[] = [];
  let index = 0;
  let lastTrigger: HTMLElement | null = null;
  let isOpen = false;

  const render = (): void => {
    const item = items[index];
    if (!item) return;
    stage.src = item.src;
    stage.alt = item.alt;
    prevBtn.classList.toggle("hidden", index === 0);
    nextBtn.classList.toggle("hidden", index === items.length - 1);
  };

  const open = (track: HTMLElement, trigger: HTMLImageElement): void => {
    items = Array.from(track.querySelectorAll("img")).map((img) => ({ src: img.getAttribute("src") ?? "", alt: img.alt }));
    index = items.findIndex((item) => item.src === trigger.getAttribute("src"));
    if (index < 0) index = 0;
    lastTrigger = trigger;
    isOpen = true;
    document.body.classList.add("overflow-hidden");
    overlay.classList.remove("hidden");
    render();
    closeBtn.focus();
  };

  const close = (): void => {
    isOpen = false;
    overlay.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    stage.src = "";
    lastTrigger?.focus();
  };

  const navigate = (direction: -1 | 1): void => {
    const next = index + direction;
    if (next < 0 || next >= items.length) return;
    index = next;
    render();
  };

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const img = target.closest<HTMLImageElement>("[data-villa-detail] [data-carousel-track] img");
    if (!img) return;
    const track = img.closest<HTMLElement>("[data-carousel-track]");
    if (track) open(track, img);
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => navigate(-1));
  nextBtn.addEventListener("click", () => navigate(1));

  overlay.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("img, button")) return;
    close();
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
    const focusable = Array.from(overlay.querySelectorAll<HTMLButtonElement>(FOCUSABLE)).filter(
      (el) => !el.classList.contains("hidden"),
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
