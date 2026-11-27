/**
 * Build step: writes a static HTML file for every public page, plus
 * 404.html, sitemap.xml and the empty app.html shell used by /admin.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server bundle).
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist");
const ssrDir = path.resolve("dist-ssr");
const serverEntry = pathToFileURL(path.join(ssrDir, "entry-server.js")).href;

const { render, publicPages, notFoundSeo, renderHead, canonicalUrl, SITE_URL } =
  await import(serverEntry);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const HEAD_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
const ROOT = '<div id="root"></div>';

if (!HEAD_BLOCK.test(template) || !template.includes(ROOT)) {
  throw new Error("index.html is missing the seo markers or the #root element");
}

function writeFile(relativePath, contents) {
  const target = path.join(dist, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
}

// Functions are used as replacements so "$" in the content is never
// interpreted as a replacement pattern.
function page(head, body, route) {
  // data-prerendered tells the client which route this markup was built for.
  const open = route
    ? `<div id="root" data-prerendered="${route}">`
    : '<div id="root">';
  return template
    .replace(HEAD_BLOCK, () => head)
    .replace(ROOT, () => `${open}${body}</div>`);
}

// 1. Empty shell for the client-rendered admin area. Never indexed.
writeFile(
  "app.html",
  page(
    '<title>Admin | Mwamunda Investment Limited</title>\n    <meta name="robots" content="noindex, nofollow" />',
    "",
  ),
);

// 2. One HTML file per public page: "/" -> index.html, "/about" -> about.html.
for (const seo of publicPages) {
  const file = seo.path === "/" ? "index.html" : `${seo.path.slice(1)}.html`;
  writeFile(file, page(renderHead(seo), render(seo.path), seo.path));
  console.log(`prerendered ${seo.path} -> ${file}`);
}

// 3. A real "not found" page, served with a 404 status by the web server.
writeFile(
  "404.html",
  page(renderHead(notFoundSeo), render(notFoundSeo.path), notFoundSeo.path),
);
console.log("prerendered 404.html");

// 4. Sitemap of every indexable page.
const today = new Date().toISOString().slice(0, 10);
const urls = publicPages
  .map(
    (seo) =>
      `  <url>\n    <loc>${canonicalUrl(seo)}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`,
  )
  .join("\n");
writeFile(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(`sitemap.xml: ${publicPages.length} urls on ${SITE_URL}`);

fs.rmSync(ssrDir, { recursive: true, force: true });
