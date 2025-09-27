import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Layout({
  children,
  onNavigateSection,
}: {
  children: ReactNode;
  onNavigateSection?: (section: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="mt-20 min-h-[70vh]">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`transition-all duration-200 bg-gray-900 text-gray-200
            ${open ? "w-64" : "w-14"} rounded-r-2xl shadow`}
        >
          <div className="flex items-center justify-between px-3 py-3">
            <span className={`font-semibold ${open ? "block" : "hidden"}`}>
              Admin
            </span>
            <button
              onClick={() => setOpen(!open)}
              className="h-8 w-8 grid place-items-center rounded-md bg-gray-800 hover:bg-gray-700"
              title={open ? "Collapse" : "Expand"}
            >
              {open ? "«" : "»"}
            </button>
          </div>

          <nav className="px-2 py-2 space-y-1 text-sm">
            {[
              { key: "products", label: "products" },
              { key: "logs", label: "Logs" },
              { key: "analytics", label: "Analytics" },
            ].map((it) => (
              <button
                key={it.key}
                onClick={() => onNavigateSection?.(it.key)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800"
                title={it.label}
              >
                {open ? it.label : it.label.charAt(0)}
              </button>
            ))}

            <div className="pt-2 border-t border-gray-800 mt-2">
              <button
                onClick={() => navigate("/admin/login", { replace: true })}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800"
                title="Logout"
              >
                {open ? "Logout" : "⎋"}
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-6">{children}</main>
      </div>
    </div>
  );
}
