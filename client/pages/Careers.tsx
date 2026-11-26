import { useState, useEffect } from "react";
import { Mail, Phone, Briefcase, MapPin } from "lucide-react";
import WhatsAppIcon from "@/components/site/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { teamGallery } from "@/content/team";
import { apiFetch, getApiUrl } from "@/lib/config";
import { site } from "@/lib/site";

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
    <>
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-14 md:pt-20 pb-12 sm:pb-16 border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="h-page mb-5">Careers at Mwamunda</h1>
            <p className="lead max-w-2xl mx-auto">
              Join our team and be part of our mission to provide financial
              solutions for the underserved.
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
        ) : error || careers.length === 0 ? (
          // No roles posted yet (or the list could not be loaded): keep the
          // page useful instead of showing an empty or error message.
          <div className="py-4">
            <div className="rounded-3xl border border-border bg-surface p-8 md:p-12">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Briefcase className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="h-section">No open positions right now</h2>
              <p className="lead mt-4 max-w-2xl">
                New roles are posted on this page as they open. To introduce
                yourself in the meantime, email us your CV and tell us the kind
                of role you are looking for.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl">
                  <a
                    href={`mailto:${site.email}?subject=${encodeURIComponent("Career enquiry")}`}
                  >
                    <Mail aria-hidden="true" />
                    Email your CV
                  </a>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <a href={site.whatsapp.href} target="_blank" rel="noreferrer">
                    <WhatsAppIcon />
                    Ask on WhatsApp
                  </a>
                </Button>
              </div>
              <p className="mt-5 text-[0.9375rem] text-muted-foreground">
                {site.email} · {site.phones[0].display}
              </p>
            </div>

            <h2 className="h-card mt-14">Life at Mwamunda</h2>
            <p className="mt-1 text-muted-foreground">
              Our team in the office, in the field, and with the communities we
              serve.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {teamGallery.map((photo) => (
                <li key={photo.src}>
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    width={640}
                    height={480}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full rounded-2xl bg-muted object-cover"
                  />
                </li>
              ))}
            </ul>
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
    </>
  );
}
