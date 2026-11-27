import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { submitContact } from "@/lib/contacts";
import { site } from "@/lib/site";
import { useToast } from "@/hooks/use-toast";
import OptimizedImage from "@/components/OptimizedImage";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await submitContact(formData);
      setSubmitted(true);
      toast({
        title: "Success",
        description: "Your message has been sent successfully!",
      });
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      console.error("Error submitting contact:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-14 md:pt-20 pb-12 sm:pb-16 border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="h-page mb-5">Get In Touch</h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Reach out to our team
              today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-20">
            {/* Email */}
            <div className="text-center p-5 sm:p-6 md:p-8 rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-accent text-primary flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Mail className="w-5 sm:w-6 h-5 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">
                Email
              </h3>
              <a
                href={`mailto:${site.email}`}
                className="text-primary hover:underline mb-2 block text-xs sm:text-sm break-all"
              >
                {site.email}
              </a>
              <a
                href={`mailto:${site.customerCareEmail}`}
                className="text-primary hover:underline block text-xs sm:text-sm break-all"
              >
                {site.customerCareEmail}
              </a>
              <p className="text-muted-foreground text-xs sm:text-sm mt-3 sm:mt-4">
                We'll respond within 24 hours
              </p>
            </div>

            {/* Phone */}
            <div className="text-center p-5 sm:p-6 md:p-8 rounded-2xl border border-border hover:border-secondary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-accent text-primary flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Phone className="w-5 sm:w-6 h-5 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4">
                Phone & WhatsApp
              </h3>
              <div className="space-y-2">
                {site.phones.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="text-primary hover:underline block font-semibold text-base"
                  >
                    {phone.display}
                  </a>
                ))}
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm mt-3 sm:mt-4">
                Call / SMS / WhatsApp anytime
              </p>
            </div>

            {/* Address */}
            <div className="text-center p-5 sm:p-6 md:p-8 rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-accent text-primary flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <MapPin className="w-5 sm:w-6 h-5 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4">
                Head Office Mombasa
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Edrines Plaza, Ground Floor
                <br />
                <strong className="text-foreground">PO BOX 964</strong>
              </p>
            </div>

            {/* Working hours */}
            <div className="text-center p-5 sm:p-6 md:p-8 rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-accent text-primary flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Clock className="w-5 sm:w-6 h-5 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 sm:mb-4">
                Working Hours
              </h3>
              <dl className="space-y-2 text-sm text-muted-foreground">
                {site.hours.map((slot) => (
                  <div key={slot.days}>
                    <dt className="inline font-semibold text-foreground">
                      {slot.days}:
                    </dt>{" "}
                    <dd className="inline">{slot.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Send Us a Message
            </h2>
            <p className="text-lg text-muted-foreground">
              Fill out the form below and we'll get back to you as soon as
              possible
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {submitted && (
              <div className="p-6 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-900">
                    Message Sent!
                  </h4>
                  <p className="text-sm text-green-700">
                    Thank you for reaching out. We'll be in touch shortly.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-6 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900">Error</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-semibold text-foreground mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="contact-name"
                  autoComplete="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-semibold text-foreground mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="contact-email"
                  autoComplete="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="contact-phone"
                  className="block text-sm font-semibold text-foreground mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="contact-phone"
                  autoComplete="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="+254 7XX XXX XXX"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-sm font-semibold text-foreground mb-2"
                >
                  Subject *
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  <option value="">Select a subject</option>
                  <option value="personal-loan">Personal Loan Inquiry</option>
                  <option value="chama-loan">Chama Loan Inquiry</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="general">General Inquiry</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Message *
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                placeholder="Tell us how we can help..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
            >
              {isLoading ? "Sending..." : "Send Message"}
              {!isLoading && (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-8">
            * Required fields
          </p>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-12 sm:py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-8 sm:mb-12">
            Why Get In Touch?
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                title: "Loan Inquiries",
                desc: "Whether you're interested in a personal loan or chama loan, our team can guide you through the process",
              },
              {
                title: "Schedule a Visit",
                desc: "Request a visit from one of our field agents or arrange to visit a branch office near you",
              },
              {
                title: "Partnerships",
                desc: "Interested in partnering with us? We'd love to explore opportunities together",
              },
              {
                title: "Debt Advice",
                desc: "Struggling with debt? Our financial advisors can help you develop a better strategy",
              },
              {
                title: "Capacity Building",
                desc: "Learn about our training programs and financial capability services",
              },
              {
                title: "Business Support",
                desc: "Get expert advice on growing your business with our microfinance solutions",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
