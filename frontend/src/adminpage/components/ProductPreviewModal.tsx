import { useEffect, useMemo, useState } from "react";
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
  }, [product?.productid]);

  // Resolve any S3 keys to signed URLs so images render correctly
  useEffect(() => {
    if (!product) return;               // <-- check inside hook
    const raw = product.images || [];
    const keys = raw.filter((s) => !/^https?:\/\//i.test(s));
    if (!keys.length) {
      setSigned({});
      return;
    }
    resolveImageKeys(keys)
      .then(setSigned)
      .catch(() => setSigned({}));
  }, [product?.images, product?.productid]);

  // Build resolved image list (empty string while presigning)
  const resolvedImages = useMemo(() => {
    const imgs = product?.images || [];
    return imgs.map((img) =>
      /^https?:\/\//i.test(img) ? img : signed[img] || ""
    );
  }, [product?.images, signed]);

  // Close on Esc, navigate with arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "ArrowRight") nextImg();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, resolvedImages.length]); // safe even if product is null

  // --- navigation helpers ---
  const prevImg = () =>
    setImgIdx((i) =>
      resolvedImages.length ? (i - 1 + resolvedImages.length) % resolvedImages.length : 0
    );
  const nextImg = () =>
    setImgIdx((i) => (resolvedImages.length ? (i + 1) % resolvedImages.length : 0));

  // ✅ Only now we return early if no product
  if (!product) return null;

  const hasImages = resolvedImages.length > 0;
  const hero = hasImages ? resolvedImages[imgIdx] : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-[96vw] max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 grid place-items-center"
          aria-label="Close"
          title="Close (Esc)"
        >
          ×
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
          {/* Gallery */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="relative flex-1 grid place-items-center p-4 sm:p-6">
              {resolvedImages.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 shadow hover:bg-white"
                    aria-label="Previous image"
                    title="Previous (←)"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 shadow hover:bg-white"
                    aria-label="Next image"
                    title="Next (→)"
                  >
                    ›
                  </button>
                </>
              )}

              <div className="w-full max-h-[60vh]">
                {hero ? (
                  <img
                    src={hero}
                    alt={product.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />
                ) : (
                  <div className="w-full h-[40vh] bg-gray-100 grid place-items-center text-gray-500">
                    Loading image…
                  </div>
                )}
              </div>

              {resolvedImages.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
                  {resolvedImages.map((_, i) => (
                    <span
                      key={i}
                      className={`h-2 w-2 rounded-full ${
                        i === imgIdx ? "bg-gray-800" : "bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {resolvedImages.length > 0 && (
              <div className="border-t bg-gray-50 p-3 overflow-x-auto">
                <div className="flex gap-3">
                  {resolvedImages.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`h-20 w-28 shrink-0 rounded-lg border ${
                        i === imgIdx
                          ? "border-blue-500 ring-2 ring-blue-300"
                          : "border-gray-300"
                      } overflow-hidden bg-white`}
                      title={`Image ${i + 1}`}
                    >
                      {src ? (
                        <img src={src} alt={`${product.title} ${i}`} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-xs text-gray-500">
                          …
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">{product.title}</h3>
            {product.shortDesc && (
              <p className="text-gray-700 mb-4">{product.shortDesc}</p>
            )}
            {product.longDesc ? (
              <div className="prose max-w-none">
                <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                  {product.longDesc}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No additional details.</p>
            )}
            <div className="mt-6 text-xs text-gray-500">
              <div>
                <span className="font-mono">ID:</span> {product.productid}
              </div>
              <div>Images: {product.images?.length ?? 0}</div>
              <div className="mt-3 text-gray-600">
                This is a preview of how the product media and content will appear on the site.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
