import { Section, SectionHeading } from "@/components/site/Section";

// Promotional posters from the live site.
const promotions = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F6593f1eee34440309bf931b0a268d9b0%2Fefd1420552484b6a9a2406a4e685d75a?format=webp&width=800&height=1200",
    alt: "Mwamunda loan products, payment terms, and contact information",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F6593f1eee34440309bf931b0a268d9b0%2F060dff18bacf407aac8af7d66fefce9d?format=webp&width=800&height=1200",
    alt: "Mwamunda business services and trusted solutions",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F6593f1eee34440309bf931b0a268d9b0%2F57bdf64481ac4745a5221164754528b8?format=webp&width=800&height=1200",
    alt: "Mwamunda mobile app and loan information",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets%2F6593f1eee34440309bf931b0a268d9b0%2F7891a322c40649f99465c4ccac0c18e7?format=webp&width=800&height=1200",
    alt: "Mwamunda savings and financial growth services",
  },
];

export default function PromotionalGallery() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Explore Mwamunda"
        title="Our products at a glance"
        lead="Learn more about our loan products, services, and financial solutions."
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {promotions.map((promotion) => (
          <li
            key={promotion.src}
            className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl border border-border bg-white p-3"
          >
            <img
              src={promotion.src}
              alt={promotion.alt}
              width={800}
              height={1200}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain"
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
