import { Link } from "react-router-dom";
import { ArrowRight, Target, Eye, Heart } from "lucide-react";
import TeamSection from "@/components/site/TeamSection";

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-12 border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="h-page mb-5">About Mwamunda</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A trusted microcredit institution empowering micro and small
              businesses across Kenya since 2019
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Who We Are
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                We offer a range of financial products and services designed to
                meet the needs of people who are financially excluded. We are
                committed to providing high quality products and services that
                are affordable and accessible.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Wherever possible we work in partnership with other companies
                and agencies that share our goals. Most of our customers are
                ignored by the mainstream financial services industry and
                exploited by the sub-prime financial services industry.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                <strong className="text-primary">Our ultimate success</strong>{" "}
                will be when we have helped to put the loan sharks and predatory
                lenders out of business, ensuring that everyone has access to
                fair and honest financial services.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all group"
              >
                Get In Touch
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="animate-slide-in-right">
              <div className="bg-accent rounded-3xl p-12 h-96 flex flex-col justify-center border border-primary/20">
                <div className="space-y-6">
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">
                      2019
                    </div>
                    <p className="text-muted-foreground">Year Founded</p>
                  </div>
                  <div className="h-0.5 w-12 bg-primary"></div>
                  <p className="text-foreground leading-relaxed">
                    Founded with the mission to economically empower micro and
                    small businesses that face operational challenges,
                    especially in relation to finances.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Overview */}
          <div className="bg-surface-strong rounded-3xl p-12 mb-12 border border-primary/10">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Our Journey & Impact
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  As a microcredit institution, we understand that small
                  businesses face operational challenges especially in relation
                  to finances. Therefore, we help these businesses commercialize
                  products that meet the needs of clients while adapting the
                  services and products in a way that allows the business to
                  compete favorably in a versatile business environment.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We also support farmers and agribusiness actors through
                  training, capacity building and provision of financial
                  services. We are passionate about supporting economically
                  active individuals realize their goals of growing their
                  business and farming enterprises – however small these may be.
                </p>
              </div>

              <div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We have established our institution as a trusted micro lender
                  in the communities where we are present, and have built a name
                  for supporting smallholder farmers especially in the dairy
                  sector.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our board of directors has members who are experienced in
                  investment, microfinance, product development and treasury
                  management. This wealth of knowledge and experience helps us
                  serve these businesses and help them compete favorably in the
                  business landscape of Kenya.
                </p>
              </div>
            </div>
          </div>

          {/* Presence Section */}
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Our Presence
            </h3>
            <p className="text-xl text-muted-foreground mb-8">
              We have many field agents eager to serve you. We have offices in
              every county.
            </p>
            <p className="text-lg text-primary font-semibold">
              Contact us to schedule a visit from one of our agents, or visit a
              Branch office near you.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-accent text-primary flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Our Mission
              </h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              To provide a differentiated financial service experience to our
              clients, a rewarding employment experience to our staff and a
              positive impact in the communities we serve. We deliver innovative
              financial solutions to small and mid-size businesses that are
              often underserved in the formal and informal sector.
            </p>
          </div>

          {/* Vision */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-accent text-accent-foreground flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Our Vision</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              To be the financing partner of choice in the markets where we
              operate. We believe that businesses should have equal
              opportunities to access financial products. Therefore, we position
              ourselves as one of the most reliable financial and advisory
              service organizations.
            </p>
          </div>

          {/* Values */}
          <div className="animate-slide-in-left">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-accent text-primary flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Our Core Values
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Integrity",
                  desc: "As a microcredit institution, we are honest in our work and stay aligned with the values of our company.",
                },
                {
                  title: "Accountability",
                  desc: "We have an accountable team of experts that contribute to our success and that of the businesses we serve.",
                },
                {
                  title: "Service Excellence",
                  desc: "Mwamunda Investment is proactive and responsive to the needs of our clients to ensure satisfaction and top notch results.",
                },
                {
                  title: "Innovation",
                  desc: "Mwamunda believes in new ideas, practices and methods to help enhance product and service provision.",
                },
                {
                  title: "Teamwork",
                  desc: "Our strength lies in combined expertise and ability to trust each other. We help businesses reach goals faster and more efficiently.",
                },
                {
                  title: "Value to All Stakeholders",
                  desc: "We believe all stakeholders should experience highest returns. Shareholders, employees, community and businesses all benefit positively.",
                },
              ].map((value, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-border hover:border-primary/50 bg-white hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TeamSection />

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-primary"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Partner With Us?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join the growing network of businesses and individuals who trust
            Mwamunda Investment Limited
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-primary font-semibold hover:shadow-xl transition-all group"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
