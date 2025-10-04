import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiLogin, apiMe } from "../lib/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const rawFrom = (location.state as any)?.from?.pathname;
  const safeFrom =
    !rawFrom || rawFrom === "/admin/login" || rawFrom === "/admin/login/"
      ? "/admin"
      : rawFrom;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1) perform login (this sets HTTP-only cookie)
      await apiLogin(username, password);

      // 2) immediately verify session with the backend (ensures cookie is sent & valid)
      let me;
      try {
        me = await apiMe();
        console.log("[login] apiMe after login:", me);
      } catch (err) {
        console.warn("[login] apiMe failed:", err);
      }

      // 3) if authenticated, navigate to dashboard; otherwise show error
      if (me && me.authenticated) {
        navigate(safeFrom, { replace: true });
      } else {
        // Rare: cookie didn't stick or me returned false. Show error and log details.
        setError("Login succeeded but session not recognized — try again.");
        console.error("[login] session not recognized after login. Response:", me);
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] mt-20 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 rounded-2xl shadow border bg-white">
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
        <label className="block mb-2 text-sm">Username</label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-4 outline-none focus:ring"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
        />
        <label className="block mb-2 text-sm">Password</label>
        <input
          type="password"
          className="w-full border rounded-lg px-3 py-2 mb-3 outline-none focus:ring"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-2 rounded-xl shadow hover:shadow-md border font-medium">
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
