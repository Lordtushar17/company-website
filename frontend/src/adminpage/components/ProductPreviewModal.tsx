import { useEffect, useState } from "react";
import { Product } from "../types/product";

export default function ProductPreviewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  useEffect(() => setImgIdx(0), [product]);

  if (!product) return null;

  const prevImg = () =>
    setImgIdx((i) => (i - 1 + product.images.length) % product.images.length);
  const nextImg = () =>
    setImgIdx((i) => (i + 1) % product.images.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 grid place-items-center"
        >
          ×
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
          {/* Gallery */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="relative flex-1 grid place-items-center p-6">
              <button
                onClick={prevImg}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white shadow"
              >
                ‹
              </button>
              <img
                src={product.images[imgIdx]}
                alt={product.title}
                className="max-h-[60vh] object-contain"
              />
              <button
                onClick={nextImg}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white shadow"
              >
                ›
              </button>
            </div>
            <div className="border-t bg-gray-50 p-3 overflow-x-auto">
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`h-20 w-28 shrink-0 rounded-lg border ${
                      i === imgIdx
                        ? "border-orange-400 ring-2 ring-orange-300"
                        : "border-gray-300"
                    } overflow-hidden bg-white`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${i}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{product.title}</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {product.longDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
