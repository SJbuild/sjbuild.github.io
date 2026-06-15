import "@fontsource/noto-sans/400.css";
import "@fontsource/noto-sans/500.css";
import "@fontsource/noto-sans/700.css";
import "@fontsource/pt-serif/400.css";
import "@fontsource/pt-serif/700.css";
import "./styles/main.css";

import { initNav, initScrollspy } from "./modules/nav";
import { initCarousel } from "./modules/carousel";
import { initForm } from "./modules/form";
import { initReveal } from "./modules/reveal";

initNav();
initScrollspy();
initCarousel();
initForm();
initReveal();
