/**
 * Partner logos shown on the home page. Files live in public/partners/.
 * Add `href` to make a logo link to the partner's website.
 */
export interface Partner {
  name: string;
  logo: string;
  width: number;
  height: number;
  href?: string;
}

export const partners: Partner[] = [
  {
    name: "Mwamunda Media",
    logo: "/partners/mwamunda-media.png",
    width: 520,
    height: 342,
  },
  {
    name: "Bulk It",
    logo: "/partners/bulk-it.png",
    width: 368,
    height: 78,
  },
  {
    name: "Prady Microfinance Software",
    logo: "/partners/prady-microfinance-software.png",
    width: 520,
    height: 219,
  },
];
