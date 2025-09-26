import React, { useEffect } from "react";

const ContactPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-24 flex flex-col items-center">
      {/* Title with Glow Effect */}
      <div className="mb-12 text-center">
        <div className="relative inline-block group">
          {/* Actual Title */}
          <h1 className="text-4xl md:text-5xl font-bold p-4 rounded-lg text-white bg-gradient-to-r from-orange-400 to-orange-700 relative z-10">
            Contact Us
          </h1>

          {/* Blue Glow effect */}
          <div className="absolute inset-0 -m-1 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-75 blur-none group-hover:blur-md z-0 transition-all duration-500 animate-pulse"></div>

          {/* Subtle Highlight effect */}
          <div className="absolute inset-0 -m-0.5 rounded-lg border-2 border-transparent group-hover:border-blue-200 z-0 transition-colors duration-500"></div>

          {/* Outer Shadow for depth */}
          <div className="absolute inset-0 rounded-lg shadow-none group-hover:shadow-xl group-hover:shadow-blue-500/50 z-0 transition-shadow duration-500"></div>
        </div>
      </div>

      {/* Info Boxes */}
            {/* Info Boxes */}
      <div className="w-full max-w-5xl mt-6 flex flex-col gap-8 ">
        {/* Email (top, full width) */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition font-bold">
        {/* Header */}
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-orange-500 text-center">
            Email
        </h2>

        {/* Three sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {/* Left */}
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-bold mb-2 text-gray-900">New Systems</h3>
                <p className="text-black text-lg font-normal">info@yantrashilpa.com</p>
          </div>

          {/* Centre */}
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md  transition">
            <h3 className="text-lg font-bold mb-2 text-gray-900">
              Support for Existing Systems
            </h3>
              <p className="text-black text-lg font-normal">support@yantrashilpa.com</p>
          </div>

          {/* Right */}
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-bold mb-2 text-gray-900">Spares</h3>
            <p className="text-black text-lg font-normal">dispatch@yantrashilpa.com</p>
          </div>
        </div>
      </div>



        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
   
          {/* <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition text-center font-bold md:col-span-2">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-orange-500 text-center">
              Phone Numbers
            </h2>
            <p className="text-gray-700 text-lg">+91 98765 43210</p>
            <p className="text-gray-700 text-lg">+91 91234 56789</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition ">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-orange-500 text-center">
              Address
            </h2>
            <p className="text-gray-700 text-lg text-center font-bold">
              Yantrashilpa Technologies Pvt. Ltd., Phase-2
              <br />
              27/4/2, Dhayari-Narhe Rd,
              <br />
              Dhayari, Pune, Maharashtra 411041
            </p>
          </div> */}
        </div>
      </div>


      {/* Embedded Map */}
      <div className="w-full max-w-5xl mt-12 rounded-lg overflow-hidden shadow-lg">
        <iframe
          title="Yantrashilpa Location"
          src="https://www.google.com/maps?q=18.447265312187177,73.82047744554852&hl=es;z=17&output=embed"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactPage;
