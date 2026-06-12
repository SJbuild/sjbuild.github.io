import "@fontsource/noto-sans/400.css";
import "@fontsource/noto-sans/500.css";
import "@fontsource/noto-sans/700.css";
import "@fontsource/pt-serif/400.css";
import "@fontsource/pt-serif/700.css";
import "./styles/main.css";

import { initNav } from "./modules/nav";
import { initCarousel } from "./modules/carousel";
import { initGallery } from "./modules/gallery";

// Feature modules are initialized here as sections land (see PLAN.md):
// form.ts (P7), reveal.ts + lang.ts (P8)
initNav();
initCarousel();
initGallery();
