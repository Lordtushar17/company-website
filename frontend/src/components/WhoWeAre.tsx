import React from "react";

const WhoWeAre = () => {
  return (
    <section
      id="about"
      className="py-16 bg-white text-gray-900 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Team Photo */}
        <div className="flex justify-center">
          <img
            src="/images/team-photo.jpg" // replace with your team photo path
            alt="Our Team"
            className="rounded-2xl shadow-lg w-full max-w-md object-cover hover:shadow-[0_0_30px_rgba(0,0,0,0.7)]
                       hover:drop-shadow-[0_0_40px_rgba(0,0,0,0.3)]
                       transition-all duration-300 mb-6 hover:scale-105"
          />
        </div>

        {/* Right: Title + Text */}
        <div className="text-center md:text-left">
          {/* Title with gradient + glow */}
          {/* Page heading with Glow Effect */}
<div className="mx-auto mb-10 w-fit text-center">
  <div className="relative inline-block group">
    {/* Actual Title */}
    <h1 className="text-4xl md:text-5xl font-bold p-4 rounded-lg text-white bg-gradient-to-r from-orange-400 to-orange-700 relative z-10">
      Who We Are
    </h1>

    {/* Blue Glow effect */}
    <div className="absolute inset-0 -m-1 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-75 blur-none group-hover:blur-md z-0 transition-all duration-500 animate-pulse"></div>

    {/* Subtle Highlight effect */}
    <div className="absolute inset-0 -m-0.5 rounded-lg border-2 border-transparent group-hover:border-blue-200 z-0 transition-colors duration-500"></div>

    {/* Outer Shadow for depth */}
    <div className="absolute inset-0 rounded-lg shadow-none group-hover:shadow-xl group-hover:shadow-blue-500/50 z-0 transition-shadow duration-500"></div>
  </div>
</div>


          <p className="text-lg md:text-xl leading-relaxed text-gray-800 text-justify font-semibold">
            The strong design-oriented organization known today as Yantrashilpa evolved
            from a solid technical and administrative support base. The origins of its
            engine testing equipment often trace back to the SPMs and test-rigs for ballistic
            applications, designed by the founder in the late 90&apos;s.
            <br /><br />
            Since then Yantrashilpa is one of the leading companies with proven ability to
            deliver innovative products that span traditional and next-generation requirements.
            <br /><br />
            Our customers recognize us for providing remarkably high-quality technology and
            support with expertise to match. Yantrashilpa’s continuing impressive growth is
            a direct result of providing excellent products at appropriate prices and prompt
            delivery in combination with technical support, service, and localized inventory.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
