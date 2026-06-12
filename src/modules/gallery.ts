/**
 * Community horizontal accordion (lg and up): exactly one panel collapses to
 * a photo sliver; arrows slide the open "window" across the three panels.
 * Below lg — and without JS — all panels render stacked and fully expanded,
 * so no content is ever trapped behind the interaction.
 */
const COLLAPSED_DEFAULT = 2; // design's resting state: third panel as sliver

export function initGallery(): void {
  const root = document.querySelector<HTMLElement>("[data-gallery]");
  const controls = document.querySelector<HTMLElement>("[data-gallery-controls]");
  const prev = document.querySelector<HTMLButtonElement>("[data-gallery-prev]");
  const next = document.querySelector<HTMLButtonElement>("[data-gallery-next]");
  if (!root || !controls || !prev || !next) return;

  const panels = [...root.querySelectorAll<HTMLElement>("[data-gallery-panel]")];
  if (panels.length < 2) return;

  const desktop = window.matchMedia("(min-width: 64rem)");
  let collapsed = COLLAPSED_DEFAULT;

  const apply = (): void => {
    if (!desktop.matches) {
      root.style.gridTemplateColumns = "";
      for (const panel of panels) {
        panel.dataset["state"] = "expanded";
        panel.querySelector("[data-gallery-heading]")?.setAttribute("aria-expanded", "true");
      }
      return;
    }
    root.style.gridTemplateColumns = panels
      .map((_, i) => (i === collapsed ? "var(--gallery-collapsed)" : "minmax(0, 1fr)"))
      .join(" ");
    panels.forEach((panel, i) => {
      panel.dataset["state"] = i === collapsed ? "collapsed" : "expanded";
      panel.querySelector("[data-gallery-heading]")?.setAttribute("aria-expanded", String(i !== collapsed));
    });
    // Right arrow pulls hidden right-side content open (collapsed slot moves left).
    next.disabled = collapsed === 0;
    prev.disabled = collapsed === panels.length - 1;
  };

  prev.addEventListener("click", () => {
    collapsed = Math.min(panels.length - 1, collapsed + 1);
    apply();
  });
  next.addEventListener("click", () => {
    collapsed = Math.max(0, collapsed - 1);
    apply();
  });
  panels.forEach((panel, i) => {
    panel.querySelector("[data-gallery-heading]")?.addEventListener("click", () => {
      collapsed = i;
      apply();
    });
  });
  desktop.addEventListener("change", apply);
  apply();
}
