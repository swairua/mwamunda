import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import { initApplicationsTable } from "@/lib/applications";
import { useToast } from "@/hooks/use-toast";

export default function AdminInitApplications() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleInitialize = async () => {
    setLoading(true);
    setStatus("loading");
    setMessage("Initializing applications table...");

    try {
      const response = await initApplicationsTable();

      if (response.success) {
        setStatus("success");
        setMessage("Applications table created successfully!");
        toast({
          title: "Success",
          description: "Applications table initialized",
        });
        setTimeout(() => {
          navigate("/admin/applications");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(
          response.message || response.error || "Failed to initialize",
        );
        toast({
          title: "Error",
          description:
            response.message || response.error || "Initialization failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred during initialization");
      toast({
        title: "Error",
        description: "An error occurred during initialization",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Setup Applications</h1>
            <p className="text-white/90">
              Initialize the applications database
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Welcome!
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Before you can manage applications, we need to set up the
                database table. Click the button below to initialize the
                applications table.
              </p>
            </div>

            {status !== "idle" && (
              <div className="mb-8 p-4 rounded-lg border">
                {status === "loading" && (
                  <div className="flex items-center gap-3 text-blue-600">
                    <Loader className="w-5 h-5 animate-spin" />
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                )}
                {status === "success" && (
                  <div className="flex items-center gap-3 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                )}
                {status === "error" && (
                  <div className="flex items-center gap-3 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                )}
              </div>
            )}

            {status === "idle" || status === "error" ? (
              <div className="space-y-4">
                <button
                  onClick={handleInitialize}
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Initializing..." : "Initialize Database"}
                </button>

                <a href="/admin/dashboard">
                  <button
                    type="button"
                    className="w-full py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-all duration-300"
                  >
                    Go to Dashboard
                  </button>
                </a>
              </div>
            ) : status === "success" ? (
              <div className="space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  Redirecting to applications...
                </p>
                <button
                  onClick={() => navigate("/admin/applications")}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/40 transition-all duration-300"
                >
                  Go to Applications
                </button>
              </div>
            ) : null}

            {/* Footer */}
            <div className="text-center mt-6">
              <a
                href="/admin/dashboard"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
