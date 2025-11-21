import { useState } from "react";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import { apiFetch, getApiUrl } from "@/lib/config";

export default function AdminInitCareers() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const initializeCareersTable = async () => {
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await apiFetch(getApiUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "init_careers_table",
        }),
      });

      const data = await response.json();

      if (data.success || data.message?.includes("already exists")) {
        setStatus("success");
        setMessage(
          data.message || "Careers table initialized successfully!"
        );
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to initialize careers table");
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "An error occurred while initializing the table"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Initialize Careers</h1>
            <p className="text-white/90">Set up the careers management system</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                This will create the careers table in your database, allowing
                admins to post and manage job positions.
              </p>
            </div>

            {status === "success" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{message}</p>
              </div>
            )}

            {status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{message}</p>
              </div>
            )}

            <button
              onClick={initializeCareersTable}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-5 h-5 animate-spin" />}
              {loading ? "Initializing..." : "Initialize Careers Table"}
            </button>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">
                <span className="font-semibold">What this does:</span>
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Creates careers table in database</li>
                <li>✓ Enables job posting functionality</li>
                <li>✓ Sets up validity date tracking</li>
                <li>✓ Safe to run multiple times</li>
              </ul>
            </div>

            <a
              href="/admin/dashboard"
              className="block text-center text-sm text-primary hover:text-primary/80 transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
