import { useState } from "react";
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { submitApplication, ProductType } from "@/lib/applications";
import { submitContact } from "@/lib/contacts";
import { useToast } from "@/hooks/use-toast";

interface ApplicationFormProps {
  productType: ProductType;
  productName: string;
  onSuccess?: () => void;
}

export default function ApplicationForm({
  productType,
  productName,
  onSuccess,
}: ApplicationFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    national_id: "",
    date_of_birth: "",
    residential_address: "",
    business_type: "",
    business_name: "",
    business_registration: "",
    monthly_income: "",
    requested_amount: "",
    loan_purpose: "",
    employment_status: "employed",
    nearest_branch: "",
    bank_account: "",
    bank_name: "",
    additional_info: "",
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
      // Validation
      if (!formData.full_name.trim()) {
        throw new Error("Full name is required");
      }
      if (!formData.email.trim()) {
        throw new Error("Email is required");
      }
      if (!formData.phone.trim()) {
        throw new Error("Phone number is required");
      }
      if (!formData.residential_address.trim()) {
        throw new Error("Residential address is required");
      }
      if (!formData.employment_status) {
        throw new Error("Employment status is required");
      }

      await submitApplication({
        product_type: productType,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        national_id: formData.national_id,
        date_of_birth: formData.date_of_birth,
        residential_address: formData.residential_address,
        business_type: formData.business_type,
        business_name: formData.business_name,
        business_registration: formData.business_registration,
        monthly_income: formData.monthly_income
          ? parseFloat(formData.monthly_income)
          : undefined,
        requested_amount: formData.requested_amount
          ? parseFloat(formData.requested_amount)
          : undefined,
        loan_purpose: formData.loan_purpose,
        employment_status: formData.employment_status,
        nearest_branch: formData.nearest_branch,
        bank_account: formData.bank_account,
        bank_name: formData.bank_name,
        additional_info: formData.additional_info,
      });

      setSubmitted(true);
      toast({
        title: "Success",
        description: "Your application has been submitted successfully!",
      });

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          setSubmitted(false);
          setFormData({
            full_name: "",
            email: "",
            phone: "",
            national_id: "",
            date_of_birth: "",
            residential_address: "",
            business_type: "",
            business_name: "",
            business_registration: "",
            monthly_income: "",
            requested_amount: "",
            loan_purpose: "",
            employment_status: "employed",
            nearest_branch: "",
            bank_account: "",
            bank_name: "",
            additional_info: "",
          });
        }
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit application";
      setError(errorMessage);
      console.error("Error submitting application:", err);
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
          Application Submitted!
        </h3>
        <p className="text-muted-foreground mb-4">
          Thank you for applying for {productName}. We'll review your
          application and contact you within 24-48 hours.
        </p>
        <p className="text-sm text-muted-foreground">
          Check your email for confirmation of your application.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-8">
      <h2 className="text-3xl font-bold text-foreground mb-2">
        {productName} Application
      </h2>
      <p className="text-muted-foreground mb-8">
        Complete this form to apply for {productName}. All fields marked with *
        are required.
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
        {/* Personal Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Personal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                National ID
              </label>
              <input
                type="text"
                name="national_id"
                value={formData.national_id}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Residential Address *
              </label>
              <input
                type="text"
                name="residential_address"
                value={formData.residential_address}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Employment Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Employment Status *
              </label>
              <select
                name="employment_status"
                value={formData.employment_status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Monthly Income (KES)
              </label>
              <input
                type="number"
                name="monthly_income"
                value={formData.monthly_income}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Business Type
              </label>
              <input
                type="text"
                name="business_type"
                value={formData.business_type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Retail, Services, Manufacturing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Business Name
              </label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Business Registration Number
              </label>
              <input
                type="text"
                name="business_registration"
                value={formData.business_registration}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Loan/Product Details */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {productName} Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Requested Amount (KES)
              </label>
              <input
                type="number"
                name="requested_amount"
                value={formData.requested_amount}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nearest Branch
              </label>
              <input
                type="text"
                name="nearest_branch"
                value={formData.nearest_branch}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Mombasa CBD, Diani"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Loan Purpose
              </label>
              <textarea
                name="loan_purpose"
                value={formData.loan_purpose}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Banking Information */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Banking Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Bank Name
              </label>
              <input
                type="text"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Bank Account Number
              </label>
              <input
                type="text"
                name="bank_account"
                value={formData.bank_account}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Additional Information
          </label>
          <textarea
            name="additional_info"
            value={formData.additional_info}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Any additional information you'd like us to know?"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
          {isLoading ? "Submitting..." : "Submit Application"}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}
