/**
 * Single source of truth for company details, navigation and brand imagery.
 * Header, footer and pages read from here so a change is made once.
 */

const BUILDER_CDN = "https://cdn.builder.io/api/v1/image/assets%2F";

/** Build a builder.io image URL at a given width (the CDN resizes on request). */
function builderImage(path: string, width = 800): string {
  return `${BUILDER_CDN}${path}?format=webp&width=${width}`;
}

/** `srcset` string for the common breakpoints. */
export function imageSrcSet(path: string, widths = [480, 800, 1200]): string {
  return widths.map((w) => `${builderImage(path, w)} ${w}w`).join(", ");
}

export const site = {
  name: "Mwamunda Investment Limited",
  shortName: "Mwamunda",
  tagline: "We don't bank stories",
  description:
    "Fast, fair loans, debt advice and financial training for chamas and small businesses in rural Mombasa.",
  foundedYear: 2019,
  email: "info@mwamunda.co.ke",
  customerCareEmail: "customercare@mwamunda.co.ke",
  hours: [
    { days: "Mon – Fri", time: "7.30am – 6.00pm" },
    { days: "Saturday", time: "8.30am – 6.00pm" },
    { days: "Sunday", time: "Closed" },
  ],
  phones: [{ display: "0789 698 601", href: "tel:+254789698601" }],
  whatsapp: {
    display: "0789 698 601",
    href: "https://wa.me/254789698601?text=Hello%20Mwamunda%2C%20I%20would%20like%20to%20ask%20about%20a%20loan.",
  },
  address: {
    line1: "Edrines Plaza, Ground Floor",
    line2: "P.O. Box 964, Mombasa",
  },
  credit: {
    name: "Zira Technologies",
    href: "https://www.zira-tech.com",
  },
} as const;

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/careers", label: "Careers" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export const productLinks = [
  { to: "/products/fair-personal-loans", label: "Fair Personal Loans" },
  { to: "/products/chama-loans", label: "Chama Loans" },
  { to: "/products/debt-advice-services", label: "Debt Advice Services" },
  {
    to: "/products/financial-capability-training",
    label: "Financial Capability Training",
  },
] as const;

/** Where the primary "Apply for a loan" action leads. */
export const APPLY_HREF = "/#products";

const paths = {
  fieldTeam:
    "675a5c01881345b88968fcdd971866d7%2F854295e8b1354678a9547323638bb78b",
  headOffice:
    "52e00125125046a69d6527573cdca733%2F04c3168de51f43519439fc0ffe5d3e92",
  clientsAtDesk:
    "675a5c01881345b88968fcdd971866d7%2Fd97c126d37b6465db10ea02f935cf545",
  clientsOutdoors:
    "675a5c01881345b88968fcdd971866d7%2Fe02d9fa55b634777b9da5ef97090d668",
} as const;

export type SiteImageKey = keyof typeof paths;

export const images: Record<
  SiteImageKey,
  { src: string; srcSet: string; path: string }
> = Object.fromEntries(
  Object.entries(paths).map(([key, path]) => [
    key,
    { path, src: builderImage(path), srcSet: imageSrcSet(path) },
  ]),
) as Record<SiteImageKey, { src: string; srcSet: string; path: string }>;

/** The company logo (transparent PNG, 641x389) served from public/. */
export const logo = { src: "/logo.png", width: 641, height: 389 } as const;

/**
 * Base path for photos in public/ (team/, success-stories/).
 * Empty means "served by this site"; set a CDN origin here if they move.
 */
export const MEDIA_BASE = "";

export const photos = {
  fieldVisit: {
    src: `${MEDIA_BASE}/team/staffatwork.jpeg`,
    alt: "Mwamunda field officers talking with a client in his community",
    width: 1448,
    height: 1086,
  },
  teamBench: {
    src: `${MEDIA_BASE}/team/gallery-team-bench.jpg`,
    alt: "Mwamunda team on a community visit",
    width: 1448,
    height: 1086,
  },
  branchDesk: {
    src: `${MEDIA_BASE}/team/gallery-desk-portrait.jpg`,
    alt: "Mwamunda team members at the branch service desk",
    width: 1086,
    height: 1448,
  },
  sofiaAtieno: {
    src: `${MEDIA_BASE}/success-stories/sofia-atieno.jpg`,
    alt: "Sofia Atieno, a Mwamunda client from Mtwapa",
    width: 1199,
    height: 1312,
  },
  mariamChimako: {
    src: `${MEDIA_BASE}/success-stories/mariam-chimako.jpg`,
    alt: "Mariam Chimako at the Mwamunda Mtwapa branch",
    width: 1254,
    height: 1254,
  },
} as const;
