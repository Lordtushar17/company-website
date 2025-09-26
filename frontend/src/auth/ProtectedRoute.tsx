import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { apiMe } from "../lib/api";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [status, setStatus] =
    useState<"checking" | "ok" | "unauthenticated">("checking");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await apiMe();
        if (mounted) {
          setStatus(me.authenticated ? "ok" : "unauthenticated");
        }
      } catch {
        if (mounted) setStatus("unauthenticated");
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (status === "checking") {
  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin" />
    </div>
    );
    }



  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // status === "ok"
  return <>{children}</>;
}
