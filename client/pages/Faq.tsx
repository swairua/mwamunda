import { ChevronDown } from "lucide-react";
import { CtaBand, PageHero, Section } from "@/components/site/Section";
import { faqs } from "@/content/faq";

export default function Faq() {
  return (
    <>
      <PageHero
        eyebrow="Help"
        title="Frequently asked questions"
        lead="Answers to the questions we hear most from clients, partners and prospective borrowers."
      />

      <Section containerClassName="max-w-3xl">
        {/* Native <details> keeps every answer in the page HTML and works without scripts. */}
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                <h2 className="text-lg font-semibold">{faq.question}</h2>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-6 pr-10 text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Still have a question?"
        lead="Our team is happy to help you find the right financial solution."
        primaryLabel="Contact us"
        primaryHref="/contact"
      />
    </>
  );
}
