/**
 * Language toggle stub. Bulgarian copy is ready in website-docs/bg/*.
 * TODO(i18n): build the /bg/ page, link both with hreflang pairs, and
 * replace this stub with a real toggle.
 */
export function initLang(): void {
  for (const toggle of document.querySelectorAll<HTMLAnchorElement>("[data-lang-toggle]")) {
    toggle.addEventListener("click", (event) => event.preventDefault());
  }
}
