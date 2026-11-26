import { Link } from "react-router-dom";
import { ArrowRight, Target, Eye, Heart } from "lucide-react";
import Navigation from "@/components/Navigation";
import OptimizedImage from "@/components/OptimizedImage";

const teamGallery = [
  {
    src: "/team/gallery-team-bench.jpg",
    alt: "Mwamunda team on a community visit",
  },
  {
    src: "/team/gallery-brand-banner.jpg",
    alt: "Mwamunda team in front of the company banner",
  },
  {
    src: "/team/gallery-field-visit.jpg",
    alt: "Mwamunda staff on a field visit",
    objectClass: "object-top",
  },
  {
    src: "/team/gallery-desk-portrait.jpg",
    alt: "Mwamunda team serving clients at the branch",
    objectClass: "object-top",
  },
  {
    src: "/team/staffatwork.jpeg",
    alt: "Mwamunda staff serving clients in the community",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-28 pb-12 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slide-in-down">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              About Mwamunda
            </h1>
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:shadow-lg hover:shadow-primary/40 transition-all group"
              >
                Get In Touch
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-12 h-96 flex flex-col justify-center border border-primary/20">
                <div className="space-y-6">
                  <div>
                    <div className="text-4xl font-bold text-primary mb-2">
                      2019
                    </div>
                    <p className="text-muted-foreground">Year Founded</p>
                  </div>
                  <div className="h-0.5 w-12 bg-gradient-to-r from-primary to-secondary"></div>
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
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl p-12 mb-12 animate-fade-in border border-primary/10">
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
          <div className="mb-12 text-center animate-slide-in-up">
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
      <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission */}
          <div className="mb-12 animate-slide-in-left">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
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
          <div className="mb-12 animate-slide-in-right">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center">
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
              <div className="w-12 h-12 rounded-lg bg-accent/20 text-accent flex items-center justify-center">
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
                  className="p-6 rounded-xl border border-border hover:border-primary/50 bg-white hover:shadow-lg transition-all duration-300 animate-slide-in-up"
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

      {/* Founder Spotlight */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="animate-slide-in-left">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                Founder &amp; CEO
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet Elias Karisa Baya PhD CBS
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                "Your Trusted Partner in Business &amp; Financial Growth"
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                As founder and CEO of Mwamunda Investment Limited, Dr. Baya leads
                our mission to deliver microfinance services, savings and loans,
                and practical financial solutions to businesses and
                entrepreneurs across Kenya.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Integrity", "Transparency", "Trust"].map((value) => (
                  <span
                    key={value}
                    className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary"
                  >
                    {value}
                  </span>
                ))}
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>0789 698 601</p>
                <p>customercare@mwamunda.co.ke</p>
                <p>P.O. Box 964, Mombasa</p>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <OptimizedImage
                src="/team/karisa-poster.jpg"
                alt="Elias Karisa Baya PhD CBS, Founder and CEO of Mwamunda Investment Limited"
                className="w-full h-auto rounded-2xl shadow-xl"
                containerClassName="w-full"
                placeholderColor="bg-gray-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dedicated professionals committed to empowering your business
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto mt-3">
              Our board of directors brings wealth of experience in investment,
              microfinance, product development and treasury management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-left">
              <OptimizedImage
                src="/team/elias-karisa-baya.jpg"
                alt="Elias Karisa Baya PhD CBS, Founder and CEO of Mwamunda Investment Limited"
                className="w-full h-80 object-contain object-center"
                containerClassName="w-full h-80"
                placeholderColor="bg-gray-300"
              />
              <div className="p-6 bg-white">
                <h3 className="font-semibold text-foreground mb-1">
                  Elias Karisa Baya PhD CBS
                </h3>
                <p className="text-sm font-medium text-primary mb-3">
                  Founder &amp; CEO, Mwamunda Investment Limited
                </p>
                <p className="text-sm italic text-muted-foreground mb-4">
                  "Your Trusted Partner in Business &amp; Financial Growth"
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    "Microfinance Services",
                    "Savings & Loans",
                    "Financial Solutions",
                  ].map((service) => (
                    <span
                      key={service}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {service}
                    </span>
                  ))}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Integrity · Transparency · Trust
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  0789 698 601 · customercare@mwamunda.co.ke · P.O. Box 964,
                  Mombasa
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-up">
              <OptimizedImage
                src="/team/neema.jpeg"
                alt="Antonnina Neema, Human Resource Manager at Mwamunda Investment Limited"
                className="w-full h-80 object-contain object-center"
                containerClassName="w-full h-80"
                placeholderColor="bg-gray-300"
              />
              <div className="p-6 bg-white">
                <h3 className="font-semibold text-foreground mb-1">
                  Antonnina Neema
                </h3>
                <p className="text-sm font-medium text-primary mb-3">
                  Human Resource Manager, Mwamunda Investment Limited
                </p>
                <p className="text-sm italic text-muted-foreground mb-4">
                  "People are our greatest asset"
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    "Human Resources",
                    "Recruitment",
                    "Employee Relations",
                  ].map((service) => (
                    <span
                      key={service}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {service}
                    </span>
                  ))}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Dedication · Professionalism · Growth
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  0789 698 601 · customercare@mwamunda.co.ke
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-up">
              <OptimizedImage
                src="/team/staffatwork.jpeg"
                alt="Staff at work, Mwamunda Investment Limited"
                className="w-full h-80 object-contain object-center"
                containerClassName="w-full h-80"
                placeholderColor="bg-gray-300"
              />
              <div className="p-6 bg-white">
                <h3 className="font-semibold text-foreground mb-1">
                  Team at Work
                </h3>
                <p className="text-sm text-muted-foreground">
                  Serving our clients with excellence
                </p>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Team Gallery */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Life at Mwamunda
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our team in the office, in the field, and with the communities we
              serve
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {teamGallery.map((photo, index) => (
              <div
                key={photo.src}
                className={`group relative h-56 overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl md:h-72 ${
                  index === 0 ? "md:col-span-2" : ""
                }`}
              >
                <OptimizedImage
                  src={photo.src}
                  alt={photo.alt}
                  className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    photo.objectClass ?? ""
                  }`}
                  containerClassName="h-full w-full"
                  placeholderColor="bg-gray-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -right-48 animate-float"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-slide-in-down">
            Ready to Partner With Us?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join the growing network of businesses and individuals who trust
            Mwamunda Investment Limited
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-primary font-semibold hover:shadow-xl transition-all transform hover:scale-105 group"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/95 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="mb-4">
                <OptimizedImage
                  src="https://cdn.builder.io/api/v1/image/assets%2F675a5c01881345b88968fcdd971866d7%2F7e6019eab478401686a679312028d4e8?format=webp&width=800"
                  alt="Mwamunda Investment Limited"
                  className="h-32 w-auto"
                  containerClassName="h-32 w-auto"
                  placeholderColor="bg-gray-700"
                />
              </div>
              <p className="text-white/70 text-sm">
                Financial solutions for the underserved since 2019
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Products</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/products/fair-personal-loans"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Fair Personal Loans
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products/chama-loans"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Chama Loans
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products/debt-advice-services"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Debt Advice Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products/financial-capability-training"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Financial Capability Training
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <p className="text-white/70 text-sm mb-3">
                <strong>Email:</strong>
                <br />
                <a href="mailto:info@mwamunda.co.ke" className="hover:text-white">info@mwamunda.co.ke</a>
                <br />
                <a href="mailto:customercare@mwamunda.co.ke" className="hover:text-white">customercare@mwamunda.co.ke</a>
              </p>
              <p className="text-white/70 text-sm">
                <strong>Phone:</strong>
                <br />
                Safaricom: Corporate line pending
                <br />
                Airtel: <a href="tel:+254789698601" className="hover:text-white">0789698601</a>
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex items-center justify-between">
            <p className="text-white/60 text-sm">
              &copy; 2024 Mwamunda Investment Limited. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
