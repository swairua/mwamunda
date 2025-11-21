import { useState, useEffect } from "react";
import { Mail, Phone, Briefcase, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import { apiFetch, getApiUrl } from "@/lib/config";

interface Career {
  id: number;
  position_title: string;
  department: string;
  description: string;
  qualifications: string;
  responsibilities?: string;
  job_type?: string;
  experience_level?: string;
  application_email: string;
  application_phone: string;
  image_url?: string;
  validity_start_date?: string;
  validity_end_date?: string;
  status?: string;
  created_at?: string;
}

export default function Careers() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await apiFetch(`${getApiUrl()}?table=careers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch careers: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const activeCareers = data.filter((career: Career) => {
            if (career.status !== "active") return false;
            if (career.validity_end_date) {
              return new Date(career.validity_end_date) >= new Date();
            }
            return true;
          });
          setCareers(activeCareers);
        }
      } catch (err) {
        console.error("Error fetching careers:", err);
        setError("Unable to load career positions");
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slide-in-down">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              We're Hiring
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our team and be part of our mission to provide financial solutions for the underserved.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">
              Loading career positions...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
            {error}
          </div>
        ) : careers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No open positions at the moment. Please check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              OPEN POSITIONS:
            </h2>

            {careers.map((career) => (
              <div
                key={career.id}
                className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-8">
                  {/* Job Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      {career.position_title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      {career.department && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {career.department}
                        </div>
                      )}
                      {career.job_type && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {career.job_type}
                        </div>
                      )}
                      {career.experience_level && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {career.experience_level}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-2">
                      Position Overview
                    </h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {career.description}
                    </p>
                  </div>

                  {/* Qualifications */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3">
                      Qualifications
                    </h4>
                    <ul className="space-y-2">
                      {career.qualifications.split("\n").map(
                        (qual, index) =>
                          qual.trim() && (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-muted-foreground"
                            >
                              <span className="text-primary font-bold mt-1">
                                •
                              </span>
                              <span>{qual.trim()}</span>
                            </li>
                          ),
                      )}
                    </ul>
                  </div>

                  {/* Responsibilities */}
                  {career.responsibilities && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3">
                        Responsibilities
                      </h4>
                      <ul className="space-y-2">
                        {career.responsibilities.split("\n").map(
                          (resp, index) =>
                            resp.trim() && (
                              <li
                                key={index}
                                className="flex items-start gap-3 text-muted-foreground"
                              >
                                <span className="text-primary font-bold mt-1">
                                  •
                                </span>
                                <span>{resp.trim()}</span>
                              </li>
                            ),
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Application Info */}
                  <div className="border-t border-border pt-6 mt-6">
                    <h4 className="font-semibold text-foreground mb-4">
                      Send your application to:
                    </h4>

                    {career.application_email && (
                      <a
                        href={`mailto:${career.application_email}`}
                        className="inline-flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors mb-4 w-full md:w-auto justify-center md:justify-start"
                      >
                        <Mail className="w-5 h-5" />
                        {career.application_email}
                      </a>
                    )}

                    {career.application_phone && (
                      <div className="flex items-center gap-3 text-foreground font-semibold mt-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <span>TEL {career.application_phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Validity Info */}
                  {career.validity_end_date && (
                    <div className="mt-4 text-sm text-muted-foreground">
                      Application deadline:{" "}
                      {new Date(career.validity_end_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
