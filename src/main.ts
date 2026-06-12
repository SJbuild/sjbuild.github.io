import "@fontsource/noto-sans/400.css";
import "@fontsource/noto-sans/500.css";
import "@fontsource/noto-sans/700.css";
import "@fontsource/pt-serif/400.css";
import "@fontsource/pt-serif/700.css";
import "./styles/main.css";

import { initNav } from "./modules/nav";

// Feature modules are initialized here as sections land (see PLAN.md):
// carousel.ts (P4), gallery.ts (P6), form.ts (P7), reveal.ts + lang.ts (P8)
initNav();
