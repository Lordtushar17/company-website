import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const DEMO_USER = "admin";
    const DEMO_PASS = "password123";

    if (username === DEMO_USER && password === DEMO_PASS) {
      // ✅ navigate respects HashRouter, URL becomes http://localhost:3000/#/admin
      navigate("/admin");
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
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
        <button type="submit" className="w-full py-2 rounded-xl shadow hover:shadow-md border font-medium">
          Log in
        </button>
      </form>
    </div>
  );
}
