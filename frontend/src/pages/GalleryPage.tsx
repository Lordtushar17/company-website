// src/pages/GalleryPage.tsx
import React, { useEffect, useState, useCallback } from "react";

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

  // Keyboard navigation
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
      {/* Title with Glow Effect */}
      <div className="mb-12 text-center">
        <div className="relative inline-block group">
          {/* Actual Title */}
          <h1 className="text-4xl md:text-5xl font-bold p-4 rounded-lg text-white bg-gradient-to-r from-orange-400 to-orange-700 relative z-10">
            Gallery
          </h1>

          {/* Orange Glow */}
          <div className="absolute inset-0 -m-1 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-75 blur-none group-hover:blur-md z-0 transition-all duration-500 animate-pulse"></div>

          {/* Highlight Border */}
          <div className="absolute inset-0 -m-0.5 rounded-lg border-2 border-transparent group-hover:border-blue-200 z-0 transition-colors duration-500"></div>

          {/* Outer Shadow */}
          <div className="absolute inset-0 rounded-lg shadow-none group-hover:shadow-xl group-hover:shadow-blue-500/50 z-0 transition-shadow duration-500"></div>
        </div>

        {/* Subtitle */}
        <p className="mt-4 text-gray-700 italic text-lg font-bold">
          A visual journey through our projects, creativity, and proud celebrations.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading gallery…</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4">
          <strong>Error:</strong> {error}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No photos available yet.</div>
      ) : (
        <>
          {/* Masonry Layout */}
          <div
            className="masonry -mx-3"
            style={{
              columnGap: "1.5rem", // increased from 1rem to 1.5rem
            }}
          >
            <style>{`
              .masonry { column-count: 2; }
              @media (min-width: 640px) { .masonry { column-count: 3; } }
              @media (min-width: 1024px) { .masonry { column-count: 4; } }
              .masonry-item { break-inside: avoid; margin: 0 0 1.5rem; display: inline-block; width: 100%; } /* increased vertical gap */
            `}</style>

            {items.map((it, idx) => (
              <div
                key={it.id}
                className="masonry-item px-3"
                onClick={() => openAt(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") openAt(idx);
                }}
              >
                <div className="relative group rounded-lg overflow-hidden shadow-md bg-white cursor-pointer transform transition-all duration-200 hover:-translate-y-1">
                  <img
                    src={it.url}
                    alt=""
                    loading="lazy"
                    className="w-full h-auto block rounded-lg"
                    style={{ display: "block" }}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out pointer-events-auto">
                      <div className="flex items-center gap-2 bg-black/60 text-white px-3 py-2 rounded-full shadow-sm">
                        <span className="text-sm font-medium">View</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox Modal */}
          {openIndex !== null && (
            <div
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={closeLightbox}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="relative max-w-[95%] max-h-[95%] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeLightbox}
                  className="absolute top-2 right-2 z-50 bg-white/90 rounded-full p-2 hover:bg-white"
                  aria-label="Close"
                >
                  ✕
                </button>

                <button
                  onClick={showPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-white/90 rounded-full p-2 hover:bg-white"
                  aria-label="Previous"
                >
                  ‹
                </button>

                <button
                  onClick={showNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-white/90 rounded-full p-2 hover:bg-white"
                  aria-label="Next"
                >
                  ›
                </button>

                <div className="bg-black flex items-center justify-center h-[70vh] sm:h-[80vh] overflow-hidden rounded">
                  <img
                    src={items[openIndex].url}
                    alt={items[openIndex].id}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="mt-3 text-center text-sm text-gray-200">
                  {items[openIndex].lastModified && (
                    <div className="text-xs text-gray-300 mt-1">
                      {new Date(items[openIndex].lastModified as string).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
