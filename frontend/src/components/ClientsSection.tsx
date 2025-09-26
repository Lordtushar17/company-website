import React from "react";

const clients = [
  { id: 1, name: "Client 1", logo: "/images/clients/ashok leyland.png" },
  { id: 2, name: "Client 2", logo: "/images/clients/bajaj.png" },
  { id: 3, name: "Client 3", logo: "/images/clients/cummins.png" },
  { id: 4, name: "Client 4", logo: "/images/clients/drdo.png" },
  { id: 5, name: "Client 5", logo: "/images/clients/kirloskar.png" },
  { id: 6, name: "Client 6", logo: "/images/clients/tata.png" },
  { id: 7, name: "Client 7", logo: "/images/clients/arai.png" },
  { id: 8, name: "Client 8", logo: "/images/clients/force.png" },
  { id: 9, name: "Client 9", logo: "/images/clients/caterpillar.png" },
  { id: 10, name: "Client 10", logo: "/images/clients/indian oil.jpg" },
  { id: 11, name: "Client 11", logo: "/images/clients/avl.png" },
  { id: 12, name: "Client 12", logo: "/images/clients/delphi tvs.png" },
  { id: 13, name: "Client 13", logo: "/images/clients/dynomerk.png" },
  { id: 14, name: "Client 14", logo: "/images/clients/eicher.png" },
  { id: 15, name: "Client 15", logo: "/images/clients/mahindra.jpeg" },
  { id: 16, name: "Client 16", logo: "/images/clients/perkins.png" },
  { id: 17, name: "Client 17", logo: "/images/clients/hero.png" },
  { id: 18, name: "Client 18", logo: "/images/clients/horiba.png" },
  { id: 19, name: "Client 19", logo: "/images/clients/icat.png" },
  { id: 20, name: "Client 20", logo: "/images/clients/mitsubishi.png" }
];

const ClientsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      {/* Title */}
      <div className="text-center mb-12">
        <div className="relative inline-block group">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold p-4 rounded-lg text-white bg-gradient-to-r from-orange-400 to-orange-700 relative z-10">
            Our Clients
          </h2>

          {/* Hover effects (same as Products/Contact) */}
          <div className="absolute inset-0 -m-1 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-75 blur-none group-hover:blur-md z-0 transition-all duration-500 animate-pulse"></div>
          <div className="absolute inset-0 -m-0.5 rounded-lg border-2 border-transparent group-hover:border-blue-200 z-0 transition-colors duration-500"></div>
          <div className="absolute inset-0 rounded-lg shadow-none group-hover:shadow-xl group-hover:shadow-blue-500/50 z-0 transition-shadow duration-500"></div>
        </div>
      </div>

      {/* Client Logos Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 px-6">
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex items-center justify-center bg-white p-6 rounded-xl shadow transition hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)]"
          >
            <img
              src={client.logo}
              alt={client.name}
              className="max-h-16 object-contain filter grayscale hover:grayscale-0 transition duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClientsSection;
