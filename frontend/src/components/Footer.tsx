import React, { useEffect, useRef, useState } from "react";
import { FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import { IconType } from "react-icons";
import { Link } from "react-router-dom";

interface SocialIconProps {
  icon: IconType;
  label: string;
  color: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon, label, color }) => {
  const Icon = icon as unknown as React.ElementType;
  return (
    <button
      aria-label={label}
      className={`hover:${color} hover:scale-110 transform transition duration-300 shadow-lg p-2 rounded-full bg-gray-800`}
    >
      <Icon />
    </button>
  );
};

const Footer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // close when clicking outside or pressing Esc
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between border-b border-gray-700">
        {/* Left: Logo */}
        <div className="mb-8 md:mb-0 md:w-1/3">
          <a
            href="#top"
            className="inline-block mb-4"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img src="/footer-logo.png" alt="Yantrashilpa Logo" className="h-15 w-auto" />
          </a>
        </div>

        {/* Center: Phone & Email */}
        <div className="mb-8 md:mb-0 md:w-1/1 flex flex-col space-y-2 text-sm ">
          <div className="bg-gray-800 p-3 rounded-md shadow-sm">
            <p className="font-semibold">Phone: +91-9112211142</p>
            <p className="font-semibold">Phone: +91-9112211140</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-md shadow-sm ">
            <p className="font-semibold">Email: info@yantrashilpa.com</p>
            <p className="font-semibold">Email: support@yantrashilpa.com</p>
          </div>
        </div>

        {/* Right: Address & Social Links */}
        <div className="md:w-1/3 text-sm">
          <h3 className="text-3xl font-bold mb-2">Address</h3>
          <p className="font-semibold">Yantrashilpa Technologies Pvt. Ltd., Phase-2</p>
          <p className="font-semibold">27/4/2, Dhayari-Narhe Rd, Dhayari, Pune,</p>
          <p className="font-semibold">Maharashtra 411041</p>

          <div className="flex mt-4 space-x-4 text-2xl">
            <a
              href="https://in.linkedin.com/company/yantrashilpa-technologies-private-limited"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon icon={FaLinkedin} label="LinkedIn" color="text-blue-500" />
            </a>
            <SocialIcon icon={FaTwitter} label="Twitter" color="text-blue-400" />
            <SocialIcon icon={FaInstagram} label="Instagram" color="text-pink-500" />
            <SocialIcon icon={FaYoutube} label="YouTube" color="text-red-600" />
          </div>
        </div>
      </div>

      {/* Bottom Section with Divider */}
      <div className="bg-gray-800 text-gray-400 py-4 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© All rights reserved 2025 Yantrashilpa</p>

          {/* Right-side links + "More" text with rotating triangle */}
          <div className="flex items-center gap-4 mt-2 md:mt-0" ref={wrapperRef}>
            <button className="hover:text-white">Privacy Policy</button>
            <button className="hover:text-white">Terms & Conditions</button>

            {/* Trigger: looks like text, not a button */}
            <span
              role="button"
              tabIndex={0}
              onClick={() => setOpen((o) => !o)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="footer-admin-reveal"
              className="inline-flex items-center gap-1 select-none cursor-pointer text-gray-300 hover:text-white"
              title="More"
            >
              <span className={`transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"}`}>
                {/* Small triangle (caret) via SVG so we can rotate it cleanly */}
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M2 7 L5 3 L8 7 Z" fill="currentColor" />
                </svg>
              </span>
              <span>More</span>
            </span>

            {/* Revealed text: Admin (no button) */}
            <div
              id="footer-admin-reveal"
              className={`overflow-hidden transition-all duration-200 
                         ${open ? "opacity-100 max-w-[120px]" : "opacity-0 max-w-0"}`}
            >
              <Link
                to="/admin/login"
                className="ml-2 whitespace-nowrap underline hover:no-underline text-gray-200"
                onClick={() => setOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
