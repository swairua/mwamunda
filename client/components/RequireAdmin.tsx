import { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { clearUser, fetchSession, saveUser } from "@/lib/auth";

type Status = "checking" | "allowed" | "denied" | "unreachable";

/**
 * Route guard for the admin area. Nothing inside renders until the server has
 * confirmed a signed-in admin, so a value in localStorage is never enough.
 */
export default function RequireAdmin() {
  const [status, setStatus] = useState<Status>("checking");

  const check = useCallback(() => {
    let cancelled = false;
    setStatus("checking");

    fetchSession()
      .then((user) => {
        if (cancelled) return;
        if (user) {
          saveUser(user);
          setStatus("allowed");
        } else {
          clearUser();
          setStatus("denied");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("unreachable");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => check(), [check]);

  if (status === "allowed") {
    return <Outlet />;
  }

  if (status === "denied") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {status === "checking" ? (
        <p className="text-muted-foreground">Checking your session...</p>
      ) : (
        <div className="text-center">
          <p className="text-foreground font-semibold mb-2">
            Cannot reach the server
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Your session could not be checked. Check your connection and try
            again.
          </p>
          <button
            type="button"
            onClick={() => check()}
            className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:shadow-lg transition-all"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
