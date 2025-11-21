import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { apiFetch, getApiUrl } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";

interface Career {
  id?: number;
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
  validity_start_date: string;
  validity_end_date: string;
  status: string;
}

export default function AdminCareers() {
  const { toast } = useToast();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Career>({
    position_title: "",
    department: "",
    description: "",
    qualifications: "",
    responsibilities: "",
    job_type: "",
    experience_level: "",
    application_email: "",
    application_phone: "",
    validity_start_date: new Date().toISOString().split("T")[0],
    validity_end_date: "",
    status: "active",
  });

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await apiFetch(`${getApiUrl()}?table=careers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch careers");
      }

      const data = await response.json();
      setCareers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching careers:", err);
      toast({
        title: "Error",
        description: "Failed to load career positions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.validity_end_date) {
      toast({
        title: "Error",
        description: "Validity end date is required",
        variant: "destructive",
      });
      return;
    }

    try {
      let response;

      if (editingId) {
        response = await apiFetch(getApiUrl(), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            table: "careers",
            id: editingId,
            data: formData,
          }),
        });
      } else {
        response = await apiFetch(getApiUrl(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            table: "careers",
            data: formData,
          }),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save career");
      }

      await response.json();

      toast({
        title: "Success",
        description: editingId
          ? "Career position updated successfully"
          : "Career position posted successfully",
      });

      setShowForm(false);
      setEditingId(null);
      setFormData({
        position_title: "",
        department: "",
        description: "",
        qualifications: "",
        responsibilities: "",
        job_type: "",
        experience_level: "",
        application_email: "",
        application_phone: "",
        validity_start_date: new Date().toISOString().split("T")[0],
        validity_end_date: "",
        status: "active",
      });

      await fetchCareers();
    } catch (err) {
      console.error("Error saving career:", err);
      toast({
        title: "Error",
        description: "Failed to save career position",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (career: Career) => {
    setFormData(career);
    setEditingId(career.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this position?")) return;

    try {
      const response = await apiFetch(`${getApiUrl()}?table=careers&id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete career");
      }

      toast({
        title: "Success",
        description: "Career position deleted successfully",
      });

      await fetchCareers();
    } catch (err) {
      console.error("Error deleting career:", err);
      toast({
        title: "Error",
        description: "Failed to delete career position",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      position_title: "",
      department: "",
      description: "",
      qualifications: "",
      responsibilities: "",
      job_type: "",
      experience_level: "",
      application_email: "",
      application_phone: "",
      validity_start_date: new Date().toISOString().split("T")[0],
      validity_end_date: "",
      status: "active",
    });
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Career Positions</h1>
          <p className="text-muted-foreground mt-2">
            Manage and post career opportunities
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Post New Position
          </button>
        )}
      </div>

      {/* Post/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-border p-8 space-y-6">
          <h2 className="text-2xl font-bold">
            {editingId ? "Edit Career Position" : "Post New Career Position"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Position Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.position_title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      position_title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g., Sales Officer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g., Sales, Marketing"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Job Type
                </label>
                <select
                  value={formData.job_type}
                  onChange={(e) =>
                    setFormData({ ...formData, job_type: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Experience Level
                </label>
                <select
                  value={formData.experience_level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experience_level: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select level</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Position Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Describe the position and its key responsibilities"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Qualifications * (one per line)
              </label>
              <textarea
                required
                value={formData.qualifications}
                onChange={(e) =>
                  setFormData({ ...formData, qualifications: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="List qualifications, each on a new line&#10;• Business degree&#10;• 5 years experience&#10;• Strong communication skills"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Responsibilities (one per line)
              </label>
              <textarea
                value={formData.responsibilities}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    responsibilities: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="List main responsibilities, each on a new line"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Application Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.application_email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      application_email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="careers@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Application Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.application_phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      application_phone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Validity Start Date
                </label>
                <input
                  type="date"
                  value={formData.validity_start_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      validity_start_date: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Validity End Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.validity_end_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      validity_end_date: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                {editingId ? "Update Position" : "Post Position"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-muted text-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Careers List */}
      {!showForm && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading positions...</p>
            </div>
          ) : careers.length === 0 ? (
            <div className="bg-muted rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No career positions posted yet
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                Post First Position
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {careers.map((career) => (
                <div
                  key={career.id}
                  className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground">
                            {career.position_title}
                          </h3>
                          <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                            {career.department && (
                              <span className="bg-muted px-2 py-1 rounded">
                                {career.department}
                              </span>
                            )}
                            {career.job_type && (
                              <span className="bg-muted px-2 py-1 rounded">
                                {career.job_type}
                              </span>
                            )}
                            {career.experience_level && (
                              <span className="bg-muted px-2 py-1 rounded">
                                {career.experience_level}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {career.status === "active" ? (
                            isExpired(career.validity_end_date) ? (
                              <span className="flex items-center gap-1 text-orange-600 text-sm font-medium">
                                <AlertCircle className="w-4 h-4" />
                                Expired
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                <CheckCircle className="w-4 h-4" />
                                Active
                              </span>
                            )
                          ) : (
                            <span className="text-gray-500 text-sm font-medium">
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {career.description}
                      </p>

                      <div className="mt-3 text-sm text-muted-foreground">
                        <span className="font-medium">Apply: </span>
                        {career.application_email} | {career.application_phone}
                      </div>

                      {career.validity_end_date && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span className="font-medium">Valid until: </span>
                          {new Date(
                            career.validity_end_date,
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(career)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => career.id && handleDelete(career.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
