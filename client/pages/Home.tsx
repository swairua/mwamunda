import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Award,
  Target,
  LifeBuoy,
  BookOpen,
  Wallet,
  DollarSign,
  Briefcase,
  Heart,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import HeroSlider from "@/components/HeroSlider";
import OptimizedImage from "@/components/OptimizedImage";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      <Navigation />

      {/* Hero Section - Client Focused */}
      <section
        className="relative w-full h-96 md:h-screen overflow-hidden bg-white"
      >
        {/* Full width slider background - behind everything */}
        <div className="absolute inset-0 w-full h-full">
          <HeroSlider />
        </div>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl -top-20 -left-20 animate-float"></div>
          <div
            className="absolute w-96 h-96 bg-secondary/10 rounded-full blur-3xl -bottom-20 -right-20 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl animate-slide-in-left bg-white/15 backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-10 border border-white/20">
              <div className="inline-block mb-6 px-4 py-2 bg-white/30 backdrop-blur border border-white/40 rounded-full">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Fast, Flexible & Reliable
                </span>
              </div>

              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-6 leading-tight text-white">
                <span
                  className="inline-block animate-word-pop opacity-90"
                  style={{ animationDelay: "0.1s" }}
                >
                  Fast,
                </span>{" "}
                <span
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 animate-gradient-shift animate-word-pop font-extrabold opacity-90"
                  style={{ animationDelay: "0.2s" }}
                >
                  Flexible &
                </span>{" "}
                <span
                  className="inline-block animate-word-pop opacity-90"
                  style={{ animationDelay: "0.3s" }}
                >
                  Reliable Loans
                </span>{" "}
                <br className="hidden sm:block" />
                <span
                  className="inline-block animate-word-pop opacity-85"
                  style={{ animationDelay: "0.4s" }}
                >
                  for
                </span>{" "}
                <span
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-blue-200 animate-gradient-shift animate-word-pop font-extrabold opacity-90"
                  style={{ animationDelay: "0.5s" }}
                >
                  Chamas and Small
                </span>{" "}
                <span
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-green-200 animate-gradient-shift animate-word-pop font-extrabold opacity-90"
                  style={{ animationDelay: "0.6s" }}
                >
                  Businesses
                </span>{" "}
                <br className="hidden sm:block" />
                <span
                  className="inline-block animate-word-pop opacity-85"
                  style={{ animationDelay: "0.7s" }}
                >
                  in Rural
                </span>{" "}
                <span
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-green-200 via-blue-200 to-green-200 animate-gradient-shift animate-word-pop font-extrabold opacity-90"
                  style={{ animationDelay: "0.8s" }}
                >
                  Mombasa
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/85 mb-8 sm:mb-10 leading-relaxed max-w-2xl">
                Empowering hardworking groups and individuals through affordable
                lending, training, and financial inclusion. Mwamunda Investment
                Limited puts accessible financial solutions directly in the
                hands of those left behind by mainstream finance.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
                <Link
                  to="/contact"
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-white text-primary font-semibold text-sm sm:text-base hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group"
                >
                  Get Started Today
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/contact?type=partner"
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg border-2 border-white text-white font-semibold text-sm sm:text-base hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Become a Partner
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 sm:gap-8 md:gap-12 pt-6 sm:pt-8 border-t border-white/20">
                <div
                  className="animate-slide-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="text-3xl sm:text-4xl font-bold text-white">
                    2019
                  </div>
                  <p className="text-xs sm:text-sm text-white/70">Founded</p>
                </div>
                <div
                  className="animate-slide-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="text-3xl sm:text-4xl font-bold text-blue-200">
                    Rural
                  </div>
                  <p className="text-xs sm:text-sm text-white/70">
                    Community Focus
                  </p>
                </div>
                <div
                  className="animate-slide-in-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="text-3xl sm:text-4xl font-bold text-green-200">
                    100s
                  </div>
                  <p className="text-xs sm:text-sm text-white/70">
                    Business Empowered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Mwamunda - Client Benefits */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Why Choose Mwamunda?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              We're dedicated to providing financial solutions that actually
              work for underserved communities
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: <Shield className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Trusted Partner",
                description:
                  "Established micro-credit institution with proven track record in communities across Kenya",
              },
              {
                icon: <Users className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Community Focused",
                description:
                  "We understand the unique needs of micro and small businesses and farmers",
              },
              {
                icon: <Zap className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Fast Approval",
                description:
                  "Quick processing and affordable terms designed for those excluded by mainstream finance",
              },
              {
                icon: <Award className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Expert Team",
                description:
                  "Experienced board members in investment, microfinance, and product development",
              },
              {
                icon: <Target className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Field Agents",
                description:
                  "Our dedicated agents are eager to serve you across every county in Kenya",
              },
              {
                icon: <CheckCircle className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Accessible",
                description:
                  "Honest, affordable financial products for those ignored by predatory lenders",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-5 sm:p-6 md:p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 animate-slide-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section - Client Solutions */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Our Financial Products
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Tailored solutions for individuals and business groups
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 lg:gap-12">
            <div className="group rounded-3xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 animate-slide-in-left">
              <div className="h-40 sm:h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 transition-all duration-300">
                <Users className="w-16 sm:w-24 h-16 sm:h-24 text-primary/40 group-hover:text-primary/60 transition-colors" />
              </div>
              <div className="p-5 sm:p-6 md:p-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                  Fair Personal Loans
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-5 sm:mb-6 leading-relaxed">
                  Affordable personal loans designed for individuals without
                  access to mainstream finance. Quick approval process with
                  terms that work for you.
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {[
                    "Quick approval process",
                    "Affordable interest rates",
                    "Flexible repayment terms",
                    "Debt advice support",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-foreground"
                    >
                      <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-secondary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/products/fair-personal-loans"
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all group/link"
                >
                  Learn More
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="group rounded-3xl overflow-hidden border border-border hover:border-secondary/50 transition-all duration-300 animate-slide-in-right">
              <div className="h-40 sm:h-48 bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center group-hover:from-secondary/30 transition-all duration-300">
                <Target className="w-16 sm:w-24 h-16 sm:h-24 text-secondary/40 group-hover:text-secondary/60 transition-colors" />
              </div>
              <div className="p-5 sm:p-6 md:p-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                  Chama Loans
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-5 sm:mb-6 leading-relaxed">
                  Specialized financing for business groups and cooperatives.
                  Perfect for groups looking to scale operations and support
                  collective growth.
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {[
                    "Group-focused financing",
                    "Capacity building support",
                    "Training programs included",
                    "Competitive rates",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-foreground"
                    >
                      <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-secondary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/products/chama-loans"
                  className="inline-flex items-center gap-2 text-secondary font-semibold text-sm hover:gap-3 transition-all group/link"
                >
                  Learn More
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="group rounded-3xl overflow-hidden border border-border hover:border-blue-500/50 transition-all duration-300 animate-slide-in-left">
              <div className="h-40 sm:h-48 bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center group-hover:from-blue-500/30 transition-all duration-300">
                <LifeBuoy className="w-16 sm:w-24 h-16 sm:h-24 text-blue-500/40 group-hover:text-blue-500/60 transition-colors" />
              </div>
              <div className="p-5 sm:p-6 md:p-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                  Debt Advice Services
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-5 sm:mb-6 leading-relaxed">
                  Expert guidance and support to help you manage and overcome
                  debt challenges. Our advisors provide personalized strategies
                  to improve your financial health.
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {[
                    "Expert debt counseling",
                    "Personalized repayment plans",
                    "Financial health assessment",
                    "Ongoing guidance and support",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-foreground"
                    >
                      <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/products/debt-advice-services"
                  className="inline-flex items-center gap-2 text-blue-500 font-semibold text-sm hover:gap-3 transition-all group/link"
                >
                  Learn More
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="group rounded-3xl overflow-hidden border border-border hover:border-amber-500/50 transition-all duration-300 animate-slide-in-right">
              <div className="h-40 sm:h-48 bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center group-hover:from-amber-500/30 transition-all duration-300">
                <BookOpen className="w-16 sm:w-24 h-16 sm:h-24 text-amber-500/40 group-hover:text-amber-500/60 transition-colors" />
              </div>
              <div className="p-5 sm:p-6 md:p-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                  Financial Capability Training
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-5 sm:mb-6 leading-relaxed">
                  Comprehensive training programs designed to build financial
                  literacy and empower individuals with essential money
                  management skills for sustainable success.
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {[
                    "Money management basics",
                    "Budgeting and savings strategies",
                    "Investment fundamentals",
                    "Financial planning workshops",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-foreground"
                    >
                      <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-amber-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/products/financial-capability-training"
                  className="inline-flex items-center gap-2 text-amber-500 font-semibold text-sm hover:gap-3 transition-all group/link"
                >
                  Learn More
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              What drives us every day in serving our communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Integrity",
                desc: "Honest work aligned with company values",
              },
              {
                title: "Accountability",
                desc: "Expert team committed to your success",
              },
              {
                title: "Service Excellence",
                desc: "Proactive and responsive to client needs",
              },
              {
                title: "Innovation",
                desc: "New ideas and methods for better solutions",
              },
              {
                title: "Teamwork",
                desc: "Combined expertise reaching goals faster",
              },
              {
                title: "Value to All",
                desc: "Positive returns for all stakeholders",
              },
            ].map((value, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border hover:border-primary/30 transition-all duration-300 animate-slide-in-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work Section - Client Journey */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Expert Support Every Step of the Way
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our dedicated team of financial experts is committed to
                understanding your unique needs and providing personalized
                solutions tailored to your goals.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/20">
                      <span className="text-xl">💼</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Professional Guidance
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Expert advice from industry professionals
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary/20">
                      <span className="text-xl">⚡</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Fast Processing
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Quick turnaround on applications and approvals
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent/20">
                      <span className="text-xl">🤝</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Ongoing Support
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Continuous assistance throughout your journey
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Explore Our Services
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="relative w-full h-96 md:h-full min-h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl"></div>
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <OptimizedImage
                    src="https://cdn.builder.io/api/v1/image/assets%2F675a5c01881345b88968fcdd971866d7%2F502cbced94e140d6805e025fba6f1bde?format=webp&width=800"
                    alt="Expert team member providing financial guidance"
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                    placeholderColor="bg-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Impact & Success Statistics Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Real Impact for Real People
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Measurable outcomes that show how our clients are transforming
              their lives
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: <Users className="w-10 h-10" />,
                stat: "100s",
                label: "Businesses Empowered",
                color: "text-primary",
                bgColor: "bg-primary/10",
              },
              {
                icon: <DollarSign className="w-10 h-10" />,
                stat: "Millions",
                label: "in Loans Disbursed",
                color: "text-secondary",
                bgColor: "bg-secondary/10",
              },
              {
                icon: <TrendingUp className="w-10 h-10" />,
                stat: "95%+",
                label: "Repayment Rate",
                color: "text-green-600",
                bgColor: "bg-green-500/10",
              },
              {
                icon: <Heart className="w-10 h-10" />,
                stat: "2019",
                label: "Years of Service",
                color: "text-amber-600",
                bgColor: "bg-amber-500/10",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all animate-slide-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div
                  className={`w-14 h-14 rounded-lg ${item.bgColor} ${item.color} flex items-center justify-center mx-auto mb-4`}
                >
                  {item.icon}
                </div>
                <div className={`text-3xl font-bold ${item.color} mb-2`}>
                  {item.stat}
                </div>
                <p className="text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real people, real results. See how Mwamunda is transforming lives
              across Kenya
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-left">
              <OptimizedImage
                src="https://cdn.builder.io/api/v1/image/assets%2F675a5c01881345b88968fcdd971866d7%2Fd97c126d37b6465db10ea02f935cf545?format=webp&width=800"
                alt="Happy customers"
                className="w-full h-64 object-cover"
                containerClassName="w-full h-64"
                placeholderColor="bg-gray-300"
              />
              <div className="p-6 bg-white">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">
                  "Mwamunda gave us the financial support we needed to expand
                  our business. The process was quick and transparent."
                </p>
                <p className="font-semibold text-foreground">
                  Small Business Owner
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-up">
              <OptimizedImage
                src="https://cdn.builder.io/api/v1/image/assets%2F675a5c01881345b88968fcdd971866d7%2Fb1889c4d9f5545cc9ffaf6474b456ef1?format=webp&width=800"
                alt="Celebration of success"
                className="w-full h-64 object-cover"
                containerClassName="w-full h-64"
                placeholderColor="bg-gray-300"
              />
              <div className="p-6 bg-white">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">
                  "With fair rates and helpful support, we've been able to grow
                  sustainably. Highly recommended!"
                </p>
                <p className="font-semibold text-foreground">Entrepreneur</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-right">
              <OptimizedImage
                src="https://cdn.builder.io/api/v1/image/assets%2F675a5c01881345b88968fcdd971866d7%2Fe02d9fa55b634777b9da5ef97090d668?format=webp&width=800"
                alt="Team success"
                className="w-full h-64 object-cover"
                containerClassName="w-full h-64"
                placeholderColor="bg-gray-300"
              />
              <div className="p-6 bg-white">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">
                  "Unlike predatory lenders, Mwamunda's transparent approach and
                  genuine care for our success stands out."
                </p>
                <p className="font-semibold text-foreground">Group Lender</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Opportunities Section - Moved After Success Stories */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Partner With Us to Create Impact
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join a growing network of impact investors and funders
              transforming rural financial inclusion
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16">
            <div className="animate-slide-in-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6">
                Why Fund Mwamunda?
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Proven Track Record
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Operating since 2019 with expanding reach and 100s of
                      businesses empowered across rural communities
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <Target className="w-5 sm:w-6 h-5 sm:h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Underserved Market
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Access billions in untapped potential by serving
                      communities excluded by mainstream finance
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <Users className="w-5 sm:w-6 h-5 sm:h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Community Deep Roots
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      On-the-ground presence and trusted relationships that
                      drive repayment and sustainable growth
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <Award className="w-5 sm:w-6 h-5 sm:h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Experienced Leadership
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Expert team with deep expertise in microfinance,
                      investment, and community development
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/contact?type=partner"
                className="inline-flex items-center gap-2 mt-8 px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm sm:text-base hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1 group"
              >
                Explore Partnership Opportunities
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="animate-slide-in-right">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  {
                    value: "100s",
                    label: "Businesses Empowered",
                    colorClass: "text-secondary",
                    borderColor: "hover:border-secondary/30",
                  },
                  {
                    value: "2019",
                    label: "Year Founded",
                    colorClass: "text-accent",
                    borderColor: "hover:border-accent/30",
                  },
                  {
                    value: "Rural",
                    label: "Community Focus",
                    colorClass: "text-blue-600",
                    borderColor: "hover:border-blue-500/30",
                  },
                  {
                    value: "95%+",
                    label: "Repayment Rate",
                    colorClass: "text-green-600",
                    borderColor: "hover:border-green-500/30",
                  },
                ].map((metric, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-6 sm:p-8 bg-white border border-border ${metric.borderColor} transition-all duration-300`}
                  >
                    <div
                      className={`text-3xl sm:text-4xl font-bold ${metric.colorClass} mb-2`}
                    >
                      {metric.value}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: <CheckCircle className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Funding Partnerships",
                description:
                  "Flexible funding structures aligned with your investment thesis and social impact goals",
              },
              {
                icon: <Briefcase className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Grant Opportunities",
                description:
                  "Access grant funding for expansion, training programs, and community development initiatives",
              },
              {
                icon: <Zap className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Corporate Partnerships",
                description:
                  "Collaborate with corporate sponsors to enhance social responsibility and market reach",
              },
              {
                icon: <Shield className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Impact Reporting",
                description:
                  "Transparent metrics and regular reporting on social and financial outcomes",
              },
              {
                icon: <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Growth Potential",
                description:
                  "Scale your impact by supporting expansion into new markets and product lines",
              },
              {
                icon: <Award className="w-6 sm:w-8 h-6 sm:h-8" />,
                title: "Strategic Advisory",
                description:
                  "Partner with experienced leaders in microfinance and community development",
              },
            ].map((opportunity, idx) => (
              <div
                key={idx}
                className="group p-5 sm:p-6 md:p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 animate-slide-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {opportunity.icon}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2 sm:mb-3">
                  {opportunity.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  {opportunity.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary/80 opacity-90"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -right-48 animate-float"></div>
          <div
            className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -bottom-48 -left-48 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-slide-in-down">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-slide-in-up">
            Join thousands of individuals and businesses who've transformed
            their financial future with Mwamunda Investment Limited.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              to="/contact"
              className="px-8 py-4 rounded-lg bg-white text-primary font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group"
            >
              Contact Us Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/about"
              className="px-8 py-4 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Explore Our Story
            </Link>
          </div>
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
                info@mwamunda.com
              </p>
              <p className="text-white/70 text-sm">
                <strong>Phone:</strong>
                <br />
                0106673939 / 0784222284
                <br />
                0708192783
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              &copy; 2024 Mwamunda Investment Limited. All rights reserved.
            </p>
            <div className="w-32 h-32 flex-shrink-0">
              <OptimizedImage
                src="https://cdn.builder.io/api/v1/image/assets%2Fecd881b9839d489c99097337eb57ad39%2F1da28dee14084b3eafccf531eeb65e9a?format=webp&width=800"
                alt="24/7 Customer Service"
                className="w-full h-full object-contain"
                containerClassName="w-full h-full"
                placeholderColor="bg-gray-700"
              />
            </div>
            <Link
              to="/admin/login"
              className="px-4 py-2 rounded-lg bg-white/20 text-white text-sm font-semibold hover:bg-white/30 transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
