// src/pages/ContactPage.tsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import ContactForm from "../adminpage/components/ContactForm";

/**
 * NOTE: This file uses framer-motion for subtle animations.
 * If you haven't installed it: npm install framer-motion
 *
 * UI only changes — logic & structure remain the same.
 */

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const ContactPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100 p-8 pt-24 flex flex-col items-center transition-colors duration-500">
      {/* ====== Title with Glow Effect ====== */}
      <motion.div
        className="mb-12 text-center"
        initial="initial"
        animate="animate"
        variants={fadeUp}
        transition={{ duration: 0.45 }}
      >
        {/* Page heading with Glow Effect */}
      <div className="mx-auto mb-10 w-fit text-center">
        <div className="relative inline-block group">
          <h1 className="text-3xl md:text-4xl font-bold p-4 rounded-lg text-white bg-gradient-to-r from-orange-400 to-orange-700 relative z-10">
            Contact
          </h1>
          <div className="absolute inset-0 -m-1 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-75 blur-none group-hover:blur-md z-0 transition-all duration-500 animate-pulse"></div>
          <div className="absolute inset-0 -m-0.5 rounded-lg border-2 border-transparent group-hover:border-blue-200 z-0 transition-colors duration-500"></div>
          <div className="absolute inset-0 rounded-lg shadow-none group-hover:shadow-xl group-hover:shadow-blue-500/50 z-0 transition-shadow duration-500"></div>
        </div>
      </div>

        <p className="mt-4 text-gray-700 italic text-lg font-semibold max-w-2xl mx-auto">
          We’d love to hear from you — reach out for more projects, support.
        </p>
      </motion.div>

      {/* ====== Email Card (bigger card with subtle animation) ====== */}
      <motion.div
        className="w-full max-w-5xl mt-6"
        initial="initial"
        animate="animate"
        variants={fadeUp}
        transition={{ duration: 0.45, delay: 0.05 }}
      >
        <div className="relative bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-orange-200 shadow-md hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 transform">
          <h2 className="text-3xl font-extrabold mb-6 text-orange-600 text-center tracking-wide">
            Email
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <motion.div
              className="p-5 rounded-xl border border-gray-100 bg-gradient-to-b from-white to-orange-50 hover:from-orange-50 hover:to-orange-100 shadow-sm hover:shadow-md transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Enquiry for New Systems
              </h3>
              <p className="text-orange-600 text-lg font-semibold">info@yantrashilpa.com</p>
            </motion.div>

            <motion.div
              className="p-5 rounded-xl border border-gray-100 bg-gradient-to-b from-white to-orange-50 hover:from-orange-50 hover:to-orange-100 shadow-sm hover:shadow-md transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Support for Existing Systems
              </h3>
              <p className="text-orange-600 text-lg font-semibold">support@yantrashilpa.com</p>
            </motion.div>

            <motion.div
              className="p-5 rounded-xl border border-gray-100 bg-gradient-to-b from-white to-orange-50 hover:from-orange-50 hover:to-orange-100 shadow-sm hover:shadow-md transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <h3 className="text-lg font-bold mb-2 text-gray-900">Spares</h3>
              <p className="text-orange-600 text-lg font-semibold">dispatch@yantrashilpa.com</p>
            </motion.div>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="h-1 w-28 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* ====== Contact Form + Office (two-column layout) ====== */}
      <div className="w-full max-w-5xl mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          className="md:col-span-2 rounded-2xl shadow-lg transition-all duration-300 p-6 bg-white/90 backdrop-blur-md border border-orange-200"
          initial="initial"
          animate="animate"
          variants={fadeUp}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">
            Send Us a Message
          </h2>

          <ContactForm />
        </motion.div>

        {/* ===== compact Office card ===== */}
        <motion.div
          className="relative p-6 rounded-2xl shadow-lg transition-all duration-300 bg-gradient-to-b from-white to-orange-50 border border-orange-200 flex flex-col justify-center items-start"
          initial="initial"
          animate="animate"
          variants={fadeUp}
          transition={{ duration: 0.45, delay: 0.12 }}
          whileHover={{ scale: 1.02 }}
          style={{ minHeight: 0 }} // ensure we do not artificially stretch height
        >
          <div className="flex items-start gap-4 w-full">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-orange-600 text-white shadow">
                {/* simple building icon (SVG) */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 21h18v-2H3v2zM5 7h3v10H5V7zm5-4h4v14h-4V3zm6 6h3v8h-3V9z" />
                </svg>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-orange-600 mb-2">Our Office</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Yantrashilpa Technologies Pvt. Ltd., Phase-2
                <br />
                27/4/2, Dhayari-Narhe Rd, Dhayari, Pune, Maharashtra 411041
                <br />
                India
              </p>

              <div className="mt-3 flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.55.57 1 1 0 011 1v3.59a1 1 0 01-1 1A19 19 0 013 5a1 1 0 011-1h3.6a1 1 0 011 1 11.36 11.36 0 00.57 3.55 1 1 0 01-.24 1.01l-2.31 2.23z"/></svg>
                  <span className="text-gray-900 font-semibold">+91-9112211150</span>
                </div>
                <div className="flex items-center gap-2 text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.55.57 1 1 0 011 1v3.59a1 1 0 01-1 1A19 19 0 013 5a1 1 0 011-1h3.6a1 1 0 011 1 11.36 11.36 0 00.57 3.55 1 1 0 01-.24 1.01l-2.31 2.23z"/></svg>
                  <span className="text-gray-900 font-semibold">+91-9112211140</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <a href="mailto:info@yantrashilpa.com" className="text-orange-600 font-semibold">info@yantrashilpa.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* decorative footer accent (small) */}
          <div className="mt-4 w-full">
            <div className="h-1 w-full bg-gradient-to-r from-orange-300 to-orange-500 rounded-full opacity-40" />
          </div>
        </motion.div>
      </div>

      {/* ====== Map ====== */}
      <motion.div
        className="w-full max-w-5xl mt-12 relative rounded-2xl overflow-hidden shadow-2xl border border-orange-200"
        initial="initial"
        animate="animate"
        variants={fadeUp}
        transition={{ duration: 0.45, delay: 0.15 }}
      >
        <iframe
          title="Yantrashilpa Location"
          src="https://www.google.com/maps?q=18.447265312187177,73.82047744554852&hl=es;z=17&output=embed"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className="rounded-2xl"
        ></iframe>

        <div className="absolute inset-0 bg-gradient-to-t from-orange-200/12 via-transparent to-transparent pointer-events-none"></div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
