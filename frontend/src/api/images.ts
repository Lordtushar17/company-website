const API_BASE = process.env.REACT_APP_API_BASE || "";

export async function resolveImageKeys(keys: string[]) {
  if (!keys.length) return {};
  const res = await fetch(`${API_BASE}/upload/view`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keys }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json() as { urls: { key: string; url?: string }[] };
  const map: Record<string, string> = {};
  for (const { key, url } of data.urls) if (url) map[key] = url;
  return map;
}
