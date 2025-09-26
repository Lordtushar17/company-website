const BASE = process.env.REACT_APP_API_URL || "http://localhost:4000";

export async function apiLogin(username: string, password: string) {
  const res = await fetch(`${BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Login failed");
  return data;
}

export async function apiLogout() {
  const res = await fetch(`${BASE}/api/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

export async function apiMe() {
  const res = await fetch(`${BASE}/api/me`, {
    credentials: "include",
  });
  return res.json() as Promise<{ authenticated: boolean; user?: { username: string } }>;
}
