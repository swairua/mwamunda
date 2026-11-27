/**
 * Search and sharing metadata for every public page.
 *
 * One list drives three things: the tags written into each prerendered page
 * at build time, the tags updated in the browser on navigation, and the
 * sitemap. Add a page here when you add a public route.
 */
import { faqs } from "@/content/faq";
import { products } from "@/content/products";
import { founder } from "@/content/team";
import { logo, photos, site } from "@/lib/site";

export const SITE_URL = "https://www.mwamunda.co.ke";

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  /** Short name used in breadcrumbs. */
  label: string;
  noindex?: boolean;
}

const brand = site.name;

const productDescriptions: Record<string, string> = {
  "fair-personal-loans":
    "Affordable personal loans for individuals without access to mainstream finance. Quick approval, flexible repayment and debt advice support from Mwamunda.",
  "chama-loans":
    "Group financing for chamas, business groups and cooperatives in Kenya, with training and capacity-building support included. Apply with Mwamunda.",
  "debt-advice-services":
    "One-on-one debt counselling, personalised repayment plans and ongoing support to help you manage and overcome debt. Talk to Mwamunda's advisors.",
  "financial-capability-training":
    "Financial literacy training from Mwamunda: budgeting, saving, investment basics and planning, through workshops, online courses and coaching.",
};

export const publicPages: PageSeo[] = [
  {
    path: "/",
    label: "Home",
    title: `Fair Loans for Businesses, Farmers & Chamas in Kenya | ${brand}`,
    description:
      "Mwamunda Investment Limited offers fast, fair loans, debt advice and financial training for chamas and small businesses in Mombasa and across Kenya.",
  },
  {
    path: "/about",
    label: "About",
    title: `About Us | ${brand}`,
    description:
      "A Kenyan microcredit institution serving micro and small businesses, farmers and chamas since 2019. Meet our founder, our team and our values.",
  },
  {
    path: "/services",
    label: "Services",
    title: `Our Services | ${brand}`,
    description:
      "Fair Personal Loans, Chama Loans, Debt Advice Services and Financial Capability Training. Compare Mwamunda's services and find the right fit.",
  },
  ...products.map((product) => ({
    path: `/products/${product.slug}`,
    label: product.name,
    title: `${product.name} | ${brand}`,
    description: productDescriptions[product.slug] ?? product.summary,
  })),
  {
    path: "/careers",
    label: "Careers",
    title: `Careers | ${brand}`,
    description:
      "Work with Mwamunda Investment Limited and help bring fair financial services to underserved communities in Kenya. See open positions.",
  },
  {
    path: "/faq",
    label: "FAQ",
    title: `Frequently Asked Questions | ${brand}`,
    description:
      "Answers to common questions about Mwamunda Investment Limited: who can apply, our loan products, application review times and how to contact us.",
  },
  {
    path: "/contact",
    label: "Contact",
    title: `Contact Us | ${brand}`,
    description:
      "Call or WhatsApp 0789 698 601, email info@mwamunda.co.ke or visit our head office at Edrines Plaza, Mombasa. We respond within 24 hours.",
  },
];

export const notFoundSeo: PageSeo = {
  path: "/404",
  label: "Page not found",
  title: `Page not found | ${brand}`,
  description: "The page you are looking for could not be found.",
  noindex: true,
};

