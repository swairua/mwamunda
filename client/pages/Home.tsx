import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  CalendarCheck,
  MapPin,
  MessageCircle,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import PromotionalGallery from "@/components/PromotionalGallery";
import PartnersSection from "@/components/site/PartnersSection";
import SponsorHighlight from "@/components/site/SponsorHighlight";
import { CtaBand, Section, SectionHeading } from "@/components/site/Section";
import WhatsAppIcon from "@/components/site/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { products } from "@/content/products";
import { images, photos, site } from "@/lib/site";

const heroFacts = [
  { icon: CalendarCheck, label: `Serving since ${site.foundedYear}` },
  { icon: MapPin, label: "Head office in Mombasa" },
  { icon: MessageCircle, label: "Call, SMS or WhatsApp" },
];

const steps = [
  {
    title: "Apply",
    desc: "Complete a simple online application form with basic information.",
  },
  {
    title: "Verify",
    desc: "Our team verifies your information within 24 hours.",
  },
  {
    title: "Approve",
    desc: "Receive approval and discuss loan terms with a specialist.",
  },
  {
    title: "Receive",
    desc: "Get funds disbursed directly to your bank account.",
  },
];

const reasons = [
  {
    icon: Users,
    title: "Community focused",
    desc: "We understand the unique needs of micro and small businesses and farmers.",
  },
  {
    icon: Zap,
    title: "Fast approval",
    desc: "Quick processing and affordable terms designed for those excluded by mainstream finance.",
  },
  {
    icon: Target,
    title: "Field agents near you",
    desc: "Our dedicated agents are eager to serve you. Ask for a visit from one of them.",
  },
  {
    icon: Award,
    title: "Experienced board",
    desc: "Board members experienced in investment, microfinance and product development.",
  },
];

// TODO(content): replace with dated, sourced figures before launch.
const impact = [
  { value: `${site.foundedYear}`, label: "Serving communities since" },
  { value: "6,000+", label: "Customers served" },
  { value: "95%+", label: "Repayment rate" },
];

// Published client story, taken from the live site.
const story = {
  quote:
    "Mwamunda Investment Limited has truly changed my life. The loan I received helped me grow my vegetable business and support my family. Their service is friendly, fast and trustworthy. I am proud to be a happy client!",
  name: "Sofia Atieno",
  detail: "Client, Mtwapa",
};

