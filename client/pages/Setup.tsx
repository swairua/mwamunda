import { useState } from "react";
import { Loader, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SetupStatus {
  step: string;
  status: "pending" | "success" | "error";
  message: string;
}

export default function Setup() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupStatus, setSetupStatus] = useState<SetupStatus[]>([]);

  const handleSetup = async () => {
    setLoading(true);
    setError(null);
    setSetupStatus([]);

    try {
      // Call setup endpoint to initialize contacts table
      const response = await fetch("api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "init_contacts_table",
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Setup failed");
      }

      setCompleted(true);
      toast({
        title: "Success",
        description: "Database setup completed successfully!",
      });

      // Log admin credentials
      console.log("Admin Email: admin@mwamunda.com");
      console.log("Admin Password: Pass123");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Setup failed";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            System Setup
          </h1>
          <p className="text-muted-foreground">
            Initialize the database and create admin account
          </p>
        </div>

        {!completed ? (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                This page will initialize the database tables and create an
                admin account with default credentials.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              onClick={handleSetup}
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-5 h-5 animate-spin" />}
              {loading ? "Setting up..." : "Initialize Setup"}
            </button>

            <div className="text-xs text-muted-foreground text-center">
              <p>This is a one-time setup process.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900 mb-2">
                Setup Complete!
              </h3>
              <p className="text-sm text-green-700 mb-4">
                Your system has been initialized successfully.
              </p>
            </div>

            <div className="bg-gray-50 border border-border rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Admin Credentials:
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Email:</span> admin@mwamunda.com
                </p>
                <p>
                  <span className="font-medium">Password:</span> Pass123
                </p>
              </div>
            </div>

            <a
              href="/admin/login"
              className="w-full px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:shadow-lg transition-all text-center"
            >
              Go to Admin Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
