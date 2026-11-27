import "@fontsource-variable/plus-jakarta-sans/wght.css";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppShell } from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const app = (
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);

/**
 * Prerendered pages arrive with their HTML already in #root, tagged with the
 * route they were built for. Hydrate only when that route is the one being
 * viewed; otherwise (admin shell, dev server, or a host that fell back to
 * another page's HTML) discard the markup and render fresh.
 */
function canHydrate(root: HTMLElement): boolean {
  const builtFor = root.dataset.prerendered;
  if (!builtFor || !root.hasChildNodes()) return false;
  const path = window.location.pathname.replace(/(.)\/+$/, "$1");
  if (builtFor === "/404") return !path.startsWith("/admin");
  return builtFor === path;
}

if (canHydrate(rootElement)) {
  hydrateRoot(rootElement, app);
} else {
  rootElement.replaceChildren();
  createRoot(rootElement).render(app);
}
