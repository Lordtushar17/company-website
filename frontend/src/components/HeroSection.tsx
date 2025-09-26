import React, { useEffect, useRef, useState } from "react";

type HeroSectionProps = {
  images?: string[];
  autoPlay?: boolean;
  autoPlayInterval?: number; // ms
};

export default function HeroSection({
  images = ["/images/group photo 3.webp", "/images/hero section 1.webp", "/images/hero section 2.webp", "/images/hero section 3.webp", "/images/company-photo-2.webp", "/images/Award-photo.webp"],
  autoPlay = true,
  autoPlayInterval = 4000,
}: HeroSectionProps) {
  const [index, setIndex] = useState(0);
  const pauseRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const length = images.length;

  // Start/stop timer controlled by autoPlay and pauseRef
  useEffect(() => {
    // clear any existing timer
    function clearTimer() {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    function tick() {
      // only advance when not paused
      if (!pauseRef.current) {
        // use functional update to avoid stale closures
        setIndex((prev) => (prev + 1) % length);
      }
      timerRef.current = window.setTimeout(tick, autoPlayInterval);
    }

    if (autoPlay && length > 1) {
      // start the loop
      clearTimer();
      timerRef.current = window.setTimeout(tick, autoPlayInterval);
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [autoPlay, autoPlayInterval, length]);

  function goTo(i: number) {
    setIndex(((i % length) + length) % length);
  }
  function prev() {
    setIndex((s) => (s - 1 + length) % length);
  }
  function next() {
    setIndex((s) => (s + 1) % length);
  }

  return (
    <section
      className="relative flex items-center justify-center min-h-screen px-6 md:px-12 pt-24 text-black text-center overflow-hidden"
      aria-label="Company hero carousel"
    >
      {/* Slides */}
      <div className="absolute inset-0 flex">
        {images.map((src, i) => {
          const isActive = i === index;
          return (
            <div
              key={src + i}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={src}
                alt={`Slide ${i + 1}`}
                className="w-full h-full object-cover object-center"
                draggable={false}
              />
            </div>
          );
        })}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Content */}
      <div
        className="relative z-20 flex flex-col items-center space-y-6 p-6 md:p-8 rounded-2xl max-w-5xl bg-gray-800/40 backdrop-blur-xsm shadow-lg"
        onMouseEnter={() => {
          pauseRef.current = true;
        }}
        onMouseLeave={() => {
          pauseRef.current = false;
        }}
      >
        <h1 className="text-5xl md:text-8xl lg:text-8xl font-bold text-orange-100/50 [-webkit-text-stroke:2px_black]"
          style={{ fontFamily: "ERASB, sans-serif" }}>
          Yantrashilpa
        </h1>
  
        <div className="max-w-3xl">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl text-white font-bold drop-shadow-[0_0_10px_white]"
            style={{ fontFamily: "Lucida Handwriting, 'LucidaHandwritingStdLight', cursive" }}
          >
            Innovation and Simplicity...
          </h2>

          <p
            className="mt-4 text-xl md:text-2xl lg:text-3xl text-white font-semibold drop-shadow-[0_0_10px_white]"
            style={{ fontFamily: "Lucida Handwriting, 'LucidaHandwritingStdLight', cursive" }}
          >
            Going hand in hand
          </p>
        </div>

        <a
          href="#products"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-40 h-12 flex items-center justify-center bg-blue-500 text-black font-semibold rounded-xl shadow-[0_0_20px_rgba(0,0,255,1)] hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] hover:bg-orange-700 hover:scale-105 transition-all"
        >
          Learn More
        </a>
      </div>

      {/* Prev/Next */}
      <button
        onClick={() => prev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 rounded-full p-2 bg-black/30 hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => next()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 rounded-full p-2 bg-black/30 hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {images.map((_, i) => (
          <button
            key={"dot" + i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full focus:outline-none ring-2 ring-transparent ${
              i === index ? "scale-125" : "opacity-60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
