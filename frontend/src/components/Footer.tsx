import React from "react";
import { FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import { IconType } from "react-icons";

interface SocialIconProps {
  icon: IconType;
  label: string;
  color: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon, label, color }) => {
  const Icon = icon as unknown as React.ElementType; // ✅ Cast to React.ElementType
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
      <img
        src="/footer-logo.png"
        alt="Yantrashilpa Logo"
        className="h-15 w-auto"
      />
    </a>
  </div>

  {/* Center: Phone & Email */}
  <div className="mb-8 md:mb-0 md:w-1/1 flex flex-col space-y-2 text-sm ">
    {/* Phone Numbers Box */}
    <div className="bg-gray-800 p-3 rounded-md shadow-sm">
      <p className="font-semibold">Phone: +91-9112211150</p>
      <p className="font-semibold">Phone: +91-9112211140</p>
    </div>

    {/* Email IDs Box */}
    <div className="bg-gray-800 p-3 rounded-md shadow-sm ">
      <p className="font-semibold">Email: info@yantrashilpa.com</p>
      <p className="font-semibold">Email: support@yantrashilpa.com</p>
    </div>
  </div>

  {/* Right: Working Hours & Social Links */}
  <div className="md:w-1/3 text-sm">
    <h3 className="text-3xl font-bold mb-2">Address</h3>
    <p className="font-semibold">Yantrashilpa Technologies Pvt. Ltd., Phase-2</p>
    <p className="font-semibold">27/4/2, Dhayari-Narhe Rd,
      Dhayari, Pune,</p>
    <p className="font-semibold">Maharashtra 411041</p>

    <div className="flex mt-4 space-x-4 text-2xl">
      
      <a
  href="https://in.linkedin.com/company/yantrashilpa-technologies-private-limited"
  target="_blank"
  rel="noopener noreferrer">
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
          <div className="flex space-x-4 mt-2 md:mt-0">
            <button className="hover:text-white">Privacy Policy</button>
            <button className="hover:text-white">Terms & Conditions</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
