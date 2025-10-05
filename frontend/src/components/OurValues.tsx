import React from "react";

interface Value {
  title: string;
  description: string;
  image: string;
}

const values: Value[] = [
  {
    title: "Integrity",
    description:
      "Integrity is at the core of everything we do at Yantrashilpa. We believe in honesty, transparency, and accountability in all our actions and decisions. Our commitment to integrity guides us as we interact with our customers, partners, and each other. We take responsibility for our actions and strive to maintain the highest ethical standards in all that we do. We are committed to doing what is right, not just what is easy or convenient, and to upholding our values in everything we do.",
    image: "images/integrity.png",
  },
  {
    title: "Safety",
    description:
      "At Yantrashilpa, we place the highest priority on the safety of our customers, employees, and the community. We are committed to creating a safe environment for all and take all necessary measures to ensure the well-being of everyone involved with our company. From the products we offer to the practices we employ, safety is always at the forefront of our minds. We are dedicated to maintaining the highest standards of safety and continue to prioritize it in all of our operations.",
    image: "/images/safety.jpg",
  },
  {
    title: "Customer Satisfaction",
    description:
      "At Yantrashilpa, we are dedicated to providing exceptional customer service and satisfaction. We believe that our customers are the foundation of our success and that their satisfaction is the measure of our performance. We are committed to understanding the needs of our customers and providing solutions that meet those needs. Our goal is to exceed your expectations and earn your trust, and we will do everything in our power to achieve that.",
    image: "/images/customer.jpg",
  },
];

const OurValues: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 via-orange-100/80 to-orange-50 text-gray-900">
      {/* --- Consistent Title (centered, same as Contact section) --- */}
      <div className="mx-auto mb-12 w-fit text-center">
        <div className="relative inline-block group">
          <h1 className="text-3xl md:text-4xl font-bold p-4 rounded-lg text-white bg-gradient-to-r from-orange-400 to-orange-700 relative z-10">
            Our Values
          </h1>
          <div className="absolute inset-0 -m-1 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-75 blur-none group-hover:blur-md z-0 transition-all duration-500 animate-pulse"></div>
          <div className="absolute inset-0 -m-0.5 rounded-lg border-2 border-transparent group-hover:border-blue-200 z-0 transition-colors duration-500"></div>
          <div className="absolute inset-0 rounded-lg shadow-none group-hover:shadow-xl group-hover:shadow-blue-500/50 z-0 transition-shadow duration-500"></div>
        </div>
      </div>

      {/* --- Values Grid --- */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {values.map((value, idx) => (
            <article
              key={idx}
              className="relative rounded-2xl overflow-hidden transform transition duration-300 hover:-translate-y-2 focus-within:-translate-y-2"
              aria-labelledby={`value-title-${idx}`}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{
                  backgroundImage: `url(${value.image})`,
                  filter: "saturate(0.8) contrast(0.95)",
                }}
                aria-hidden
              />

              {/* Semi-transparent overlay */}
              <div className="absolute inset-0 bg-white/45 backdrop-blur-sm pointer-events-none" />

              {/* Card content */}
              <div className="relative p-6 md:p-8 min-h-[360px] flex flex-col bg-white/30">
                <h3
                  id={`value-title-${idx}`}
                  className="text-4xl md:text-4xl font-bold mb-3 text-orange-700"
                >
                  {value.title}
                </h3>
                <p className="text-base leading-relaxed text-black font-bold flex-1 overflow-auto">
                  {value.description}
                </p>

                <div className="mt-6 flex items-center justify-start gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z"
                        fill="currentColor"
                      />
                    </svg>
                    Core value
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValues;
