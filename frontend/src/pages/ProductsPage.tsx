import React, { useEffect, useMemo, useState } from "react";
import { getProducts } from "../api/products";
import { resolveImageKeys } from "../api/images";

// Public-site shape aligned with Admin (so both speak the same language)
type UiProduct = {
  productid: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  images: string[];
};

// Helper: map API product -> UiProduct
function mapApiToUi(p: any): UiProduct {
  return {
    productid: p.productId ?? p.productid ?? "",
    title: p.title ?? "",
    shortDesc: p.shortDescription ?? p.shortDesc ?? "",
    longDesc: p.description ?? p.longDesc ?? "",
    images: Array.isArray(p.images) ? p.images : p.imageUrl ? [p.imageUrl] : [],
  };
}

// Is a string already a URL?
const isHttpUrl = (s: string) => /^https?:\/\//i.test(s);

const ProductsPage: React.FC = () => {
  // fetched products (UI shape)
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // per-product first image (card thumbnail) after presigning if needed
  const [thumbs, setThumbs] = useState<Record<string, string>>({});

  // modal state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProduct = useMemo(
    () => products.find((p) => p.productid === selectedId) || null,
    [products, selectedId]
  );
  const [slideIndex, setSlideIndex] = useState(0);

  // resolve all images for selected product
  const [modalSigned, setModalSigned] = useState<Record<string, string>>({});

  // ===== Fetch products on mount =====
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const api = await getProducts(); // ApiProduct[]
        const ui = (api || []).map(mapApiToUi).filter((p) => p.productid);
        if (!alive) return;
        setProducts(ui);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Failed to load products");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ===== Resolve first image per product for the grid =====
  useEffect(() => {
    const toResolve: string[] = [];
    const direct: Record<string, string> = {};
    for (const p of products) {
      const first = p.images?.[0];
      if (!first) continue;
      if (isHttpUrl(first)) {
        direct[p.productid] = first;
      } else {
        toResolve.push(first);
      }
    }

    if (Object.keys(direct).length) {
      setThumbs((prev) => ({ ...prev, ...direct }));
    }

    if (toResolve.length === 0) {
      const blank: Record<string, string> = {};
      for (const p of products) {
        if (!p.images?.length) blank[p.productid] = "";
      }
      if (Object.keys(blank).length) {
        setThumbs((prev) => ({ ...prev, ...blank }));
      }
      return;
    }

    let cancelled = false;
    resolveImageKeys(toResolve)
      .then((map) => {
        if (cancelled) return;
        const updates: Record<string, string> = {};
        for (const p of products) {
          const first = p.images?.[0];
          if (!first) continue;
          if (!isHttpUrl(first) && map[first]) {
            updates[p.productid] = map[first];
          }
        }
        if (Object.keys(updates).length) {
          setThumbs((prev) => ({ ...prev, ...updates }));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [products]);

  // ===== Modal: reset state when product changes =====
  useEffect(() => {
    setSlideIndex(0);
    setModalSigned({});
  }, [selectedId]);

  // ===== Modal: resolve all images for selected product =====
  useEffect(() => {
    const p = selectedProduct;
    if (!p) {
      setModalSigned({});
      return;
    }
    const keys = (p.images || []).filter((s) => !isHttpUrl(s));
    if (keys.length === 0) {
      setModalSigned({});
      return;
    }
    let cancelled = false;
    resolveImageKeys(keys)
      .then((map) => {
        if (!cancelled) setModalSigned(map);
      })
      .catch(() => {
        if (!cancelled) setModalSigned({});
      });
    return () => {
      cancelled = true;
    };
  }, [selectedProduct]);

  // ===== Derived: resolved images for modal =====
  const modalImages = useMemo(() => {
    const imgs = selectedProduct?.images || [];
    return imgs.map((img) => (isHttpUrl(img) ? img : modalSigned[img] || ""));
  }, [selectedProduct, modalSigned]);

  // ===== Scroll to top on initial mount =====
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // ===== Event handlers =====
  const openProduct = (productId: string) => {
    setSelectedId(productId);
    setSlideIndex(0);
    document.body.style.overflow = "hidden";
  };

  const closeProduct = () => {
    setSelectedId(null);
    document.body.style.overflow = "";
  };

  const prevSlide = () => {
    if (!selectedProduct) return;
    setSlideIndex((i) =>
      (i - 1 + (selectedProduct.images?.length || 1)) %
      (selectedProduct.images?.length || 1)
    );
  };

  const nextSlide = () => {
    if (!selectedProduct) return;
    setSlideIndex((i) =>
      (i + 1) % (selectedProduct.images?.length || 1)
    );
  };

  const goToSlide = (i: number) => setSlideIndex(i);

  // ===== Render =====
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-orange-50/60 to-orange-100 p-8 pt-28">
        <div className="max-w-4xl mx-auto text-center text-gray-600">
          Loading products…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-orange-50/60 to-orange-100 p-8 pt-28">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600 mb-3">Failed to load products.</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-orange-50/60 to-orange-100 p-8 pt-28">
      {/* Page heading with Glow Effect */}
      <div className="mx-auto mb-10 w-fit text-center">
        <div className="relative inline-block group">
          <h1 className="text-3xl md:text-4xl font-bold p-4 rounded-lg text-white bg-gradient-to-r from-orange-400 to-orange-700 relative z-10 shadow-sm">
            Our Products
          </h1>

          <div className="absolute inset-0 -m-1 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-75 blur-none group-hover:blur-md z-0 transition-all duration-500 animate-pulse" />
          <div className="absolute inset-0 -m-0.5 rounded-lg border-2 border-transparent group-hover:border-blue-200 z-0 transition-colors duration-500" />
          <div className="absolute inset-0 rounded-lg shadow-none group-hover:shadow-xl group-hover:shadow-blue-500/40 z-0 transition-shadow duration-500" />
        </div>
      </div>

      {/* Products list */}
      <div className="max-w-6xl mx-auto grid gap-8">
        {products.length === 0 && (
          <div className="text-center text-gray-600">No products to display.</div>
        )}

        {products.map((product) => (
          <div
            key={product.productid}
            onClick={() => openProduct(product.productid)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openProduct(product.productid);
            }}
            className="cursor-pointer flex flex-col md:flex-row-reverse items-stretch bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            {/* Image (right on md+, stacked on mobile) */}
            <div className="md:w-1/2 w-full h-64 md:h-auto flex-shrink-0">
              {(() => {
                const first = product.images?.[0];
                const src = first
                  ? (isHttpUrl(first) ? first : (thumbs[product.productid] || ""))
                  : "";
                return src ? (
                  <img
                    src={src}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      // hide broken images gracefully
                      (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-orange-50 grid place-items-center text-orange-600">
                    <div className="text-sm font-medium">No image</div>
                  </div>
                );
              })()}
            </div>

            {/* Text (left on md+, stacked below on mobile) */}
            <div className="flex-1 flex flex-col p-6 md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-900">{product.title}</h2>
              <p className="text-gray-700 line-clamp-3 mb-4">{product.shortDesc}</p>

              <div className="mt-auto flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-sm font-medium">
                  View details
                </span>
                <button
                  onClick={() => openProduct(product.productid)}
                  className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white font-medium shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  aria-label={`Open ${product.title}`}
                >
                  Open
                </button>
              </div>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeProduct}
            aria-hidden="true"
          />

          {/* panel */}
          <div className="relative z-50 w-full max-w-6xl mx-4 md:mx-8 bg-white rounded-xl overflow-hidden shadow-xl max-h-[90vh]">
            <div className="flex flex-col md:flex-row h-full">
              {/* LEFT: slider */}
              <div className="md:w-2/3 w-full bg-white flex flex-col items-center justify-center relative overflow-auto">
                <div className="w-full flex items-center justify-center p-4 relative">
                  {selectedProduct.images.length > 1 && (
                    <button
                      onClick={prevSlide}
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/30 hover:bg-black/50 p-2 shadow text-white"
                    >
                      ‹
                    </button>
                  )}

                  {/* ✅ Render <img> only if we have a non-empty URL */}
                  {modalImages[slideIndex] ? (
                    <img
                      src={modalImages[slideIndex]!}
                      alt={`${selectedProduct.title} view ${slideIndex + 1}`}
                      className="max-h-[60vh] md:max-h-[70vh] w-auto max-w-full object-contain bg-white"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                      }}
                    />
                  ) : (
                    <div className="w-full h-[40vh] bg-gray-50 grid place-items-center text-gray-500">
                      Loading image…
                    </div>
                  )}

                  {selectedProduct.images.length > 1 && (
                    <button
                      onClick={nextSlide}
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/30 hover:bg-black/50 p-2 shadow text-white"
                    >
                      ›
                    </button>
                  )}
                </div>

                {selectedProduct.images.length > 1 && (
                  <div className="w-full py-3 px-4 bg-gray-100 flex items-center justify-center gap-3 overflow-x-auto">
                    {modalImages.map((img, i) => (
                      <button
                        key={`${selectedProduct.productid}-${i}`}
                        onClick={() => goToSlide(i)}
                        className={`rounded-md overflow-hidden border-2 focus:outline-none ${i === slideIndex ? "border-orange-400" : "border-transparent"}`}
                        aria-label={`Show image ${i + 1}`}
                      >
                        {img ? (
                          <img
                            src={img}
                            alt={`${selectedProduct.title} thumbnail ${i + 1}`}
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

              {/* RIGHT: details — preserve original formatting */}
              <aside className="md:w-1/3 w-full md:max-h-[80vh] max-h-[40vh] overflow-y-auto p-6 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedProduct.title}</h3>
                  <button
                    onClick={closeProduct}
                    className="text-gray-500 hover:text-gray-800 ml-4"
                    aria-label="Close product viewer"
                  >
                    ✕
                  </button>
                </div>

                <div className="prose prose-sm max-w-none text-gray-800">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {selectedProduct.longDesc}
                  </div>
                </div>

                {/* small metadata area */}
                <div className="mt-auto pt-4 text-sm text-gray-600">
                  <div className="flex gap-2 items-center">
                    <span className="inline-block px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">Product ID</span>
                    <span className="text-xs text-gray-700">{selectedProduct.productid}</span>
                  </div>
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
