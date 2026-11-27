import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import ProductContactForm from "@/components/ProductContactForm";
import { Button } from "@/components/ui/button";
import type { ProductContent } from "@/content/products";
import { site } from "@/lib/site";
import { CtaBand, Section, SectionHeading } from "./Section";
import WhatsAppIcon from "./WhatsAppIcon";

/** One template for every product page; the content comes from content/products.ts. */
export default function ProductPage({ product }: { product: ProductContent }) {
  const Icon = product.icon;

  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="container-site py-12 md:py-20">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm">
            <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
              <li className="flex items-center gap-1">
                <Link to="/" className="hover:text-foreground hover:underline">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </li>
              <li className="flex items-center gap-1">
                <Link
                  to="/services"
                  className="hover:text-foreground hover:underline"
                >
                  Services
                </Link>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </li>
              <li aria-current="page" className="font-medium text-foreground">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="h-page">{product.hero.title}</h1>
            <p className="lead mt-5">{product.hero.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl">
                <a href="#application-form">
                  {product.actionLabel === "Apply"
                    ? "Apply now"
                    : product.actionLabel}
                  <ArrowRight aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a href={site.whatsapp.href} target="_blank" rel="noreferrer">
                  <WhatsAppIcon />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading
          title={product.features.title}
          lead={product.features.lead}
        />
        <ul className="grid gap-5 sm:grid-cols-2">
          {product.features.items.map((feature) => (
            <li key={feature.title} className="card-site flex gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="h-card">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {product.steps && (
        <Section tone="surface">
          <SectionHeading
            title={product.steps.title}
            lead={product.steps.lead}
          />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {product.steps.items.map((step, index) => (
              <li key={step.title} className="card-site">
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="h-card">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem] text-muted-foreground">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {product.groups?.map((group, groupIndex) => (
        <Section
          key={group.title}
          tone={groupIndex % 2 === 0 ? "surface" : "default"}
        >
          <SectionHeading title={group.title} lead={group.lead} />
          <ul className="grid gap-5 md:grid-cols-3">
            {group.items.map((item) => (
              <li key={item.title} className="card-site">
                <h3 className="h-card">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.desc}</p>
                {item.points && (
                  <ul className="mt-5 space-y-2 border-t border-border pt-5">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <Check
                          className="mt-1 h-4 w-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </Section>
      ))}

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <h2 className="h-section">{product.checklist.title}</h2>
          <ul className="divide-y divide-border border-y border-border">
            {product.checklist.items.map((item) => (
              <li key={item} className="flex items-start gap-4 py-4 text-lg">
                <Check
                  className="mt-1.5 h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section
        id="application-form"
        tone="surface"
        containerClassName="max-w-3xl"
      >
        <SectionHeading
          title={product.form.title}
          lead={product.form.lead}
          className="mb-8 md:mb-10"
        />
        <ProductContactForm productName={product.name} />
      </Section>

      <CtaBand
        title={product.cta.title}
        lead={product.cta.lead}
        primaryLabel="Contact us"
        primaryHref="/contact"
      />
    </>
  );
}