const partnerPoints = [
  {
    icon: TrendingUp,
    title: "Proven track record",
    desc: `Operating since ${site.foundedYear} with expanding reach across rural communities.`,
  },
  {
    icon: Users,
    title: "Deep community roots",
    desc: "On-the-ground presence and trusted relationships that drive repayment and sustainable growth.",
  },
  {
    icon: Award,
    title: "Impact reporting",
    desc: "Transparent metrics and regular reporting on social and financial outcomes.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero: one message, one primary action, a real photo. */}
      <section className="border-b border-border bg-surface">
        <div className="container-site grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-24">
          <div>
            <p className="eyebrow mb-4">Micro-credit for rural Mombasa</p>
            <h1 className="h-display">
              Fast, fair loans for chamas and small businesses.
            </h1>
            <p className="lead mt-6 max-w-xl">
              Affordable lending, debt advice and financial training for
              hardworking groups and individuals left behind by mainstream
              finance.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl">
                <a href="#products">
                  Apply for a loan
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

            <ul className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-[0.9375rem] font-medium text-foreground/85 sm:flex-row sm:flex-wrap sm:gap-x-8">
              {heroFacts.map((fact) => (
                <li key={fact.label} className="flex items-center gap-2.5">
                  <fact.icon
                    className="h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {fact.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <img
              src={photos.fieldVisit.src}
              alt={photos.fieldVisit.alt}
              width={photos.fieldVisit.width}
              height={photos.fieldVisit.height}
              // React 18 only passes the lowercase attribute through to the DOM.
              {...{ fetchpriority: "high" }}
              decoding="async"
              className="aspect-[5/4] w-full rounded-3xl object-cover shadow-xl shadow-secondary/10"
            />
            <p className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold italic text-primary shadow-sm">
              &ldquo;{site.tagline}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <Section id="products">
        <SectionHeading
          eyebrow="What we offer"
          title="Choose the support that fits you"
          lead="Tailored solutions for individuals and business groups."
        />
        <ul className="grid gap-5 md:grid-cols-2">
          {products.map((product) => (
            <li
              key={product.slug}
              className="card-site flex flex-col transition-shadow hover:shadow-lg hover:shadow-secondary/5"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <product.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {product.name}
              </h3>
              <p className="mt-3 flex-1 text-muted-foreground">
                {product.summary}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button asChild size="lg" className="px-5 font-semibold">
                  <Link to={`/products/${product.slug}#application-form`}>
                    {product.actionLabel}
                    <span className="sr-only"> — {product.name}</span>
                  </Link>
                </Button>
                <Link
                  to={`/products/${product.slug}`}
                  className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"
                >
                  How it works
                  <span className="sr-only"> — {product.name}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* How it works */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="How it works"
          title="Four simple steps to your loan"
        />
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
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

      {/* Why Mwamunda */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <img
            src={images.headOffice.src}
            srcSet={images.headOffice.srcSet}
            sizes="(min-width: 1024px) 520px, 100vw"
            alt="Inside the Mwamunda Investment Limited head office in Mombasa"
            width={800}
            height={800}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-3xl object-cover lg:aspect-square"
          />
          <div>
            <SectionHeading
              eyebrow="Why Mwamunda"
              title="A lender that knows your community"
              lead="We're dedicated to providing financial solutions that actually work for underserved communities."
              className="mb-8 md:mb-10"
            />
            <ul className="grid gap-6 sm:grid-cols-2">
              {reasons.map((reason) => (
                <li key={reason.title}>
                  <reason.icon
                    className="mb-3 h-6 w-6 text-primary"
                    aria-hidden="true"
                  />
                  <h3 className="h-card">{reason.title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] text-muted-foreground">
                    {reason.desc}
                  </p>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" size="lg" className="mt-8 px-5">
              <Link to="/about">
                About us
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Impact and client stories */}
      <Section tone="tint">
        <SectionHeading
          eyebrow="Our impact"
          title="Real impact for real people"
        />
        <dl className="grid gap-8 border-y border-primary/15 py-8 sm:grid-cols-3">
          {impact.map((item) => (
            <div key={item.label} className="flex flex-col-reverse gap-1">
              <dt className="text-[0.9375rem] font-medium text-muted-foreground">
                {item.label}
              </dt>
              <dd className="text-4xl font-bold tracking-tight text-primary tabular-nums md:text-5xl">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <figure className="mt-10 grid overflow-hidden rounded-3xl bg-white md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]">
          <img
            src={photos.sofiaAtieno.src}
            alt={photos.sofiaAtieno.alt}
            width={photos.sofiaAtieno.width}
            height={photos.sofiaAtieno.height}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] h-full w-full bg-muted object-cover object-top md:aspect-auto"
          />
          <div className="flex flex-col justify-center p-7 md:p-12">
            <blockquote className="text-xl font-medium leading-relaxed text-foreground md:text-2xl">
              &ldquo;{story.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6">
              <span className="block font-semibold text-foreground">
                {story.name}
              </span>
              <span className="text-[0.9375rem] text-muted-foreground">
                {story.detail}
              </span>
            </figcaption>
          </div>
        </figure>
      </Section>

      <PromotionalGallery />

      <PartnersSection />

      <SponsorHighlight />

      {/* Partners and funders */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="For funders and partners"
              title="Partner with us to create impact"
              lead="Join a growing network of impact investors and funders transforming rural financial inclusion."
              className="mb-8"
            />
            <Button asChild variant="secondary" size="xl">
              <Link to="/contact">
                Explore partnership
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <ul className="divide-y divide-border border-y border-border">
            {partnerPoints.map((point) => (
              <li key={point.title} className="flex gap-5 py-6">
                <point.icon
                  className="mt-1 h-6 w-6 shrink-0 text-secondary"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="h-card">{point.title}</h3>
                  <p className="mt-1.5 text-muted-foreground">{point.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand
        title="Ready to take control of your finances?"
        lead="Tell us what you need and our team will get back to you."
        primaryHref="#products"
      />
    </>
  );
}
