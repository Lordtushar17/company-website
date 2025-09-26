import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  images: string[];
}

const products: Product[] = [
  {
    id: 1,
    name: "Coolant Conditioning System",
    shortDescription:
      "Coolant Conditioning System to provide coolant at controlled temperature, flow rate, and pressure for engine testing.",
    description:
      "The “Coolant Conditioning System” is aimed to provide coolant at controlled temperature, flow rate, and pressure to the engine water jacket. The hot water from the engine passes through the heat exchanger and is cooled down before returning to the engine again. The position of the control valve spindle decides the amount of shop (cooling) water going through the secondary circuit of the heat exchanger. A temperature sensor senses the temperature of water going to / coming out of the engine jacket. The Process Controller controls the position of the valve spindle depending on the difference between the actual and set temperatures, the trend of temperature change (rise / fall), the speed of temperature change, etc.",
    images: ["/product-images/CCS 4.webp", "/product-images/CCS 10.webp", "/product-images/PHOTO_CCS_4026.webp"],
  },
  {
    id: 2,
    name: "Charged Air Control System",
    shortDescription:
      "Charged Air Control System for regulating turbocharged air temperature and pressure supplied to the engine.",
    description:
      "The “Charged Air Control System” is designed to maintain or control the temperature and pressure of the turbocharged air supplied to the engine. The system controls the temperature of the air coming from the turbocharger by calculated heat withdrawal. Pressure drop across the CAC is manipulated by an inbuilt control mechanism. A dedicated controller monitors various parameters and processes control commands.",
    images: ["/product-images/CACS 3.webp", "/product-images/CACS 4.webp"],
  },
  {
    id: 3,
    name: "Fuel Conditioning System",
    shortDescription:
      "Fuel Conditioning System to maintain temperature, flow rate, and pressure of fuel supplied to the engine.",
    description:
      "The ‘Fuel Conditioning System’ is aimed to maintain the temperature, flow rate, and pressure of the fuel going to the feed pump of the engine constant at a set value. The system controls the temperature of fuel supplied to the engine either by indirect cooling or by heating it. The fuel coming from the main supply line is added to the fuel from the return line of the engine and passes through a heat exchanger coil. A process controller maintains the desired temperature, pressure (and thus flow) of fuel. Thereafter this fuel at the set temperature is supplied to the engine feed pump. The fuel going to the engine feed pump is always in excess. Hence this excess fuel is bypassed and sent to the air separator along with the return line fuel coming from the engine.",
    images: ["/product-images/FCS 5.webp", "/product-images/FCS 14.png", "/product-images/FCS combined.png"],
  },
  {
    id: 4,
    name: "Thermal Shock System",
    shortDescription:
      "Thermal Shock System to deliver hot and cold coolant cycles for durability testing of engines.",
    description:
      "The “Thermal Shock System” is aimed to provide hot and cold temperature shocks to the engine coolant gallery. There are three cycles to supply coolant to the engine: Hot, Cold, and CCS (coolant through the coolant conditioning system). These cycles can be defined (for duration, temperature, and sequence) and programmed by the control panel. In the Hot cycle, hot coolant from the hot seizure module of the system is circulated through the engine. In the Cold cycle, cold or chilled coolant from the cold seizure module of the system is circulated through the engine. In the CCS cycle, coolant from the CCS at intermediate temperature (maintained by the CCS) is circulated through the engine.",
    images: ["/product-images/TSS 5.webp", "/product-images/TSS 1.webp" ],
  },
  {
    id: 5,
    name: "Oil Conditioning System",
    shortDescription:
      "Oil Conditioning System for controlling engine lubricating oil temperature, pressure, and flow.",
    description:
      "The “Oil Conditioning System” is aimed to maintain the temperature, pressure, and flow of engine lubricating oil constant at the desired set value. The temperature is controlled at the inlet (oil sump) of the engine. The system controls the temperature of oil supplied to the engine either by cooling or heating it. The oil passes through the inline heat module and then through the heat exchanger. A process controller maintains the desired temperature of oil by controlling the flow of shop water and the oil heater temperature. Thereafter this oil at the desired temperature is supplied to the engine.",
    images: ["/product-images/OCS 8.webp"],
  },
];

const ProductsPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [slideIndex, setSlideIndex] = useState<number>(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setSlideIndex(0);
    document.body.style.overflow = "hidden";
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    document.body.style.overflow = "";
  };

  const prevSlide = () => {
    if (!selectedProduct) return;
    setSlideIndex((i) => (i - 1 + selectedProduct.images.length) % selectedProduct.images.length);
  };
  const nextSlide = () => {
    if (!selectedProduct) return;
    setSlideIndex((i) => (i + 1) % selectedProduct.images.length);
  };
  const goToSlide = (i: number) => {
    setSlideIndex(i);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-24">
      {/* Page heading */}
      {/* Page heading with Glow Effect */}
<div className="mx-auto mb-10 w-fit text-center">
  <div className="relative inline-block group">
    {/* Actual Title */}
    <h1 className="text-3xl md:text-4xl font-bold p-4 rounded-lg text-white bg-gradient-to-r from-orange-400 to-orange-700 relative z-10">
      Our Products
    </h1>

    {/* Blue Glow effect */}
    <div className="absolute inset-0 -m-1 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-75 blur-none group-hover:blur-md z-0 transition-all duration-500 animate-pulse"></div>

    {/* Subtle Highlight effect */}
    <div className="absolute inset-0 -m-0.5 rounded-lg border-2 border-transparent group-hover:border-blue-200 z-0 transition-colors duration-500"></div>

    {/* Outer Shadow for depth */}
    <div className="absolute inset-0 rounded-lg shadow-none group-hover:shadow-xl group-hover:shadow-blue-500/50 z-0 transition-shadow duration-500"></div>
  </div>
</div>


      {/* Products list (vertical, ordered as requested) */}
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => openProduct(product)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openProduct(product);
            }}
            className="cursor-pointer flex flex-col md:flex-row-reverse bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {/* Image (right on md+, stacked on mobile) */}
            <div className="md:w-1/2 w-full h-64 md:h-auto flex-shrink-0">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Text (left on md+, stacked below on mobile) */}
            <div className="flex-1 flex flex-col p-6 text-left md:w-1/2">
              <h2 className="text-3xl font-bold mb-3">{product.name}</h2>
              {/* short description on the card, truncated to a couple of lines */}
              <p className="text-gray-600 line-clamp-3">{product.shortDescription}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div
          aria-modal="true"
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* backdrop */}
          <div
            className="fixed inset-0 bg-black/60"
            onClick={closeProduct}
            aria-hidden="true"
          />

          {/* panel */}
          <div className="relative z-50 w-full max-w-6xl mx-4 md:mx-8 bg-white rounded-xl overflow-hidden shadow-xl max-h-[90vh]">
            {/* make layout column on small screens, row on md+, full height so children can scroll */}
            <div className="flex flex-col md:flex-row h-full">
              {/* LEFT: slider (on small screens this is top; on md+ it's left) */}
              <div className="md:w-2/3 w-full bg-white flex flex-col items-center justify-center relative overflow-auto">
                <div className="w-full flex items-center justify-center p-4">
                  <button
                    onClick={prevSlide}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 hover:bg-black/70 p-2 shadow"
                  >
                    ‹
                  </button>

                  <img
                    src={selectedProduct.images[slideIndex]}
                    alt={`${selectedProduct.name} view ${slideIndex + 1}`}
                    className="max-h-[60vh] md:max-h-[70vh] w-auto max-w-full object-contain bg-white"
                    loading="lazy"
                    decoding="async"
                  />

                  <button
                    onClick={nextSlide}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 hover:bg-black/70 p-2 shadow"
                  >
                    ›
                  </button>
                </div>

                {selectedProduct.images.length > 1 && (
                  <div className="w-full py-3 px-4 bg-gray-100 flex items-center justify-center gap-3 overflow-x-auto">
                    {selectedProduct.images.map((img, i) => (
                      <button
                        key={img + i}
                        onClick={() => goToSlide(i)}
                        className={`rounded-md overflow-hidden border-2 focus:outline-none ${
                          i === slideIndex ? "border-orange-400" : "border-transparent"
                        }`}
                        aria-label={`Show image ${i + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${selectedProduct.name} thumbnail ${i + 1}`}
                          className="h-18 w-24 object-cover bg-white"
                          loading="lazy"
                          decoding="async"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT: details (on small screens this is below; on md+ it's right) */}
              <aside className="md:w-1/3 w-full md:max-h-[80vh] max-h-[40vh] overflow-y-auto p-6 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3x1 font-bold">{selectedProduct.name}</h3>
                  <button
                    onClick={closeProduct}
                    className="text-gray-500 hover:text-gray-800"
                    aria-label="Close product viewer"
                  >
                    ✕
                  </button>
                </div>

                <div className="prose prose-sm max-w-none text-gray-700 text-justify font-bold">
                  <p>{selectedProduct.description}</p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
