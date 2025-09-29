import React, { useEffect, useState } from "react";

/**
 * Simple notice editor for admin.
 * - Saves notice text to localStorage under key SITE_NOTICE_KEY
 * - Dispatches a window CustomEvent "site_notice_updated" with detail { text }
 *   so the public site can listen and update immediately.
 */

const SITE_NOTICE_KEY = "yantrashilpa_site_notice";

export default function NoticeSection() {
  const [text, setText] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SITE_NOTICE_KEY) || "";
      setText(saved);
      if (saved) {
        const meta = localStorage.getItem(`${SITE_NOTICE_KEY}:ts`) || null;
        setSavedAt(meta);
      }
    } catch {
      /* ignore storage errors */
    }
  }, []);

  const save = () => {
    try {
      localStorage.setItem(SITE_NOTICE_KEY, text);
      const ts = new Date().toISOString();
      localStorage.setItem(`${SITE_NOTICE_KEY}:ts`, ts);
      setSavedAt(ts);
      // broadcast so main site can react in real-time
      window.dispatchEvent(new CustomEvent("site_notice_updated", { detail: { text } }));
      setEditing(false);
      alert("Notice saved and published to the site.");
    } catch (err) {
      console.error(err);
      alert("Failed to save notice (storage error).");
    }
  };

  const clearNotice = () => {
    if (!window.confirm("Remove the current notice from the site?")) return;
    try {
      localStorage.removeItem(SITE_NOTICE_KEY);
      localStorage.removeItem(`${SITE_NOTICE_KEY}:ts`);
      setText("");
      setSavedAt(null);
      window.dispatchEvent(new CustomEvent("site_notice_updated", { detail: { text: "" } }));
    } catch {
      alert("Failed to clear notice.");
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Site Notice</h2>
          <p className="text-sm text-gray-500">Add a short announcement. It will appear on the main site (no DB used).</p>
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-36 border rounded p-2 resize-y"
          placeholder="Write a short notice or announcement (visible on public site)…"
        />

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => { setEditing(true); }}
            className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            onClick={save}
            className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            disabled={!editing && !text}
            title="Save & publish notice"
          >
            Save & Publish
          </button>

          <button
            onClick={clearNotice}
            className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            title="Remove notice from site"
          >
            Clear
          </button>

          {savedAt && (
            <div className="text-sm text-gray-500 ml-auto">
              Last published: {new Date(savedAt).toLocaleString()}
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-1">Preview</h3>
          <div className="p-3 rounded bg-gray-50 border text-sm text-gray-700 min-h-[48px]">
            {text ? <div style={{ whiteSpace: "pre-wrap" }}>{text}</div> : <span className="text-gray-400">No notice set.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
