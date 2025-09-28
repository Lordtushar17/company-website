import { useEffect, useState } from "react";
import { Product } from "./types/product";
import Layout from "./components/Layout";
import ProductCard from "./components/ProductCard";
import ProductFormModal from "./components/ProductFormModal";
import ProductPreviewModal from "./components/ProductPreviewModal";
import AnalyticsSection from "./components/AnalyticsSection";
import LogsSection from "./components/LogsSection";
import { ProductsAPI } from "../api/products";

const initialProducts: Product[] = [
  {
    productid: "p-001",
    title: "Coolant Conditioning System",
    shortDesc: "Compact, energy-efficient coolant purifier.",
    longDesc: "Long description here…",
    images: [
      "https://via.placeholder.com/800x1000?text=Coolant+Hero",
      "https://via.placeholder.com/800x1000?text=Coolant+Side",
    ],
  },
  {
    productid: "p-002",
    title: "Hydraulic Power Pack",
    shortDesc: "Robust and maintenance-free hydraulic unit.",
    longDesc: "Another long description here…",
    images: [
      "https://via.placeholder.com/800x1000?text=Hydraulic+Hero",
      "https://via.placeholder.com/800x1000?text=Hydraulic+Detail",
    ],
  },
];

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [section, setSection] = useState<"products" | "analytics" | "logs">("products");

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load from API on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await ProductsAPI.list();
        if (Array.isArray(data) && data.length) {
          setProducts(data);
        } else {
          // keep initial placeholders if table is empty
          setProducts([]);
        }
        setError(null);
      } catch (e: any) {
        setError(e.message || "Failed to load products");
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
          (globalThis.crypto && "randomUUID" in globalThis.crypto)
            ? globalThis.crypto.randomUUID()
            : `p-${Date.now()}`;

        const newProduct: Product = { productid: generated, ...data };
        const created = await ProductsAPI.create(newProduct);
        setProducts((prev) => [created, ...prev]);
      } else if (editingId) {
        const updated = await ProductsAPI.update(editingId, data);
        setProducts((prev) => prev.map((p) => (p.productid === editingId ? updated : p)));
      }
    } catch (e: any) {
      setError(e.message || "Save failed");
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
      setError(e.message || "Delete failed");
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

      {section === "analytics" && <AnalyticsSection />}
      {section === "logs" && <LogsSection />}
    </Layout>
  );
}
