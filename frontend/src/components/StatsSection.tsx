import React from "react";

const stats = [
  { number: "1500+", label: "Systems Installed" },
  { number: "100+", label: "Happy Clients" },
  { number: "30+", label: "Designs & Patents" },
];

const StatsSection = () => {
  return (
    <section
      className="relative bg-gray-700 text-white py-16 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/pic1.jpeg')", backgroundPosition: "center 30%" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Stats Container */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-gray-800 bg-opacity-60 p-8 rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-300"
          >
            <h2 className="text-4xl font-bold mb-2">{stat.number}</h2>
            <p className="text-gray-300">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
