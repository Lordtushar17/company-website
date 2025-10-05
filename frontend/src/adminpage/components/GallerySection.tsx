// src/components/GallerySection.tsx
import React, { useEffect, useState } from "react";

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

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiUrl("/gallery"), {
          method: "GET",
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`List failed: ${res.status} ${txt}`);
        }
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || "Failed to load gallery");
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshKey]);

  const doRefresh = () => setRefreshKey((k) => k + 1);

  const onFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    // sometimes browsers fire change twice; handle idempotently
    const files = ev.target.files;
    if (!files || files.length === 0) {
      setSelectedFiles(null);
      return;
    }

    // size check: reject selection if any file > MAX_BYTES
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.size > MAX_BYTES) {
        const el = document.getElementById("gallery-file-input") as HTMLInputElement | null;
        if (el) el.value = "";
        setSelectedFiles(null);
        setError(`"${f.name}" is too large (${Math.round(f.size / 1024 / 1024 * 100) / 100} MB). Max allowed is 10 MB.`);
        return;
      }
    }

    // all good
    setError(null);
    setSelectedFiles(files);
  };

  const uploadFiles = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const f = selectedFiles[i];
        const form = new FormData();
        form.append("file", f, f.name);
        const res = await fetch(apiUrl("/gallery"), {
          method: "POST",
          body: form,
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Upload failed: ${res.status} ${txt}`);
        }
        // consume response
        await res.json().catch(() => null);
      }
      // clear input
      setSelectedFiles(null);
      const el = document.getElementById("gallery-file-input") as HTMLInputElement | null;
      if (el) el.value = "";
      doRefresh();
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm("Delete this image?")) return;
    setError(null);
    try {
      const url = new URL(apiUrl("/gallery"));
      url.searchParams.set("id", id);
      const res = await fetch(url.toString(), {
        method: "DELETE",
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Delete failed: ${res.status} ${txt}`);
      }
      doRefresh();
    } catch (e: any) {
      setError(e?.message || "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Gallery</h2>

        <div className="flex items-center gap-3">
          <input
            id="gallery-file-input"
            type="file"
            accept="image/*"
            multiple
            onChange={onFileChange}
            className="hidden"
          />
          {/* Use label htmlFor to avoid double-open */}
          <label
            htmlFor="gallery-file-input"
            className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm cursor-pointer hover:bg-blue-700"
          >
            Select files
          </label>

          <button
            onClick={uploadFiles}
            disabled={uploading || !selectedFiles || selectedFiles.length === 0}
            className={`px-3 py-2 rounded-md text-white text-sm ${
              uploading || !selectedFiles || selectedFiles.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>

          <button onClick={() => doRefresh()} className="px-3 py-2 rounded-md bg-gray-200 text-sm">
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500">No gallery images yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((it) => (
            <div key={it.id} className="bg-white rounded shadow p-2 flex flex-col">
              <div className="w-full h-40 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                <img src={it.url} alt={it.id} className="object-cover w-full h-full" />
              </div>

              <div className="mt-2 text-xs text-gray-600 break-all">{it.id}</div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => deleteItem(it.id)}
                  className="px-2 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
                <a href={it.url} target="_blank" rel="noreferrer" className="ml-auto px-2 py-1 rounded text-xs bg-gray-200">
                  Open
                </a>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {it.size ? `${Math.round((it.size / 1024) * 100) / 100} KB` : ""}{" "}
                {it.lastModified ? ` · ${new Date(it.lastModified).toLocaleString()}` : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
