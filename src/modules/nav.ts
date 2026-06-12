const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function initNav(): void {
  const header = document.querySelector<HTMLElement>("#site-header");
  if (!header) return;

  const onScroll = (): void => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = header.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const drawer = header.querySelector<HTMLElement>("#mobile-menu");
  if (!toggle || !drawer) return;

  let open = false;

  const setOpen = (next: boolean): void => {
    open = next;
    toggle.setAttribute("aria-expanded", String(next));
    drawer.classList.toggle("hidden", !next);
    document.body.classList.toggle("overflow-hidden", next);
    if (next) {
      drawer.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    } else {
      toggle.focus();
    }
  };

  toggle.addEventListener("click", () => setOpen(!open));

  // Anchor navigation inside the drawer closes it
  drawer.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest('a[href^="#"]')) setOpen(false);
  });

  // Esc closes; Tab is trapped within the header while the drawer is open
  header.addEventListener("keydown", (event) => {
    if (!open) return;
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...header.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
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

  // Leaving the mobile breakpoint while open resets the drawer
  const desktop = window.matchMedia("(min-width: 64rem)");
  desktop.addEventListener("change", () => {
    if (desktop.matches && open) setOpen(false);
  });
}
