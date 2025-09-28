import { useEffect, useMemo, useState } from "react";
import { Product } from "../types/product";
import { resolveImageKeys } from "../../api/images";

export default function ProductCard({
  product,
  onPreview,
  onEdit,
  onDelete,
}: {
  product: Product;
  onPreview: (id: string) => void;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}) {
  const [signed, setSigned] = useState<Record<string, string>>({});
  const [heroIdx, setHeroIdx] = useState(0);

  // Resolve S3 keys -> signed URLs
  useEffect(() => {
    const keys = (product.images || []).filter((s) => !/^https?:\/\//i.test(s));
    if (!keys.length) {
      setSigned({});
      return;
    }
    resolveImageKeys(keys)
      .then(setSigned)
      .catch(() => setSigned({}));
  }, [product.images]);

  // Reset hero index if product changes or images length changes
  useEffect(() => {
    setHeroIdx(0);
  }, [product.productid, product.images?.length]);

  const srcFor = (s: string) => (/^https?:\/\//i.test(s) ? s : signed[s] || "");

  // Build the list of resolved sources (empty string when not yet resolved)
  const resolvedImages = useMemo(
    () => (product.images || []).map((img) => srcFor(img)),
    [product.images, signed]
  );

  const hasImages = resolvedImages.length > 0;
  const hero = hasImages ? resolvedImages[heroIdx] : "";

  const next = () =>
    setHeroIdx((i) => (resolvedImages.length ? (i + 1) % resolvedImages.length : 0));
  const prev = () =>
    setHeroIdx((i) =>
      resolvedImages.length ? (i - 1 + resolvedImages.length) % resolvedImages.length : 0
    );

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border flex flex-col">
      {/* Hero area */}
      {hero && (
        <div className="relative w-full overflow-hidden">
          <div className="aspect-[16/10] sm:aspect-[16/9] md:h-48 lg:h-56 xl:h-64 md:aspect-auto">
            <img
              src={hero}
              alt={product.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {resolvedImages.length > 1 && (
            <>
              {/* Prev / Next */}
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white px-2 py-1 text-sm hover:bg-black/60"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white px-2 py-1 text-sm hover:bg-black/60"
                aria-label="Next image"
              >
                ›
              </button>

              {/* Dots */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {resolvedImages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i === heroIdx ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-lg sm:text-xl font-semibold mb-1 line-clamp-2">
          {product.title}
        </h2>
        <p className="text-gray-600 text-sm sm:text-[0.95rem] mb-3 line-clamp-2">
          {product.shortDesc}
        </p>

        <details className="mb-4">
          <summary className="cursor-pointer text-blue-600 hover:underline">
            View Details
          </summary>
          <p className="mt-2 text-gray-700 text-sm whitespace-pre-line">
            {product.longDesc}
          </p>

          {/* Thumbnails */}
          {resolvedImages.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto lg:flex-wrap">
              {resolvedImages.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setHeroIdx(i)}
                  className={`border rounded-md overflow-hidden flex-none outline-none ${
                    i === heroIdx ? "ring-2 ring-blue-500" : "ring-0"
                  }`}
                  title={`Image ${i + 1}`}
                >
                  {src ? (
                    <img
                      src={src}
                      alt={`${product.title} ${i}`}
                      className="h-16 w-28 sm:h-20 sm:w-32 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.visibility =
                          "hidden";
                      }}
                    />
                  ) : (
                    <div className="h-16 w-28 sm:h-20 sm:w-32 bg-gray-100 grid place-items-center text-xs text-gray-500">
                      …
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </details>

        <div className="mt-auto">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-gray-500 truncate" title={product.productid}>
              ID: {product.productid}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between mt-3 gap-2">
            <button
              onClick={() => onPreview(product.productid)}
              className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
              View on Site
            </button>
            <button
              onClick={() => onEdit(product)}
              className="px-3 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700 text-sm"
            >
              Edit / Add Images
            </button>
            <button
              onClick={() => onDelete(product.productid)}
              className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
