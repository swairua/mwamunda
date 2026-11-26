import { founder, team, teamGallery } from "@/content/team";
import { Section, SectionHeading } from "./Section";

/** Founder feature, team cards and a short "life at Mwamunda" gallery. */
export default function TeamSection() {
  return (
    <>
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          <img
            src={founder.photo}
            alt={founder.photoAlt}
            width={720}
            height={900}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full max-w-md rounded-3xl bg-muted object-cover object-top"
          />
          <div>
            <p className="eyebrow mb-3">{founder.role}</p>
            <h2 className="h-section">Meet {founder.name}</h2>
            <blockquote className="mt-6 border-l-4 border-primary pl-5 text-xl font-medium leading-snug text-foreground md:text-2xl">
              &ldquo;{founder.quote}&rdquo;
            </blockquote>
            <p className="lead mt-6">{founder.bio}</p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {founder.values.map((value) => (
                <li
                  key={value}
                  className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground"
                >
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Our people"
          title="Meet our team"
          lead="Dedicated professionals committed to empowering your business. Our board of directors brings a wealth of experience in investment, microfinance, product development and treasury management."
        />
        <ul className="grid gap-6 md:grid-cols-2">
          {team.map((member) => (
            <li
              key={member.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card sm:flex-row"
            >
              <img
                src={member.photo}
                alt={member.photoAlt}
                width={480}
                height={600}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full bg-muted object-cover object-top sm:w-2/5 sm:shrink-0"
              />
              <div className="flex flex-1 flex-col p-6 md:p-7">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {member.name}
                </h3>
                <p className="mt-1 font-medium text-primary">{member.role}</p>
                <p className="mt-4 italic text-muted-foreground">
                  &ldquo;{member.quote}&rdquo;
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {member.expertise.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {member.values.join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="h-card mt-14">Life at Mwamunda</h3>
        <p className="mt-1 text-muted-foreground">
          Our team in the office, in the field, and with the communities we
          serve.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {teamGallery.map((photo) => (
            <li key={photo.src}>
              <img
                src={photo.src}
                alt={photo.alt}
                width={640}
                height={480}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full rounded-2xl bg-muted object-cover"
              />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