function normalise(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function seoForPath(pathname: string): PageSeo {
  const path = normalise(pathname);
  return publicPages.find((page) => page.path === path) ?? notFoundSeo;
}

export function canonicalUrl(page: PageSeo): string {
  return `${SITE_URL}${page.path === "/" ? "/" : page.path}`;
}

const shareImage = {
  url: `${SITE_URL}${photos.fieldVisit.src}`,
  width: photos.fieldVisit.width,
  height: photos.fieldVisit.height,
  alt: photos.fieldVisit.alt,
};

/** schema.org data for a page. Only facts stated elsewhere on the site. */
export function structuredData(page: PageSeo): object[] {
  if (page.noindex) return [];

  const organisation = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${SITE_URL}/#organization`,
    name: site.name,
    url: SITE_URL,
    logo: `${SITE_URL}${logo.src}`,
    image: shareImage.url,
    description: site.description,
    slogan: site.tagline,
    email: site.email,
    telephone: "+254789698601",
    foundingDate: String(site.foundedYear),
    founder: {
      "@type": "Person",
      name: founder.name,
      jobTitle: founder.role,
    },
    areaServed: "Kenya",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      postOfficeBoxNumber: "964",
      addressLocality: "Mombasa",
      addressCountry: "KE",
    },
  };

  const data: object[] = [organisation];

  if (page.path !== "/") {
    const trail = [{ name: "Home", path: "/" }];
    if (page.path.startsWith("/products/")) {
      trail.push({ name: "Services", path: "/services" });
    }
    trail.push({ name: page.label, path: page.path });
    data.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: trail.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${SITE_URL}${item.path}`,
      })),
    });
  }

  if (page.path === "/faq") {
    data.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }

  return data;
}

interface MetaTag {
  /** Attribute that identifies the tag: `name` or `property`. */
  key: "name" | "property";
  id: string;
  content: string;
}

function metaTags(page: PageSeo): MetaTag[] {
  const url = canonicalUrl(page);
  return [
    { key: "name", id: "description", content: page.description },
    {
      key: "name",
      id: "robots",
      content: page.noindex ? "noindex, follow" : "index, follow",
    },
    { key: "property", id: "og:type", content: "website" },
    { key: "property", id: "og:site_name", content: site.name },
    { key: "property", id: "og:locale", content: "en_KE" },
    { key: "property", id: "og:title", content: page.title },
    { key: "property", id: "og:description", content: page.description },
    { key: "property", id: "og:url", content: url },
    { key: "property", id: "og:image", content: shareImage.url },
    { key: "property", id: "og:image:width", content: `${shareImage.width}` },
    { key: "property", id: "og:image:height", content: `${shareImage.height}` },
    { key: "property", id: "og:image:alt", content: shareImage.alt },
    { key: "name", id: "twitter:card", content: "summary_large_image" },
    { key: "name", id: "twitter:title", content: page.title },
    { key: "name", id: "twitter:description", content: page.description },
    { key: "name", id: "twitter:image", content: shareImage.url },
  ];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Head markup for a page, used by the build-time prerender. */
export function renderHead(page: PageSeo): string {
  const lines = [
    `<title>${escapeHtml(page.title)}</title>`,
    ...metaTags(page).map(
      (tag) =>
        `<meta ${tag.key}="${tag.id}" content="${escapeHtml(tag.content)}" />`,
    ),
  ];
  if (!page.noindex) {
    lines.push(`<link rel="canonical" href="${canonicalUrl(page)}" />`);
  }
  for (const item of structuredData(page)) {
    // "<" is escaped so the JSON can never close the script element early.
    const json = JSON.stringify(item).replace(/</g, "\\u003c");
    lines.push(`<script type="application/ld+json" data-seo>${json}</script>`);
  }
  return lines.join("\n    ");
}

/** Update the document head in the browser after a client-side navigation. */
export function applySeo(page: PageSeo): void {
  document.title = page.title;

  for (const tag of metaTags(page)) {
    let element = document.head.querySelector<HTMLMetaElement>(
      `meta[${tag.key}="${tag.id}"]`,
    );
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(tag.key, tag.id);
      document.head.appendChild(element);
    }
    element.setAttribute("content", tag.content);
  }

  let canonical = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (page.noindex) {
    canonical?.remove();
  } else {
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl(page);
  }

  document.head
    .querySelectorAll("script[data-seo]")
    .forEach((element) => element.remove());
  for (const item of structuredData(page)) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "");
    script.textContent = JSON.stringify(item);
    document.head.appendChild(script);
  }
}
