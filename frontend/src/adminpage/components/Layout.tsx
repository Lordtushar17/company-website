import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Layout({
  children,
  onNavigateSection,
}: {
  children: ReactNode;
  onNavigateSection?: (section: string) => void;
}) {
  // Default: expanded on desktop, collapsed on small screens
  const [open, setOpen] = useState<boolean>(true);
  const navigate = useNavigate();

  // Collapse by default on small screens (rehydrates on resize)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setOpen(!mq.matches ? true : false);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  return (
    <div className="mt-20 min-h-[70vh]">
      {/* Top bar only on mobile: shows menu toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setOpen((v) => !v)}
            className="h-9 px-3 rounded-md bg-gray-900 text-white"
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <span className="font-semibold">Admin</span>
          <div className="w-9" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={[
            "transition-all duration-200 bg-gray-900 text-gray-200 rounded-r-2xl shadow",
            "md:static md:translate-x-0 md:top-auto md:left-auto md:h-auto",
            // Off-canvas on mobile
            "fixed top-12 left-0 h-[calc(100vh-3rem)] z-50 md:z-auto",
            open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            open ? "w-64" : "md:w-14 w-0", // width 0 when closed on mobile, skinny on desktop
          ].join(" ")}
          aria-hidden={!open && window.innerWidth < 768}
        >
          {/* Collapse/expand control (desktop) */}
          <div className="hidden md:flex items-center justify-between px-3 py-3">
            <span className={`font-semibold ${open ? "block" : "hidden"}`}>Admin</span>
            <button
              onClick={() => setOpen(!open)}
              className="h-8 w-8 grid place-items-center rounded-md bg-gray-800 hover:bg-gray-700"
              title={open ? "Collapse" : "Expand"}
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            >
              {open ? "«" : "»"}
            </button>
          </div>

          <nav className="px-2 py-2 space-y-1 text-sm">
            {[
              { key: "products", label: "Products" },
              { key: "gallery", label: "Gallery" },
              { key: "notice", label: "Notice" },
              { key: "logs", label: "Logs" },
              { key: "contacts", label: "Contacts" },
              // { key: "analytics", label: "Analytics" },
            ].map((it) => (
              <button
                key={it.key}
                onClick={() => {
                  onNavigateSection?.(it.key);
                  // auto-close on mobile after navigation
                  if (window.innerWidth < 768) setOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800"
                title={it.label}
              >
                {open || window.innerWidth < 768 ? it.label : it.label.charAt(0)}
              </button>
            ))}

            <div className="pt-2 border-t border-gray-800 mt-2">
              <button
                onClick={() => {
                  navigate("/admin/login", { replace: true });
                  if (window.innerWidth < 768) setOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800"
                title="Logout"
              >
                {open || window.innerWidth < 768 ? "Logout" : "⎋"}
              </button>
            </div>
          </nav>
        </aside>

        {/* Mobile overlay when sidebar is open */}
        {open && window.innerWidth < 768 && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <main
          className={[
            "flex-1 px-4 sm:px-6 md:px-8",
            // add left margin on desktop when sidebar expanded to prevent jump
            open ? "md:ml-0" : "md:ml-0",
          ].join(" ")}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
