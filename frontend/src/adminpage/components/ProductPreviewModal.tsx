import { useEffect, useMemo, useState, useCallback } from "react";
import { Product } from "../types/product";
import { resolveImageKeys } from "../../api/images";

export default function ProductPreviewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const [signed, setSigned] = useState<Record<string, string>>({});

  // Reset state when a new product arrives
  useEffect(() => {
    setImgIdx(0);
    setSigned({});
  }, [product]);

  // Resolve any S3 keys to signed URLs so images render correctly
  useEffect(() => {
    if (!product) return;
    const raw = product.images || [];
    const keys = raw.filter((s) => !/^https?:\/\//i.test(s));
    if (!keys.length) {
      setSigned({});
      return;
    }
    resolveImageKeys(keys)
      .then(setSigned)
      .catch(() => setSigned({}));
  }, [product]);

  // Build resolved image list (empty string while presigning)
  const resolvedImages = useMemo(() => {
    const imgs = product?.images || [];
    return imgs.map((img) =>
      /^https?:\/\//i.test(img) ? img : signed[img] || ""
    );
  }, [product, signed]);

  // --- navigation helpers (memoized for stable deps) ---
  const prevImg = useCallback(() => {
    setImgIdx((i) =>
      resolvedImages.length
        ? (i - 1 + resolvedImages.length) % resolvedImages.length
        : 0
    );
  }, [resolvedImages.length]);

  const nextImg = useCallback(() => {
    setImgIdx((i) =>
      resolvedImages.length ? (i + 1) % resolvedImages.length : 0
    );
  }, [resolvedImages.length]);

  // Close on Esc, navigate with arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "ArrowRight") nextImg();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prevImg, nextImg]);

  if (!product) return null;

  const hero = resolvedImages.length ? resolvedImages[imgIdx] : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

      {/* panel */}
      <div
        className="relative z-50 w-full max-w-6xl mx-4 md:mx-8 bg-white rounded-xl overflow-hidden shadow-xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* LEFT: slider (match public site sizing) */}
          <div className="md:w-2/3 w-full bg-white flex flex-col items-center justify-center relative overflow-auto">
            <div className="w-full flex items-center justify-center p-4">
              {resolvedImages.length > 1 && (
                <button
                  onClick={prevImg}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 hover:bg-black/70 p-2 shadow"
                >
                  ‹
                </button>
              )}

              {hero ? (
                <img
                  src={hero}
                  alt={`${product.title} view ${imgIdx + 1}`}
                  className="max-h-[60vh] md:max-h-[70vh] w-auto max-w-full object-contain bg-white"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                  }}
                />
              ) : (
                <div className="w-full h-[40vh] bg-gray-100 grid place-items-center text-gray-500">
                  Loading image…
                </div>
              )}

              {resolvedImages.length > 1 && (
                <button
                  onClick={nextImg}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/40 hover:bg-black/70 p-2 shadow"
                >
                  ›
                </button>
              )}
            </div>

            {resolvedImages.length > 1 && (
              <div className="w-full py-3 px-4 bg-gray-100 flex items-center justify-center gap-3 overflow-x-auto">
                {resolvedImages.map((src, i) => (
                  <button
                    key={`${product.productid}-${i}`}
                    onClick={() => setImgIdx(i)}
                    className={`rounded-md overflow-hidden border-2 focus:outline-none ${
                      i === imgIdx ? "border-orange-400" : "border-transparent"
                    }`}
                    aria-label={`Show image ${i + 1}`}
                  >
                    {src ? (
                      <img
                        src={src}
                        alt={`${product.title} thumbnail ${i + 1}`}
                        className="h-18 w-24 object-cover bg-white"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="h-18 w-24 grid place-items-center text-xs text-gray-500 bg-gray-100">
                        …
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: details */}
          <aside className="md:w-1/3 w-full md:max-h-[80vh] max-h-[40vh] overflow-y-auto p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold">{product.title}</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close product viewer"
              >
                ✕
              </button>
            </div>

            {/* Preserve original spacing, newlines, and bullet characters */}
            <div className="prose prose-sm max-w-none text-gray-800">
              <div className="whitespace-pre-wrap leading-relaxed">
                {product.longDesc}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
