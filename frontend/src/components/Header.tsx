import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"home" | "about" | "products" | "contact">("home");
  const location = useLocation();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Update activeSection based on route (so /products or /contact are reflected)
  useEffect(() => {
    if (location.pathname === "/products") {
      setActiveSection("products");
    } else if (location.pathname === "/contact") {
      setActiveSection("contact");
    } else {
      // on homepage route, default to home (scroll-spy will update as user scrolls)
      setActiveSection("home");
    }
  }, [location.pathname]);

  // Scroll spy using IntersectionObserver for #about and #products sections on the home page
  useEffect(() => {
    // Only run scroll spy when on the home route
    if (location.pathname !== "/") return;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: [0.25, 0.5], // consider section visible when 25-50% is in view
    };

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting && (entry.intersectionRatio >= 0.25 || entry.intersectionRatio >= 0.5)) {
          if (id === "about") setActiveSection("about");
          if (id === "products") setActiveSection("products");
        } else {
          // if scrolling out of observed sections and still on home, fallback to home
          // We'll check if no observed sections are intersecting and set to home
          const all = document.querySelectorAll("#about, #products");
          const anyVisible = Array.from(all).some((el) => {
            const r = el.getBoundingClientRect();
            return r.top < window.innerHeight && r.bottom > 0;
          });
          if (!anyVisible) setActiveSection("home");
        }
      });
    };

    // create observer and observe targets
    observerRef.current = new IntersectionObserver(callback, options);
    const aboutEl = document.getElementById("about");
    const productsEl = document.getElementById("products");

    if (aboutEl) observerRef.current.observe(aboutEl);
    if (productsEl) observerRef.current.observe(productsEl);

    return () => {
      if (observerRef.current) {
        if (aboutEl) observerRef.current.unobserve(aboutEl);
        if (productsEl) observerRef.current.unobserve(productsEl);
        observerRef.current.disconnect();
      }
    };
  }, [location.pathname]);

  const handleNavClick = (scrollToId?: string) => {
    setOpen(false);
    if (scrollToId) {
      // navigate to home if needed first, then scroll after a small delay
      if (location.pathname !== "/") {
        // navigate home by changing location hash — using Link/NavLink elsewhere handles actual nav;
        // here we just ensure the page has time to render Home content before scrolling
        window.location.hash = "/";
      }
      setTimeout(() => {
        document.getElementById(scrollToId)?.scrollIntoView({ behavior: "smooth" });
      }, 140);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-70 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Left: logo */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              onClick={() => {
                handleNavClick();
              }}
              className="flex items-center"
            >
              <img
                src="/header section last.png"
                alt="Yantrashilpa Logo"
                className="h-10 w-auto cursor-pointer"
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center">
            <ul className="flex space-x-10 text-lg font-medium">
              <li>
                <NavLink
                  to="/"
                  end
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
                  className={() => (activeSection === "home" ? "text-orange-500" : "hover:text-orange-500")}
                >
                  Home
                </NavLink>
              </li>

              <li>
                {/* About uses manual scroll; active style from scroll-spy */}
                <button
                  onClick={() => {
                    // ensure we're on home then scroll to about
                    if (location.pathname !== "/") {
                      // navigate to home route first
                      window.location.hash = "/";
                    }
                    setTimeout(() => {
                      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                    }, 120);
                  }}
                  className={activeSection === "about" ? "text-orange-500" : "hover:text-orange-500"}
                >
                  About Us
                </button>
              </li>

              <li>
                <NavLink
                  to="/products"
                  className={() => (activeSection === "products" || location.pathname === "/products" ? "text-orange-400" : "hover:text-orange-500")}
                >
                  Products
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) => (isActive ? "text-orange-400" : "hover:text-orange-500")}
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
            >
              <svg
                className={`h-6 w-6 transform transition-transform duration-200 ${open ? "rotate-45" : "rotate-0"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {!open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M6 18L18 6" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden transition-transform duration-200 ease-in-out origin-top ${open ? "max-h-screen" : "max-h-0"} overflow-hidden`}
        aria-hidden={!open}
      >
        <div className="px-4 pt-4 pb-6 bg-gray-900 bg-opacity-95 border-t border-gray-800">
          <ul className="space-y-3">
            <li>
              <NavLink
                to="/"
                end
                onClick={() => {
                  handleNavClick();
                }}
                className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive || activeSection === "home" ? "text-orange-500" : "text-gray-200 hover:text-orange-500"}`}
              >
                Home
              </NavLink>
            </li>

            <li>
              <button
                onClick={() => {
                  // close and scroll to about
                  setOpen(false);
                  if (location.pathname !== "/") window.location.hash = "/";
                  setTimeout(() => {
                    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                  }, 120);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${activeSection === "about" ? "text-orange-500" : "text-gray-200 hover:text-orange-500"}`}
              >
                About Us
              </button>
            </li>

            <li>
              <NavLink
                to="/products"
                onClick={() => setOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive || activeSection === "products" ? "text-orange-400" : "text-gray-200 hover:text-orange-500"}`}
              >
                Products
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/contact"
                onClick={() => setOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "text-orange-400" : "text-gray-200 hover:text-orange-500"}`}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
