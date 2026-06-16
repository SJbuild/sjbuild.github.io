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
  const drawer = document.getElementById("mobile-menu");
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
    const t = event.target;
    if (t instanceof HTMLElement && t.closest('a[href^="#"]')) setOpen(false);
  });

  // Esc closes; Tab is trapped within header + drawer while the menu is open
  document.addEventListener("keydown", (event) => {
    if (!open) return;
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [
      ...header.querySelectorAll<HTMLElement>(FOCUSABLE),
      ...drawer.querySelectorAll<HTMLElement>(FOCUSABLE),
    ].filter((el) => el.offsetParent !== null);
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

/** Marks the nav link of the section currently in the viewport's middle band. */
export function initScrollspy(): void {
  const links = [...document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]")];
  if (links.length === 0) return;

  const sections = [...new Set(links.map((a) => a.hash.slice(1)))]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  const setActive = (id: string): void => {
    for (const link of links) {
      link.setAttribute("aria-current", link.hash === `#${id}` ? "true" : "false");
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setActive(visible.target.id);
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
  );
  for (const section of sections) observer.observe(section);
}
