// src/pages/GalleryPage.tsx — Variant A: Sunburst Collage (fun orange theme with gradient background)
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type GalleryItem = {
  id: string;
  url: string;
  size?: number | null;
  lastModified?: string | null;
};

const API_ROOT = (process.env.REACT_APP_CONTACT_API || "").replace(/\/$/, "");
function apiUrl(path = "") {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${API_ROOT}${path}`;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiUrl("/gallery"), { method: "GET" });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to load gallery: ${res.status} ${txt}`);
        }
        const data = await res.json();
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Failed to load gallery");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const openAt = useCallback((i: number) => setOpenIndex(i), []);
  const closeLightbox = useCallback(() => setOpenIndex(null), []);
  const showNext = useCallback(() => {
    if (openIndex === null) return;
    setOpenIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [openIndex, items.length]);
  const showPrev = useCallback(() => {
    if (openIndex === null) return;
    setOpenIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  }, [openIndex, items.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (openIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openIndex, closeLightbox, showNext, showPrev]);

  const tileVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.05, rotate: 0.5 },
  };

  const lightboxVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-orange-50 via-orange-100/80 to-orange-200/60">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          {/* Page heading with Glow Effect */}
          <div className="mx-auto mb-10 w-fit text-center">
            <div className="relative inline-block group">
              <h1 className="text-3xl md:text-4xl font-bold p-4 rounded-lg text-white bg-gradient-to-r from-orange-400 to-orange-700 relative z-10">
                Gallery
              </h1>
              <div className="absolute inset-0 -m-1 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-75 blur-none group-hover:blur-md z-0 transition-all duration-500 animate-pulse"></div>
              <div className="absolute inset-0 -m-0.5 rounded-lg border-2 border-transparent group-hover:border-blue-200 z-0 transition-colors duration-500"></div>
              <div className="absolute inset-0 rounded-lg shadow-none group-hover:shadow-xl group-hover:shadow-blue-500/50 z-0 transition-shadow duration-500"></div>
            </div>
          </div>
          <p className="text-gray-700 italic mt-2">
            Bursting with moments — a vibrant showcase of our creativity.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-24 text-gray-500">Loading gallery…</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4">
            <strong>Error:</strong> {error}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 text-gray-500">No photos available yet.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((it, idx) => (
                <motion.div
                  key={it.id}
                  className="relative rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg border border-orange-100 bg-white/80 backdrop-blur-sm"
                  variants={tileVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  onClick={() => openAt(idx)}
                  transition={{ duration: 0.45 }}
                >
                  <img
                    src={it.url}
                    alt={it.id}
                    className="w-full h-48 object-cover rounded-xl"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-700/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                    <div className="bg-orange-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      View
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {openIndex !== null && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
                  variants={lightboxVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={closeLightbox}
                >
                  <motion.div
                    className="relative max-w-[90%] max-h-[90%] w-full bg-white rounded-lg shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                  >
                    <button
                      onClick={closeLightbox}
                      className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-2 hover:bg-orange-600"
                    >
                      ✕
                    </button>

                    <button
                      onClick={showPrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-orange-100 text-orange-700 font-bold rounded-full px-3 py-1"
                    >
                      ‹
                    </button>

                    <button
                      onClick={showNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-100 text-orange-700 font-bold rounded-full px-3 py-1"
                    >
                      ›
                    </button>

                    <div className="flex flex-col items-center p-4">
                      <img
                        src={items[openIndex].url}
                        alt={items[openIndex].id}
                        className="max-h-[70vh] object-contain rounded-lg shadow-md border-4 border-orange-200"
                      />
                      <div className="mt-3 text-xs text-orange-700 font-medium">
                        {items[openIndex].lastModified && (
                          <div>
                            {new Date(items[openIndex].lastModified as string).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}