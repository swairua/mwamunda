/** The main sponsor, called out on its own (from the live site). */
export default function SponsorHighlight() {
  return (
    <section className="bg-background">
      <div className="container-site pb-16 md:pb-20">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-primary/15 bg-accent px-6 py-8 text-center md:flex-row md:text-left">
          <img
            src="/sponsor/bulkit-solutions.png"
            alt="BULKIT Solutions logo"
            loading="lazy"
            decoding="async"
            className="h-16 w-40 shrink-0 object-contain md:w-48"
          />
          <div>
            <p className="eyebrow mb-1">Proudly supported by</p>
            <h2 className="text-xl font-bold text-foreground md:text-2xl">
              BULKIT Solutions
            </h2>
            <p className="mt-1 text-muted-foreground">
              Our valued sponsor, partnering with Mwamunda to expand financial
              inclusion in rural communities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
