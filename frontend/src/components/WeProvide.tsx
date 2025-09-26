import React from "react";

const services = [
  { description: "Engine Testing Excellence – Advanced conditioning systems (Coolant, Fuel, Oil, and Air) built to meet global testing standards, ensuring precision, reliability, and repeatability." },
  { description: "Safety & Durability Solutions – Fully automated rigs for active and passive safety testing, along with specialized setups like the Thermal Shock System for durability validation.." },
  { description: "Tailored Innovation – Custom-engineered systems designed for unique and atypical testing requirements, offering flexibility for R&D, production, and defence applications." },
  { description: "Trusted Reliability – Proven, robust technologies serving both automotive and defence sectors, backed by decades of expertise, patents, and successful installations worldwide." },
];

const WeProvide = () => {
  return (
    <section className="py-16 sm:py-24 md:py-32 bg-gray-100 text-gray-900 text-center">
      <div className="relative inline-block mb-12 group"> {/* Added 'group' class */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold p-4 rounded-lg text-white bg-gradient-to-r from-orange-300 via-orange-500 to-orange-700 relative z-10">
          We Provide You
        </h2>
        {/* Blue Glow effect - with hover and transition */}
        <div className="absolute inset-0 -m-1 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-75 blur-none group-hover:blur-md z-0 transition-all duration-500 animate-pulse"></div>
        {/* Subtle Highlight effect - now also with hover */}
        <div className="absolute inset-0 -m-0.5 rounded-lg border-2 border-transparent group-hover:border-blue-200 z-0 transition-colors duration-500"></div>
        {/* Outer Shadow for depth - with hover */}
        <div className="absolute inset-0 rounded-lg shadow-none group-hover:shadow-xl group-hover:shadow-blue-500/50 z-0 transition-shadow duration-500"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-6xl mx-auto px-4">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-white p-6 sm:p-8 rounded-lg 
             shadow-[0_8px_30px_rgba(0,0,0,0.2)] 
             hover:shadow-[0_12px_50px_rgba(0,0,0,0.3)] 
             transition-shadow duration-300 flex items-center text-left"
          >
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-orange-500 mr-4 sm:mr-6">
              {idx + 1}
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold hover:scale-105 ">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeProvide;