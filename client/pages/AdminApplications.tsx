import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  ChevronDown,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";
import { getStoredUser, logoutUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";
import {
  getAllApplications,
  updateApplicationStatus,
  addAdminNotes,
  deleteApplication,
  Application,
} from "@/lib/applications";

export default function AdminApplications() {
  const navigate = useNavigate();
  const { toast } = useToast();
  // Read once: a fresh object on every render would re-run the effects
  // below in a loop, re-fetching without end.
  const currentUser = useMemo(() => getStoredUser(), []);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [approvalAmount, setApprovalAmount] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterProduct, setFilterProduct] = useState<string>("all");

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/admin/login");
    }
  }, [currentUser, navigate]);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const fetchedApplications = await getAllApplications();
        setApplications(fetchedApplications);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch applications";
        console.error("Error fetching applications:", error);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleLogout = async () => {
    await logoutUser();
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    navigate("/admin/login");
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setAdminNotes(application.admin_notes || "");
    setShowDetails(true);
  };

  const handleApproveClick = (application: Application) => {
    setSelectedApplication(application);
    setApprovalAmount(application.approved_amount?.toString() || "");
    setShowApprovalModal(true);
  };

  const handleRejectClick = (application: Application) => {
    setSelectedApplication(application);
    setRejectionReason(application.rejection_reason || "");
    setShowRejectionModal(true);
  };

  const handleApprove = async () => {
    if (!selectedApplication || !approvalAmount) {
      toast({
        title: "Error",
        description: "Please enter an approval amount",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateApplicationStatus(
        selectedApplication.id!,
        "approved",
        parseFloat(approvalAmount),
      );
      setApplications(
        applications.map((app) =>
          app.id === selectedApplication.id
            ? {
                ...app,
                status: "approved",
                approved_amount: parseFloat(approvalAmount),
              }
            : app,
        ),
      );
      setShowApprovalModal(false);
      setApprovalAmount("");
      toast({
        title: "Success",
        description: "Application approved successfully",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to approve application";
      console.error("Error approving application:", error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedApplication || !rejectionReason) {
      toast({
        title: "Error",
        description: "Please enter a rejection reason",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateApplicationStatus(selectedApplication.id!, "rejected");
      await addAdminNotes(selectedApplication.id!, rejectionReason);
      setApplications(
        applications.map((app) =>
          app.id === selectedApplication.id
            ? { ...app, status: "rejected", admin_notes: rejectionReason }
            : app,
        ),
      );
      setShowRejectionModal(false);
      setRejectionReason("");
      toast({
        title: "Success",
        description: "Application rejected successfully",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reject application";
      console.error("Error rejecting application:", error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApplication) return;

    try {
      await addAdminNotes(selectedApplication.id!, adminNotes);
      setApplications(
        applications.map((app) =>
          app.id === selectedApplication.id
            ? { ...app, admin_notes: adminNotes }
            : app,
        ),
      );
      setShowDetails(false);
      toast({
        title: "Success",
        description: "Notes saved successfully",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save notes";
      console.error("Error saving notes:", error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteApplication = async (id: number) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      await deleteApplication(id);
      setApplications(applications.filter((app) => app.id !== id));
      toast({
        title: "Success",
        description: "Application deleted successfully",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete application";
      console.error("Error deleting application:", error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filterStatus !== "all" && app.status !== filterStatus) return false;
    if (filterProduct !== "all" && app.product_type !== filterProduct)
      return false;
    return true;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar onLogout={handleLogout} userName={currentUser.name} />

      {/* Main Content */}
      <div className="flex-1">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Loan Applications
              </h1>
              <p className="text-white/90">
                Manage and review loan applications
              </p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Total Applications
                  </p>
                  <p className="text-4xl font-bold text-primary mt-2">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Pending
                  </p>
                  <p className="text-4xl font-bold text-yellow-600 mt-2">
                    {stats.pending}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Approved
                  </p>
                  <p className="text-4xl font-bold text-green-600 mt-2">
                    {stats.approved}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Rejected
                  </p>
                  <p className="text-4xl font-bold text-red-600 mt-2">
                    {stats.rejected}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Filter by Product
                </label>
                <select
                  value={filterProduct}
                  onChange={(e) => setFilterProduct(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Products</option>
                  <option value="fair-personal-loans">
                    Fair Personal Loans
                  </option>
                  <option value="chama-loans">Chama Loans</option>
                  <option value="debt-advice-services">
                    Debt Advice Services
                  </option>
                  <option value="financial-capability-training">
                    Financial Capability Training
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-gray-50">
              <h2 className="text-2xl font-bold text-foreground">
                Applications
              </h2>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No applications found
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredApplications.map((application) => (
                      <tr
                        key={application.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-foreground">
                            {application.full_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {application.email}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-foreground">
                            {application.product_type
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1),
                              )
                              .join(" ")}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(application.status)}`}
                          >
                            {getStatusIcon(application.status)}
                            {(application.status || "pending")
                              .charAt(0)
                              .toUpperCase() +
                              (application.status || "pending").slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-foreground">
                            {application.requested_amount
                              ? `KES ${application.requested_amount.toLocaleString()}`
                              : "-"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              application.created_at || "",
                            ).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleViewApplication(application)}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-muted-foreground hover:text-foreground"
                              title="View details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            {application.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleApproveClick(application)
                                  }
                                  className="p-2 rounded-lg hover:bg-green-50 transition-colors text-muted-foreground hover:text-green-600"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleRejectClick(application)}
                                  className="p-2 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
                                  title="Reject"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() =>
                                handleDeleteApplication(application.id!)
                              }
                              className="p-2 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {showDetails && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 animate-fade-in my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Application Details
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground font-medium">
                        Full Name
                      </p>
                      <p className="text-foreground">
                        {selectedApplication.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">Email</p>
                      <p className="text-foreground">
                        {selectedApplication.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">Phone</p>
                      <p className="text-foreground">
                        {selectedApplication.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">
                        National ID
                      </p>
                      <p className="text-foreground">
                        {selectedApplication.national_id || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Application Details */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Application Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground font-medium">
                        Product
                      </p>
                      <p className="text-foreground">
                        {selectedApplication.product_type
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">
                        Status
                      </p>
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedApplication.status)}`}
                      >
                        {getStatusIcon(selectedApplication.status)}
                        {(selectedApplication.status || "pending")
                          .charAt(0)
                          .toUpperCase() +
                          (selectedApplication.status || "pending").slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">
                        Requested Amount
                      </p>
                      <p className="text-foreground">
                        {selectedApplication.requested_amount
                          ? `KES ${selectedApplication.requested_amount.toLocaleString()}`
                          : "-"}
                      </p>
                    </div>
                    {selectedApplication.approved_amount && (
                      <div>
                        <p className="text-muted-foreground font-medium">
                          Approved Amount
                        </p>
                        <p className="text-foreground">
                          KES{" "}
                          {selectedApplication.approved_amount.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address & Employment */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Address & Employment
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground font-medium">
                        Residential Address
                      </p>
                      <p className="text-foreground">
                        {selectedApplication.residential_address || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">
                        Employment Status
                      </p>
                      <p className="text-foreground">
                        {selectedApplication.employment_status || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">
                        Monthly Income
                      </p>
                      <p className="text-foreground">
                        {selectedApplication.monthly_income
                          ? `KES ${selectedApplication.monthly_income.toLocaleString()}`
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                {selectedApplication.business_name && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      Business Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground font-medium">
                          Business Name
                        </p>
                        <p className="text-foreground">
                          {selectedApplication.business_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium">
                          Business Type
                        </p>
                        <p className="text-foreground">
                          {selectedApplication.business_type || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSaveNotes}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:shadow-lg transition-all"
                >
                  Save Notes
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approval Modal */}
        {showApprovalModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Approve Application
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Approved Amount (KES) *
                </label>
                <input
                  type="number"
                  value={approvalAmount}
                  onChange={(e) => setApprovalAmount(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter approved amount"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:shadow-lg transition-all"
                >
                  Approve
                </button>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-border text-foreground font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectionModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Reject Application
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reason for Rejection *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Explain why this application is being rejected"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:shadow-lg transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-border text-foreground font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
