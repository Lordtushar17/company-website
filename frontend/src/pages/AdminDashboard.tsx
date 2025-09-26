import { useNavigate } from "react-router-dom";
import { apiLogout } from "../lib/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  async function logout() {
    await apiLogout();         // clears cookie
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="p-14 mt-20 min-h-[80vh]">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold mb-4">Admin Dashboard</h1>
        <button onClick={logout} className="px-3 py-2 border rounded-lg">Logout</button>
      </div>
      <p className="text-gray-600">You’re on the real admin area (cookie-based auth).</p>
    </div>
  );
}
