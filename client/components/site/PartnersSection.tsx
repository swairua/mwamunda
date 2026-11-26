import { partners } from "@/content/partners";
import { Section, SectionHeading } from "./Section";

/** A row of partner logos on equal white tiles so mixed logo shapes line up. */
export default function PartnersSection() {
  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow="Our partners"
        title="Organisations we work with"
        align="center"
        className="mb-8 md:mb-10"
      />
      <ul className="mx-auto flex max-w-xl flex-wrap justify-center gap-4 md:gap-6 lg:max-w-none">
        {partners.map((partner) => {
          const image = (
            <img
              src={partner.logo}
              alt={partner.name}
              width={partner.width}
              height={partner.height}
              loading="lazy"
              decoding="async"
              // The ratio and width give the image a box before it loads; without one,
              // lazy loading can skip it and the tile stays blank.
              style={{ aspectRatio: `${partner.width} / ${partner.height}` }}
              className="max-h-16 w-full max-w-[12rem] object-contain sm:max-h-20"
            />
          );
          const tile =
            "flex h-28 items-center justify-center rounded-2xl border border-border bg-white px-5 py-4 sm:h-32 sm:px-8";
          return (
            <li
              key={partner.name}
              className="w-[calc(50%-0.5rem)] md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
            >
              {partner.href ? (
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener"
                  className={`${tile} transition-shadow hover:shadow-md`}
                >
                  {image}
                </a>
              ) : (
                <div className={tile}>{image}</div>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
