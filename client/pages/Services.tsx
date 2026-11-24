import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Shield,
  BookOpen,
  LifeBuoy,
  Target,
  Award,
  Zap,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import OptimizedImage from "@/components/OptimizedImage";

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slide-in-down">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
              Our Services
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive financial solutions designed to empower individuals
              and businesses in underserved communities
            </p>
          </div>
        </div>
      </section>

      {/* Fair Personal Loans Service */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="animate-slide-in-left">
              <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-primary font-semibold text-sm">
                  Individual Empowerment
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Fair Personal Loans
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Affordable personal loans designed for individuals who lack
                access to mainstream financial institutions. We believe everyone
                deserves a fair chance at financial growth.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Quick Approval Process
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Get approved within days, not months
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Affordable Interest Rates
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Competitive rates that work for your budget
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Flexible Repayment Terms
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Customized payment schedules to fit your income
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Debt Advice Support
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Expert guidance to help manage your finances
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-white font-semibold hover:shadow-xl transition-all group"
              >
                Apply Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="animate-slide-in-right">
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-2xl"></div>
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <OptimizedImage
                    src="https://cdn.builder.io/api/v1/image/assets%2F675a5c01881345b88968fcdd971866d7%2F854295e8b1354678a9547323638bb78b?format=webp&width=800"
                    alt="Person discussing personal loan options"
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                    placeholderColor="bg-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Process Section */}
          <div className="bg-blue-50/50 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
              How It Works
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Apply",
                  description: "Fill out a simple application form",
                },
                {
                  step: "2",
                  title: "Assessment",
                  description: "We evaluate your financial situation",
                },
                {
                  step: "3",
                  title: "Approval",
                  description: "Quick decision on your loan request",
                },
                {
                  step: "4",
                  title: "Disbursement",
                  description: "Funds transferred to your account",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="text-center animate-slide-in-up"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chama Loans Service */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left order-2 md:order-1">
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-3xl blur-2xl"></div>
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <OptimizedImage
                    src="https://cdn.builder.io/api/v1/image/assets%2F675a5c01881345b88968fcdd971866d7%2Fea9ae454497b46a5bcfe898a56afcb89?format=webp&width=800"
                    alt="Business group discussing financing options"
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                    placeholderColor="bg-gray-200"
                  />
                </div>
              </div>
            </div>

            <div className="animate-slide-in-right order-1 md:order-2">
              <div className="inline-block mb-4 px-4 py-2 bg-secondary/10 rounded-full">
                <span className="text-secondary font-semibold text-sm">
                  Group Financing
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Chama Loans
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Specialized financing solutions for business groups,
                cooperatives, and community-based organizations. Scale your
                collective impact with structured support and training.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex gap-3">
                  <Users className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Group-Focused Financing
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Tailored to cooperative and business group structures
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Award className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Capacity Building Support
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Training programs to strengthen group management
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <TrendingUp className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Competitive Rates
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Volume discounts for larger group borrowing
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Target className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Growth-Oriented Terms
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Loans designed to help scale your business
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-secondary text-white font-semibold hover:shadow-xl transition-all group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Debt Advice Services */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="animate-slide-in-left">
              <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 rounded-full">
                <span className="text-blue-600 font-semibold text-sm">
                  Expert Guidance
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Debt Advice Services
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Professional counseling and financial guidance to help you
                manage debt challenges and build a stronger financial
                foundation. Our advisors work with you to create personalized
                solutions.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex gap-3">
                  <LifeBuoy className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Expert Debt Counseling
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      One-on-one sessions with certified advisors
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Target className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Personalized Repayment Plans
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Strategies designed for your specific situation
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Financial Health Assessment
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive analysis of your finances
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Ongoing Support
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Continuous guidance throughout your journey
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-blue-600 text-white font-semibold hover:shadow-xl transition-all group"
              >
                Schedule Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="animate-slide-in-right">
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-3xl blur-2xl"></div>
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <OptimizedImage
                    src="https://cdn.builder.io/api/v1/image/assets%2F675a5c01881345b88968fcdd971866d7%2Fb1889c4d9f5545cc9ffaf6474b456ef1?format=webp&width=800"
                    alt="Financial advisor providing guidance"
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

      {/* Financial Capability Training */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left order-2 md:order-1">
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-500/5 rounded-3xl blur-2xl"></div>
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <OptimizedImage
                    src="https://cdn.builder.io/api/v1/image/assets%2F675a5c01881345b88968fcdd971866d7%2Fd97c126d37b6465db10ea02f935cf545?format=webp&width=800"
                    alt="Training session with participants"
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                    placeholderColor="bg-gray-200"
                  />
                </div>
              </div>
            </div>

            <div className="animate-slide-in-right order-1 md:order-2">
              <div className="inline-block mb-4 px-4 py-2 bg-amber-500/10 rounded-full">
                <span className="text-amber-600 font-semibold text-sm">
                  Empowerment Programs
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Financial Capability Training
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Comprehensive training programs designed to build financial
                literacy and empower individuals and groups with essential money
                management skills for sustainable success.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex gap-3">
                  <BookOpen className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Money Management Basics
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Essential skills for handling personal finances
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Zap className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Budgeting & Savings Strategies
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Practical tools to save and grow wealth
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <TrendingUp className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Investment Fundamentals
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Basics of growing your money through smart investing
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Target className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Financial Planning Workshops
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Long-term planning for your family's future
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-amber-600 text-white font-semibold hover:shadow-xl transition-all group"
              >
                Enroll Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Comparison */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Which Service Is Right For You?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compare our services to find the perfect fit for your financial
              goals
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-4 font-semibold text-foreground">
                    Feature
                  </th>
                  <th className="py-4 px-4 font-semibold text-primary">
                    Personal Loans
                  </th>
                  <th className="py-4 px-4 font-semibold text-secondary">
                    Chama Loans
                  </th>
                  <th className="py-4 px-4 font-semibold text-blue-600">
                    Debt Advice
                  </th>
                  <th className="py-4 px-4 font-semibold text-amber-600">
                    Training
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Quick Approval",
                    personal: true,
                    chama: true,
                    debt: false,
                    training: false,
                  },
                  {
                    feature: "Expert Guidance",
                    personal: true,
                    chama: true,
                    debt: true,
                    training: true,
                  },
                  {
                    feature: "Flexible Terms",
                    personal: true,
                    chama: true,
                    debt: false,
                    training: false,
                  },
                  {
                    feature: "Group Support",
                    personal: false,
                    chama: true,
                    debt: false,
                    training: true,
                  },
                  {
                    feature: "Training Included",
                    personal: false,
                    chama: true,
                    debt: false,
                    training: true,
                  },
                  {
                    feature: "Debt Management",
                    personal: true,
                    chama: true,
                    debt: true,
                    training: false,
                  },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold text-foreground">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.personal ? (
                        <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.chama ? (
                        <CheckCircle className="w-5 h-5 text-secondary mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.debt ? (
                        <CheckCircle className="w-5 h-5 text-blue-600 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.training ? (
                        <CheckCircle className="w-5 h-5 text-amber-600 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Services?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              What sets us apart from other financial service providers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Community-Trusted",
                description:
                  "Established micro-credit institution with years of experience serving rural and underserved communities",
                colorClass: "text-primary",
                bgClass: "bg-primary/10",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Personalized Approach",
                description:
                  "We understand your unique situation and tailor our services to your specific needs",
                colorClass: "text-secondary",
                bgClass: "bg-secondary/10",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Fast & Efficient",
                description:
                  "Streamlined processes that get you results quickly without sacrificing quality",
                colorClass: "text-blue-600",
                bgClass: "bg-blue-500/10",
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Expert Team",
                description:
                  "Experienced professionals with deep knowledge of microfinance and financial inclusion",
                colorClass: "text-amber-600",
                bgClass: "bg-amber-500/10",
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Transparent Pricing",
                description:
                  "Clear, honest terms with no hidden fees or surprise charges",
                colorClass: "text-green-600",
                bgClass: "bg-green-500/10",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Growth-Focused",
                description:
                  "Our goal is your success—we provide tools and support for sustainable growth",
                colorClass: "text-purple-600",
                bgClass: "bg-purple-500/10",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all animate-slide-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div
                  className={`w-14 h-14 rounded-lg ${item.bgClass} ${item.colorClass} flex items-center justify-center mb-4`}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
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
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-slide-in-down">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-slide-in-up">
            Choose the service that fits your needs and take the first step
            toward financial empowerment.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              to="/contact"
              className="px-8 py-4 rounded-lg bg-white text-primary font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group"
            >
              Contact Us Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/"
              className="px-8 py-4 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Back to Home
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
          </div>
        </div>
      </footer>
    </div>
  );
}
