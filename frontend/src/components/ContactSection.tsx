import React from "react";

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="py-20 bg-gray-100 flex flex-col items-center justify-center"
    >
      <h2 className="text-3xl font-bold mb-10 text-gray-900">Contact Us</h2>

      {/* Container for the three boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-6">
        {/* Emails Box (Left) */}
        <div className="bg-white shadow-lg hover:shadow-2xl transition duration-300 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-4 text-green-600">Email</h3>
          <p className="text-gray-700">info@yantrashilpa.com</p>
          <p className="text-gray-700">support@yantrashilpa.com</p>
        </div>

        {/* Phones Box (Center) */}
        <div className="bg-white shadow-lg hover:shadow-2xl transition duration-300 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-4 text-green-600">Phone</h3>
          <p className="text-gray-700">+91 98765 43210</p>
          <p className="text-gray-700">+91 87654 32109</p>
        </div>

        {/* Address Box (Right) */}
        <div className="bg-white shadow-lg hover:shadow-2xl transition duration-300 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-4 text-green-600">Address</h3>
          <p className="text-gray-700">Yantrashilpa Pvt. Ltd.</p>
          <p className="text-gray-700">123 Industrial Area, Pune, India</p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
