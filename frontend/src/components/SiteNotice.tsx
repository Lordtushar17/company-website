import React, { useEffect, useRef, useState } from "react";

const SITE_NOTICE_KEY = "yantrashilpa_site_notice";

/**
 * Responsive, seamless, single-line news ticker.
 * - Fixed under header (uses --site-header-height)
 * - Exposes --site-notice-height for body padding
 * - Duration auto-computed from measured text width (px/sec)
 */
export default function SiteNotice() {
  const [text, setText] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  // measurement refs
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const measureCopyRef = useRef<HTMLDivElement | null>(null);

  // computed animation duration (seconds as string, e.g. "18.4s")
  const [duration, setDuration] = useState<string>("17s");
  // measured single-copy width in px (used to set exact widths for each copy)
  const [copyWidth, setCopyWidth] = useState<number>(0);

  const setNoticeHeightVar = () => {
    const h = containerRef.current?.offsetHeight ?? 0;
    document.documentElement.style.setProperty("--site-notice-height", `${h}px`);
  };

  // Load text and watch for updates
  useEffect(() => {
    setText(localStorage.getItem(SITE_NOTICE_KEY) || "");

    const onCustom = (e: Event) => {
      const d = (e as CustomEvent).detail as { text?: string } | undefined;
      setText((d?.text ?? localStorage.getItem(SITE_NOTICE_KEY)) || "");
      requestAnimationFrame(setNoticeHeightVar);
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === SITE_NOTICE_KEY) {
        setText(e.newValue || "");
        requestAnimationFrame(setNoticeHeightVar);
      }
    };

    window.addEventListener("site_notice_updated", onCustom as EventListener);
    window.addEventListener("storage", onStorage);
    requestAnimationFrame(setNoticeHeightVar);

    return () => {
      window.removeEventListener("site_notice_updated", onCustom as EventListener);
      window.removeEventListener("storage", onStorage);
      document.documentElement.style.setProperty("--site-notice-height", "0px");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-measure height on resize or text change
  useEffect(() => {
    setNoticeHeightVar();
    const onResize = () => {
      setNoticeHeightVar();
      computeTickerMetrics();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Compute exact copy width and a duration that scales with width
  const computeTickerMetrics = () => {
    const copyEl = measureCopyRef.current;
    const vp = viewportRef.current;
    if (!copyEl || !vp) return;

    // Measure exact pixel width of the content (no wrapping)
    const w = copyEl.scrollWidth;
    setCopyWidth(w);

    // Set speed ~80 px/sec (tweakable). Distance per cycle is one copy width (because 0% → -50% on 2 copies).
    const SPEED_PX_PER_SEC = 80; // slower on small screens, change to 100-140 if you want faster
    const secs = Math.max(8, w / SPEED_PX_PER_SEC); // clamp to a minimum duration
    setDuration(`${secs.toFixed(2)}s`);
  };

  useEffect(() => {
    // Defer until the DOM paints the measuring copy
    const id = requestAnimationFrame(computeTickerMetrics);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  if (!text.trim()) {
    document.documentElement.style.setProperty("--site-notice-height", "0px");
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: "var(--site-header-height, 0px)",
        left: 0,
        right: 0,
        zIndex: 49, // header is z-50
      }}
    >
      <div className="w-full bg-orange-600/70 text-black shadow">
        {/* Ticker viewport */}
        <div
          ref={viewportRef}
          className="relative overflow-hidden h-8 sm:h-9 md:h-10 flex items-center"
        >
          {/* Animated track: two copies side-by-side (seamless) */}
          <div
            className="flex whitespace-nowrap"
            style={{
              width: copyWidth ? `${copyWidth * 2}px` : "200%",
              animation: `siteNoticeTicker ${duration} linear infinite`,
              willChange: "transform",
            }}
          >
            <span
              className="px-4 font-medium text-xs sm:text-sm md:text-base leading-none"
              style={{ whiteSpace: "nowrap", width: copyWidth ? `${copyWidth}px` : undefined }}
            >
              {text}
            </span>
            <span
              className="px-4 font-medium text-xs sm:text-sm md:text-base leading-none"
              style={{ whiteSpace: "nowrap", width: copyWidth ? `${copyWidth}px` : undefined }}
              aria-hidden="true"
            >
              {text}
            </span>
          </div>

          {/* Hidden measuring copy (no animation, off-layout) */}
          <div
            ref={measureCopyRef}
            className="absolute -z-10 opacity-0 pointer-events-none px-4 font-medium text-xs sm:text-sm md:text-base"
            style={{ whiteSpace: "nowrap" }}
            aria-hidden="true"
          >
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}
