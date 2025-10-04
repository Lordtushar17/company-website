import React, { useEffect, useState, useMemo, useCallback } from "react";
import { LogsAPI } from "../../api/logs";

type ProductLog = {
  logId: string;
  ts: string; // ISO8601 UTC string from DynamoDB
  productId: string;
  action: string;
  user: string;
  details: string;
  extra?: any;
};

export default function LogsSection() {
  const [logs, setLogs] = useState<ProductLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- filters ---
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState(""); // datetime-local (local time)
  const [to, setTo] = useState("");

  // --- Load Logs from API ---
  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await LogsAPI.list();
      setLogs(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Initial Load ---
  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Convert local datetime-local to UTC ISO string for filtering
  const toUtcIso = (local: string) => {
    if (!local) return "";
    return new Date(local).toISOString();
  };

  // Format UTC → IST (DD-MM-YYYY HH:mm:ss)
  const formatIST = (utcIso: string) => {
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

  // --- Filters ---
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const fromIso = from ? toUtcIso(from) : "";
    const toIso = to ? toUtcIso(to) : "";

    return logs.filter((l) => {
      const matchText =
        !s ||
        l.productId.toLowerCase().includes(s) ||
        l.action.toLowerCase().includes(s) ||
        l.details.toLowerCase().includes(s);

      const matchDate =
        (!fromIso || l.ts >= fromIso) && (!toIso || l.ts <= toIso);

      return matchText && matchDate;
    });
  }, [logs, search, from, to]);

  return (
    <div>
      {/* --- Header / Filters / Reload --- */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-4 gap-3">
        <h2 className="text-2xl font-bold">Product Update Logs</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by ID, action or details…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-1 w-64"
          />

          {/* Date Range */}
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

          {/* Reload Button */}
          <button
            onClick={loadLogs}
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

      {/* --- Logs Table --- */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Time (IST)</th>
              <th className="text-left p-2">Product ID</th>
              <th className="text-left p-2">Action</th>
              <th className="text-left p-2">User</th>
              <th className="text-left p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.logId} className="border-b last:border-none">
                <td className="p-2">{formatIST(log.ts)}</td>
                <td className="p-2">{log.productId}</td>
                <td className="p-2 capitalize">{log.action}</td>
                <td className="p-2">{log.user}</td>
                <td className="p-2">{log.details}</td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No logs match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
