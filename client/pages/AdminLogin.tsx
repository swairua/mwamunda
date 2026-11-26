import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { loginUser, saveUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiFetch, getApiUrl } from "@/lib/config";

type ConnectionStatus = "checking" | "connected" | "fallback" | "disconnected";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("checking");
  const [connectionMessage, setConnectionMessage] = useState("");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await apiFetch(getApiUrl(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "check_connection",
          }),
        });

        if (response.ok || response.status === 400 || response.status === 500) {
          setConnectionStatus("connected");
          setConnectionMessage("✓ API is ready");
        } else {
          setConnectionStatus("disconnected");
          setConnectionMessage("✗ API connection unavailable");
        }
      } catch (err) {
        setConnectionStatus("disconnected");
        setConnectionMessage("✗ Unable to connect to API server");
      }
    };

    checkConnection();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(email, password);

      if (response.success && response.user) {
        saveUser(response.user);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        navigate("/admin/dashboard");
      } else {
        setError(response.error || "Login failed");
        toast({
          title: "Error",
          description: response.error || "Login failed",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("An error occurred during login");
      toast({
        title: "Error",
        description: "An error occurred during login",
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
            <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
            <p className="text-white/90">Access your admin dashboard</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Connection Status Banner */}
            {connectionStatus === "checking" && (
              <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 flex gap-3 animate-slide-in-down">
                <Loader className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
                <p className="text-sm text-blue-700">
                  Checking API connection...
                </p>
              </div>
            )}

            {connectionStatus === "connected" && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex gap-3 animate-slide-in-down">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{connectionMessage}</p>
              </div>
            )}

            {connectionStatus === "fallback" && (
              <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex gap-3 animate-slide-in-down">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">{connectionMessage}</p>
              </div>
            )}

            {connectionStatus === "disconnected" && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3 animate-slide-in-down">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{connectionMessage}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3 animate-slide-in-down">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <a
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
