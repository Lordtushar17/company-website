// src/adminpage/components/ContactsSection.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";

type Contact = {
  contactID: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  createdAt?: string;
  isRead?: boolean;
  source?: string;
};

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const toUtcIso = (local: string) => {
  if (!local) return "";
  try {
    return new Date(local).toISOString();
  } catch {
    return "";
  }
};

const formatIST = (utcIso?: string) => {
  if (!utcIso) return "";
  const d = new Date(utcIso);
  return d
    .toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/,/g, "");
};

export default function ContactsSection() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [active, setActive] = useState<Contact | null>(null);

  // build endpoint from env
  const CONTACT_API = (process.env.REACT_APP_CONTACT_API || "").replace(/\/$/, "");
  const MAIN_API = (process.env.REACT_APP_MAIN_API_BASE || "").replace(/\/$/, "");
  const BASE = CONTACT_API || MAIN_API || "";
  const ENDPOINT = BASE ? `${BASE}/contact` : "/contact";

  // --- fetch contacts from API ---
  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = await getAuthHeaders();

      const headers = new Headers();
      headers.set("Content-Type", "application/json");
      if (auth.Authorization) headers.set("Authorization", auth.Authorization);

      const res = await fetch(ENDPOINT, { method: "GET", headers });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || body?.message || `Failed to fetch (${res.status})`);
      }
      const json = await res.json().catch(() => ({}));
      const raw: Contact[] = json?.items ?? (Array.isArray(json) ? json : []);
      setItems(raw);
    } catch (e: any) {
      setError(e?.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }, [ENDPOINT]);

  // Initial load
  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // --- Filters ---
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const fromIso = from ? toUtcIso(from) : "";
    const toIso = to ? toUtcIso(to) : "";

    return items.filter((it) => {
      const matchText =
        !s ||
        (it.name || "").toLowerCase().includes(s) ||
        (it.email || "").toLowerCase().includes(s) ||
        (it.phone || "").toLowerCase().includes(s) ||
        (it.message || "").toLowerCase().includes(s);

      const ts = it.createdAt || "";
      const matchDate = (!fromIso || ts >= fromIso) && (!toIso || ts <= toIso);

      return matchText && matchDate;
    });
  }, [items, search, from, to]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this contact? This action cannot be undone.")) return;
    try {
      setLoading(true);
      setError(null);

      const auth = await getAuthHeaders();
      const headers = new Headers();
      if (auth.Authorization) headers.set("Authorization", auth.Authorization);

      const url = `${ENDPOINT}/${encodeURIComponent(id)}`;
      const res = await fetch(url, { method: "DELETE", headers });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || body?.message || `Delete failed (${res.status})`);
      }

      setItems((prev) => prev.filter((p) => p.contactID !== id));
      if (active?.contactID === id) setActive(null);
    } catch (e: any) {
      setError(e?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* --- Header / Filters / Reload --- */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-4 gap-3">
        <h2 className="text-2xl font-bold">Contacts</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <input
            type="text"
            placeholder="Search by name, email, phone or message…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-1 w-64"
          />

          <label className="text-sm text-gray-600 flex flex-col">
            From:
            <input
              type="datetime-local"
              className="border rounded px-2 py-1"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="text-sm text-gray-600 flex flex-col">
            To:
            <input
              type="datetime-local"
              className="border rounded px-2 py-1"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>

          <button
            onClick={loadContacts}
            disabled={loading}
            className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? "Reloading…" : "Reload"}
          </button>
        </div>
      </div>

      {loading && <div className="text-gray-500 mb-2">Loading…</div>}
      {error && (
        <div className="text-red-700 bg-red-50 border border-red-200 rounded p-2 mb-2">
          {error}
        </div>
      )}

      {/* --- Contacts Table --- */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Time (IST)</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Phone</th>
              <th className="text-left p-2">Message</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.contactID} className="border-b last:border-none">
                <td className="p-2 w-40">{formatIST(c.createdAt)}</td>
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.phone || "-"}</td>
                <td className="p-2 max-w-xl truncate">{c.message}</td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActive(c)}
                      className="text-sm px-2 py-1 border rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(c.contactID)}
                      className="text-sm px-2 py-1 border rounded text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No contacts match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Modal for viewing message --- */}
      {active && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{active.name}</h3>
                <div className="text-sm text-gray-600">
                  {active.email} • {active.phone || "-"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Received: {formatIST(active.createdAt)}
                </div>
              </div>
              <button onClick={() => setActive(null)} className="text-gray-600">
                ✕
              </button>
            </div>

            <div className="whitespace-pre-wrap text-sm text-gray-800">{active.message}</div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setActive(null)} className="px-3 py-1 border rounded">
                Close
              </button>
              <button
                onClick={() => {
                  if (active?.contactID) {
                    handleDelete(active.contactID);
                  }
                }}
                className="px-3 py-1 border rounded text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
