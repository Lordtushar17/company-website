import React, { useEffect, useRef, useState } from "react";

const SITE_NOTICE_KEY = "yantrashilpa_site_notice";

/**
 * SiteNotice (news-style ticker):
 * - Fixed directly under the header using top: var(--site-header-height)
 * - Writes --site-notice-height so the page can offset body padding
 * - Reads from localStorage and listens to:
 *    - CustomEvent "site_notice_updated" (from Admin)
 *    - "storage" (cross-tab updates)
 * - Shows a single-line seamless ticker that moves from right → left and loops.
 */
export default function SiteNotice() {
  const [text, setText] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  const measureAndSet = () => {
    const h = containerRef.current?.offsetHeight ?? 0;
    document.documentElement.style.setProperty("--site-notice-height", `${h}px`);
  };

  useEffect(() => {
    setText(localStorage.getItem(SITE_NOTICE_KEY) || "");

    const onCustom = (e: Event) => {
      const d = (e as CustomEvent).detail as { text?: string } | undefined;
      // ✅ add parentheses so ?? and || don't mix
      setText((d?.text ?? localStorage.getItem(SITE_NOTICE_KEY)) || "");
      requestAnimationFrame(measureAndSet);
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === SITE_NOTICE_KEY) {
        setText(e.newValue || "");
        requestAnimationFrame(measureAndSet);
      }
    };

    window.addEventListener("site_notice_updated", onCustom as EventListener);
    window.addEventListener("storage", onStorage);
    requestAnimationFrame(measureAndSet);

    return () => {
      window.removeEventListener("site_notice_updated", onCustom as EventListener);
      window.removeEventListener("storage", onStorage);
      document.documentElement.style.setProperty("--site-notice-height", "0px");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    measureAndSet();
    window.addEventListener("resize", measureAndSet);
    return () => window.removeEventListener("resize", measureAndSet);
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
        zIndex: 49, // header uses z-50
      }}
    >
      <div className="w-full bg-orange-600/70 text-black shadow">
        {/* Ticker viewport */}
        <div className="relative overflow-hidden h-8 md:h-10 flex items-center">
          {/* Ticker track: two copies side-by-side, 200% width for seamless loop */}
          <div
            className="flex whitespace-nowrap"
            style={{
              width: "200%",
              animation: "siteNoticeTicker 10s linear infinite", // adjust duration for speed
              willChange: "transform",
            }}
          >
            <span className="w-1/2 px-4">{text}</span>
            <span className="w-1/2 px-4">{text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
