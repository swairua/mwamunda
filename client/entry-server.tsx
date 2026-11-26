/**
 * Server entry used only at build time by scripts/prerender.mjs to turn each
 * public route into static HTML.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppShell } from "./App";

export {
  SITE_URL,
  canonicalUrl,
  notFoundSeo,
  publicPages,
  renderHead,
} from "./lib/seo";

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>,
  );
}
