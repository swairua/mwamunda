import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APPLY_HREF, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import WhatsAppIcon from "./WhatsAppIcon";

type Tone = "default" | "surface" | "tint";

const toneClass: Record<Tone, string> = {
  default: "bg-background",
  surface: "bg-surface",
  tint: "bg-surface-strong",
};

interface SectionProps {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  className?: string;
  containerClassName?: string;
}

/** A full-width band with the site container inside. */
export function Section({
  children,
  tone = "default",
  id,
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("section scroll-mt-24", toneClass[tone], className)}
    >
      <div className={cn("container-site", containerClassName)}>{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 max-w-2xl md:mb-14",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="h-section">{title}</h2>
      {lead && <p className="lead mt-4">{lead}</p>}
    </div>
  );
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}

/** Text-led hero used on inner pages. */
export function PageHero({ eyebrow, title, lead, children }: PageHeroProps) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="container-site py-14 md:py-20">
        <div className="max-w-3xl">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="h-page">{title}</h1>
          {lead && <p className="lead mt-5">{lead}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}

interface CtaBandProps {
  title: string;
  lead?: string;
  primaryLabel?: string;
  primaryHref?: string;
}

/** Closing call to action: one primary action plus WhatsApp. */
export function CtaBand({
  title,
  lead,
  primaryLabel = "Apply for a loan",
  primaryHref = APPLY_HREF,
}: CtaBandProps) {
  const isHash = primaryHref.startsWith("#");
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-site flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between md:py-20">
        <div className="max-w-2xl">
          <h2 className="h-section text-white">{title}</h2>
          {lead && (
            <p className="mt-3 text-lg leading-relaxed text-white/85">{lead}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button asChild variant="inverse" size="xl">
            {isHash ? (
              <a href={primaryHref}>
                {primaryLabel}
                <ArrowRight aria-hidden="true" />
              </a>
            ) : (
              <Link to={primaryHref}>
                {primaryLabel}
                <ArrowRight aria-hidden="true" />
              </Link>
            )}
          </Button>
          <Button asChild variant="outlineInverse" size="xl">
            <a href={site.whatsapp.href} target="_blank" rel="noreferrer">
              <WhatsAppIcon />
              Chat on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
