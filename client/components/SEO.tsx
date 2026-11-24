import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { faqs } from "@/lib/faq";

const SITE_URL = "https://www.mwamunda.co.ke";
const SITE_NAME = "Mwamunda Investment Limited";
const DEFAULT_IMAGE =
  "https://cdn.builder.io/api/v1/image/assets%2F675a5c01881345b88968fcdd971866d7%2F7e6019eab478401686a679312028d4e8?format=webp&width=800";

interface PageSEO {
  title: string;
  description: string;
}

const pages: Record<string, PageSEO> = {
  "/": {
    title: "Fair Loans for Businesses, Farmers & Chamas in Kenya",
    description:
      "Mwamunda Investment Limited provides fast, fair and reliable micro-loans, chama loans, debt advice and financial training for underserved entrepreneurs across rural Kenya. Since 2019.",
  },
  "/about": {
    title: "About Us",
    description:
      "Learn about Mwamunda Investment Limited: our mission since 2019, our leadership and our commitment to fair financial services for micro and small businesses in Kenya.",
  },
  "/services": {
    title: "Our Services",
    description:
      "Explore Mwamunda's financial solutions: personal loans, chama loans, debt advice services and financial capability training for businesses and farmers in Kenya.",
  },
  "/contact": {
    title: "Contact Us",
    description:
      "Get in touch with Mwamunda Investment Limited. Call or WhatsApp 0789 698 601, email info@mwamunda.co.ke, or send us a message about loans and partnerships.",
  },
  "/careers": {
    title: "Careers",
    description:
      "Join the Mwamunda team and help bring fair financial solutions to underserved communities in Kenya. View current open positions.",
  },
  "/faq": {
    title: "Frequently Asked Questions",
    description:
      "Answers to common questions about Mwamunda Investment Limited: who can apply, our loan products, application review times and how to contact us.",
  },
  "/products/fair-personal-loans": {
    title: "Fair Personal Loans",
    description:
      "Fair personal loans from Mwamunda Investment Limited for small business owners and farmers in Kenya. Transparent terms, fast review and supportive service.",
  },
  "/products/chama-loans": {
    title: "Chama Loans",
    description:
      "Group lending for chamas and savings groups. Mwamunda's Chama Loans help members fund business and farming projects with fair, reliable financing.",
  },
  "/products/debt-advice-services": {
    title: "Debt Advice Services",
    description:
      "Independent, practical debt advice from Mwamunda to help individuals and small businesses manage debt and make informed financial decisions.",
  },
  "/products/financial-capability-training": {
    title: "Financial Capability Training",
    description:
      "Practical financial capability training from Mwamunda for entrepreneurs, farmers and chama groups who want to manage cash flow and grow sustainably.",
  },
};

function setMeta(attribute: "name" | "property", key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function setJsonLd(id: string, data: object | null) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/** Keeps head tags in sync with the current SPA route. */
export default function SEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = pages[pathname] ?? pages["/"];
    const isAdmin = pathname.startsWith("/admin");
    const title = isAdmin
      ? `Admin | ${SITE_NAME}`
      : `${page.title} | ${SITE_NAME}`;
    const description = isAdmin ? "Admin portal" : page.description;
    const url = `${SITE_URL}${pathname}`;

    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "robots", isAdmin ? "noindex, nofollow" : "index, follow");
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "en_KE");
    setMeta("property", "og:url", url);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", DEFAULT_IMAGE);
    setMeta("property", "og:image:alt", SITE_NAME);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", DEFAULT_IMAGE);
    setCanonical(url);

    setJsonLd("ld-organization", {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: DEFAULT_IMAGE,
      email: "info@mwamunda.co.ke",
      telephone: "+254789698601",
      areaServed: "Kenya",
      description:
        "Microcredit institution providing fair financial solutions to underserved businesses, farmers and chamas in Kenya since 2019.",
    });

    if (pathname === "/faq" && !isAdmin) {
      setJsonLd("ld-faq", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      });
    } else {
      setJsonLd("ld-faq", null);
    }
  }, [pathname]);

  return null;
}
