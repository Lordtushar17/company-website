import { useState } from "react";
import { Product } from "./types/product";
import Layout from "./components/Layout";
import ProductCard from "./components/ProductCard";
import ProductFormModal from "./components/ProductFormModal";
import ProductPreviewModal from "./components/ProductPreviewModal";
import AnalyticsSection from "./components/AnalyticsSection";
import LogsSection from "./components/LogsSection";

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
  const [section, setSection] = useState<"products" | "analytics" | "logs">(
    "products"
  );

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

  const saveProduct = (data: Omit<Product, "productid">) => {
    if (formMode === "create") {
      const id = "p-" + (products.length + 1).toString().padStart(3, "0");
      setProducts([...products, { productid: id, ...data }]);
    } else if (editingId) {
      setProducts((prev) =>
        prev.map((p) => (p.productid === editingId ? { ...p, ...data } : p))
      );
    }
  };

  const deleteProduct = (id: string) =>
    setProducts(products.filter((p) => p.productid !== id));

  const productForPreview =
    previewId && products.find((p) => p.productid === previewId);

  return (
    <Layout onNavigateSection={(key) => setSection(key as any)}>
      {section === "products" && (
        <>
          <div className="flex justify-between mb-8">
            <h1 className="text-3xl font-bold">Products</h1>
            <button
              onClick={startCreate}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              + Add Product
            </button>
          </div>

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
          </div>

          <ProductFormModal
            open={formOpen}
            mode={formMode}
            product={
              formMode === "edit"
                ? products.find((p) => p.productid === editingId)
                : undefined
            }
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
