import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  Zap,
  Award,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import ProductContactForm from "@/components/ProductContactForm";
import OptimizedImage from "@/components/OptimizedImage";

export default function ChamaLoans() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-secondary/10 rounded-full blur-3xl top-20 left-10 animate-float"></div>
          <div
            className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl bottom-20 right-10 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
            <div className="inline-block mb-6 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full">
              <span className="text-sm font-semibold text-secondary">
                👥 Chama Loans
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Group Financing for Collective
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                {" "}
                Growth
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Specialized financing solutions for business groups and
              cooperatives. Scale your operations together with competitive
              rates and comprehensive support.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#application-form"
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-gradient-to-r from-secondary to-primary text-white font-semibold text-sm sm:text-base hover:shadow-xl hover:shadow-secondary/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                Apply Now
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <Link
                to="/"
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg border-2 border-secondary text-secondary font-semibold text-sm sm:text-base hover:bg-secondary/5 transition-all duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Benefits of Chama Loans
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empowering groups to achieve more together
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {[
              {
                icon: Users,
                title: "Group-Focused Financing",
                desc: "Loans designed specifically for business groups, cooperatives, and Chama associations.",
              },
              {
                icon: TrendingUp,
                title: "Capacity Building Support",
                desc: "We invest in your group's growth with mentorship and strategic guidance.",
              },
              {
                icon: Award,
                title: "Training Programs Included",
                desc: "Access to financial literacy and business management training for all members.",
              },
              {
                icon: Zap,
                title: "Competitive Rates",
                desc: "Special group rates that reward collective borrowing and shared responsibility.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl bg-gradient-to-br from-secondary/5 to-primary/5 border border-border hover:border-secondary/30 transition-all duration-300 animate-slide-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <feature.icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Chama Loan Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Streamlined approval for groups
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Group Registration",
                desc: "Register your group with Mwamunda with all required documentation.",
              },
              {
                step: "2",
                title: "Assessment",
                desc: "We assess your group's financial health and business potential.",
              },
              {
                step: "3",
                title: "Loan Structuring",
                desc: "Customize loan terms based on your group's specific needs.",
              },
              {
                step: "4",
                title: "Disbursement",
                desc: "Receive funds directly to your group's account for immediate use.",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative animate-slide-in-up">
                <div className="bg-white rounded-xl p-6 border border-border h-full">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-secondary to-primary text-white font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
            Group Requirements
          </h2>

          <ul className="space-y-4">
            {[
              "Minimum of 5 registered members",
              "Valid group registration documents",
              "Group bank account",
              "Members must be 18 years or older",
              "Group business plan or income source",
              "Group leadership structure",
              "Meeting minutes from past meetings",
            ].map((req, idx) => (
              <li
                key={idx}
                className="flex items-start gap-4 p-4 rounded-lg bg-blue-50/50 border border-blue-200/30"
              >
                <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                <span className="text-lg text-foreground">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Application Form Section */}
      <section
        id="application-form"
        className="py-12 sm:py-16 md:py-20 bg-white scroll-mt-20"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Apply for a Chama Loan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fill out the form below to submit your group application. We
              review all applications within 24-48 hours.
            </p>
          </div>

          <ProductContactForm productName="Chama Loans" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-secondary/80 opacity-90"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -right-48 animate-float"></div>
          <div
            className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -bottom-48 -left-48 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-slide-in-down">
            Questions? Get in Touch
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto animate-slide-in-up">
            Our team is here to help. Contact us for more information about
            Chama Loans.
          </p>

          <a
            href="#application-form"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-secondary font-semibold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
          >
            Apply Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
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
