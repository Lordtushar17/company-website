const API_BASE = process.env.REACT_APP_API_BASE!;
if (!API_BASE) {
  // Helps fail fast in dev if the env var isn't set
  // (remove if you don't want runtime guardrails)
  // eslint-disable-next-line no-console
  console.warn("REACT_APP_API_BASE is not set");
}

type ApiProduct = {
  productId?: string;
  title: string;
  shortDescription: string;
  description: string;
  images?: string[];
  imageUrl?: string; // optional convenience for first image
  orderId?: number; // NEW: optional ordering field
};

// --- internal helper ---
async function handle(resp: Response) {
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(text || `Request failed with ${resp.status}`);
  }
  return resp.json();
}

// ---- object API expected by AdminDashboard ----
export const ProductsAPI = {
  async list(): Promise<ApiProduct[]> {
    const r = await fetch(`${API_BASE}/products_info`, { method: "GET" });
    return handle(r);
  },

  async get(id: string): Promise<ApiProduct> {
    const r = await fetch(`${API_BASE}/products_info/${encodeURIComponent(id)}`, {
      method: "GET",
    });
    return handle(r);
  },

  async create(p: ApiProduct & { productId: string }): Promise<any> {
    // Accepts backend field names already mapped by caller
    const body = JSON.stringify({
      productId: p.productId,
      title: p.title,
      shortDescription: p.shortDescription,
      description: p.description,
      images: Array.isArray(p.images) ? p.images : [],
      imageUrl: p.imageUrl ?? (p.images?.[0] || ""),
      ...(typeof p.orderId !== "undefined" ? { orderId: p.orderId } : {}),
    });

    const r = await fetch(`${API_BASE}/products_info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    return handle(r);
  },

  async update(id: string, p: Partial<ApiProduct>): Promise<any> {
    const body = JSON.stringify({
      ...(p.title !== undefined ? { title: p.title } : {}),
      ...(p.shortDescription !== undefined ? { shortDescription: p.shortDescription } : {}),
      ...(p.description !== undefined ? { description: p.description } : {}),
      ...(p.images !== undefined ? { images: p.images } : {}),
      imageUrl:
        p.imageUrl !== undefined
          ? p.imageUrl
          : Array.isArray(p.images) && p.images.length > 0
          ? p.images[0]
          : undefined,
      ...(typeof p.orderId !== "undefined" ? { orderId: p.orderId } : {}),
    });

    const r = await fetch(`${API_BASE}/products_info/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body,
    });
    return handle(r);
  },

  async remove(id: string): Promise<any> {
    const r = await fetch(`${API_BASE}/products_info/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return handle(r);
  },
};

// ---- Back-compat named functions (optional) ----
// These let you keep any old imports that used the previous function names.
export async function createProduct(p: {
  productId: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  images: string[];
  orderId?: number;
}) {
  return ProductsAPI.create({
    productId: p.productId,
    title: p.title,
    shortDescription: p.shortDesc,
    description: p.longDesc,
    images: p.images,
    imageUrl: p.images?.[0] || "",
    ...(typeof p.orderId !== "undefined" ? { orderId: p.orderId } : {}),
  });
}

export async function updateProduct(
  productId: string,
  p: { title: string; shortDesc: string; longDesc: string; images: string[]; orderId?: number }
) {
  return ProductsAPI.update(productId, {
    title: p.title,
    shortDescription: p.shortDesc,
    description: p.longDesc,
    images: p.images,
    imageUrl: p.images?.[0] || "",
    ...(typeof p.orderId !== "undefined" ? { orderId: p.orderId } : {}),
  });
}

export async function getProducts() {
  return ProductsAPI.list();
}

export async function getProduct(id: string) {
  return ProductsAPI.get(id);
}

export async function deleteProduct(id: string) {
  return ProductsAPI.remove(id);
}
