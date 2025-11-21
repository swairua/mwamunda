import { useState } from "react";
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { submitContact } from "@/lib/contacts";
import { useToast } from "@/hooks/use-toast";

interface ProductContactFormProps {
  productName: string;
}

export default function ProductContactForm({
  productName,
}: ProductContactFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      await submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `${productName} Inquiry`,
        message: formData.message,
      });

      setSubmitted(true);
      toast({
        title: "Success",
        description: "Your inquiry has been submitted successfully!",
      });

      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit inquiry";
      setError(errorMessage);
      console.error("Error submitting inquiry:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Inquiry Submitted!
        </h3>
        <p className="text-muted-foreground mb-4">
          Thank you for your interest in {productName}. We'll review your
          inquiry and contact you within 24-48 hours.
        </p>
        <p className="text-sm text-muted-foreground">
          Check your email for confirmation of your inquiry.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-8">
      <h2 className="text-3xl font-bold text-foreground mb-2">
        {productName} Inquiry
      </h2>
      <p className="text-muted-foreground mb-8">
        Fill out the form below with your inquiry about {productName}. We'll get
        back to you within 24-48 hours.
      </p>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900">Error</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            placeholder="+254 7XX XXX XXX"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
            placeholder="Tell us about your interest in this product..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100"
        >
          {isLoading ? "Sending..." : "Send Inquiry"}
          {!isLoading && (
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          * Required fields
        </p>
      </form>
    </div>
  );
}
