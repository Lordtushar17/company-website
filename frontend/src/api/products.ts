// src/api/products.ts
import type { Product } from "../adminpage/types/product";

const API_BASE = process.env.REACT_APP_API_BASE || "";
const ID_TOKEN = process.env.REACT_APP_ID_TOKEN || "";

type BackendProduct = {
  productId: string;
  title?: string;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

function headers(): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (ID_TOKEN) h["Authorization"] = `Bearer ${ID_TOKEN}`;
  return h;
}

function toBackend(p: Product): BackendProduct {
  return {
    productId: p.productid,
    title: p.title ?? "",
    shortDescription: p.shortDesc ?? "",
    description: p.longDesc ?? "",
    imageUrl: p.images?.[0] ?? "",
  };
}

function fromBackend(b: BackendProduct): Product {
  return {
    productid: b.productId,
    title: b.title || "",
    shortDesc: b.shortDescription || "",
    longDesc: b.description || "",
    images: b.imageUrl ? [b.imageUrl] : [],
  };
}

async function request<T = any>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE) throw new Error("REACT_APP_API_BASE is not set");
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers: { ...headers(), ...(init?.headers || {}) } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  return (await res.json()) as T;
}

export const ProductsAPI = {
  async list(): Promise<Product[]> {
    const items = await request<BackendProduct[]>("/products_info");
    return (items || []).map(fromBackend);
  },
  async get(productid: string): Promise<Product> {
    const b = await request<BackendProduct>(`/products_info/${encodeURIComponent(productid)}`);
    return fromBackend(b);
  },
  async create(p: Product): Promise<Product> {
    const body = JSON.stringify(toBackend(p));
    const res = await request<{ item: BackendProduct }>(`/products_info`, { method: "POST", body });
    // Lambda returns { item, message }; fall back to echo if not present
    const created = (res as any).item || toBackend(p);
    return fromBackend(created);
  },
  async update(productid: string, patch: Omit<Product, "productid">): Promise<Product> {
    // Backend PUT accepts partial; send only changed fields
    const b = toBackend({ productid, ...patch } as Product);
    const payload: Partial<BackendProduct> = {
      title: b.title,
      shortDescription: b.shortDescription,
      description: b.description,
      imageUrl: b.imageUrl,
    };
    const res = await request<{ item: BackendProduct }>(
      `/products_info/${encodeURIComponent(productid)}`,
      { method: "PUT", body: JSON.stringify(payload) }
    );
    const updated = (res as any).item || { ...b };
    return fromBackend(updated);
  },
  async remove(productid: string): Promise<void> {
    await request(`/products_info/${encodeURIComponent(productid)}`, { method: "DELETE" });
  },
};
