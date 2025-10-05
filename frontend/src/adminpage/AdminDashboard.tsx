// AdminDashboard.tsx
import { useEffect, useState } from "react";
import { Product } from "./types/product";
import Layout from "./components/Layout";
import ProductCard from "./components/ProductCard";
import ProductFormModal from "./components/ProductFormModal";
import ProductPreviewModal from "./components/ProductPreviewModal";
import LogsSection from "./components/LogsSection";
import { ProductsAPI } from "../api/products";

import NoticeSection from "./components/NoticeSection";
import ContactsSection from "./components/ContactsSection";

// --- helpers to map API <-> UI shapes ---
function normalizeProduct(api: any): Product {
  return {
    productid: api.productId ?? api.productid ?? "",
    title: api.title ?? "",
    shortDesc: api.shortDescription ?? api.shortDesc ?? "",
    longDesc: api.description ?? api.longDesc ?? "",
    images: Array.isArray(api.images) ? api.images : api.imageUrl ? [api.imageUrl] : [],
    orderId:
      typeof api.orderId !== "undefined" && api.orderId !== null ? Number(api.orderId) : undefined,
  };
}

function unwrapItem(res: any) {
  return res?.item ?? res;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [section, setSection] = useState<"products" | "logs" | "notice" | "contacts">("products");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortByOrder = (a: Product, b: Product) => {
    const A = typeof a.orderId === "number" ? a.orderId : Number.MAX_SAFE_INTEGER;
    const B = typeof b.orderId === "number" ? b.orderId : Number.MAX_SAFE_INTEGER;
    return A - B;
  };

  // Load products on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await ProductsAPI.list();
        const normalized = Array.isArray(data) ? data.map(normalizeProduct) : [];
        normalized.sort(sortByOrder);
        setProducts(normalized);
        setError(null);
      } catch (e: any) {
        setError(e?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const startCreate = () => {
    setFormMode("create");
    setEditingId(null);
    setFormOpen(true);
  };

  const startEdit = (p: Product) => {
    setFormMode("edit");
    setEditingId(p.productid);
    setFormOpen(true);
  };

  const saveProduct = async (data: Omit<Product, "productid">) => {
    try {
      setSaving(true);
      setError(null);

      if (formMode === "create") {
        const generated =
          typeof globalThis !== "undefined" &&
          globalThis.crypto &&
          "randomUUID" in globalThis.crypto
            ? (globalThis.crypto as any).randomUUID()
            : `p-${Date.now()}`;

        const toSend: any = {
          productId: generated,
          title: data.title,
          shortDescription: data.shortDesc,
          description: data.longDesc,
          images: data.images,
          imageUrl: data.images?.[0] || "",
        };

        if (typeof data.orderId !== "undefined") toSend.orderId = data.orderId;

        const res = await ProductsAPI.create(toSend);
        const created = normalizeProduct(unwrapItem(res));
        setProducts((prev) => [created, ...prev].sort(sortByOrder));
      } else if (editingId) {
        const toSend: any = {
          title: data.title,
          shortDescription: data.shortDesc,
          description: data.longDesc,
          images: data.images,
          imageUrl: data.images?.[0] || "",
        };
        if (typeof data.orderId !== "undefined") toSend.orderId = data.orderId;

        const res = await ProductsAPI.update(editingId, toSend);
        const updated = normalizeProduct(unwrapItem(res));
        setProducts((prev) => prev.map((p) => (p.productid === editingId ? updated : p)).sort(sortByOrder));
      }
    } catch (e: any) {
      setError(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setError(null);
      await ProductsAPI.remove(id);
      setProducts((prev) => prev.filter((p) => p.productid !== id));
    } catch (e: any) {
      setError(e?.message || "Delete failed");
    }
  };

  const productForPreview = previewId && products.find((p) => p.productid === previewId);

  return (
    <Layout onNavigateSection={(key) => setSection(key as any)}>
      {section === "products" && (
        <>
          <div className="flex justify-between mb-8">
            <h1 className="text-3xl font-bold">Products</h1>
            <div className="flex items-center gap-3">
              {loading && <span className="text-sm text-gray-500">Loading…</span>}
              {saving && <span className="text-sm text-gray-500">Saving…</span>}
              <button
                onClick={startCreate}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                + Add Product
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard
                key={p.productid}
                product={p}
                onPreview={(id) => setPreviewId(id)}
                onEdit={startEdit}
                onDelete={deleteProduct}
              />
            ))}
            {!loading && products.length === 0 && (
              <div className="text-gray-500">No products yet. Click “Add Product”.</div>
            )}
          </div>

          <ProductFormModal
            open={formOpen}
            mode={formMode}
            product={formMode === "edit" ? products.find((p) => p.productid === editingId) : undefined}
            onClose={() => setFormOpen(false)}
            onSave={saveProduct}
          />

          <ProductPreviewModal
            product={productForPreview || null}
            onClose={() => setPreviewId(null)}
          />
        </>
      )}

      {section === "notice" && (
        <div>
          <NoticeSection />
        </div>
      )}

      {section === "logs" && <LogsSection />}

      {section === "contacts" && <ContactsSection />}
    </Layout>
  );
}
