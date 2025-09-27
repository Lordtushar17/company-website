import React, { useEffect, useMemo, useState } from "react";

interface Product {
  productid: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  images: string[];
}

const initialProducts: Product[] = [
  {
    productid: "p-001",
    title: "Coolant Conditioning System",
    shortDesc: "Compact, energy-efficient coolant purifier.",
    longDesc:
      "This coolant conditioning system provides high-efficiency cooling and filtration for industrial applications. It ensures long service life of the coolant and reduces maintenance cost.",
    images: [
      "https://via.placeholder.com/800x1000?text=Coolant+Hero",
      "https://via.placeholder.com/800x1000?text=Coolant+Side",
    ],
  },
  {
    productid: "p-002",
    title: "Hydraulic Power Pack",
    shortDesc: "Robust and maintenance-free hydraulic unit.",
    longDesc:
      "Our hydraulic power pack delivers consistent hydraulic pressure for heavy machinery. Designed for reliability and low noise operation.",
    images: [
      "https://via.placeholder.com/800x1000?text=Hydraulic+Hero",
      "https://via.placeholder.com/800x1000?text=Hydraulic+Detail",
    ],
  },
];

type FormMode = "create" | "edit";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Create/Edit form modal state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Product, "productid">>({
    title: "",
    shortDesc: "",
    longDesc: "",
    images: [],
  });
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Preview modal state
  const [previewId, setPreviewId] = useState<string | null>(null);
  const product = useMemo(
    () => products.find((p) => p.productid === previewId) || null,
    [previewId, products]
  );
  const [imgIdx, setImgIdx] = useState(0);
  useEffect(() => setImgIdx(0), [previewId]);

  // ===== Helpers =====
  const openCreate = () => {
    setFormMode("create");
    setEditingId(null);
    setForm({ title: "", shortDesc: "", longDesc: "", images: [] });
    setImageUrlInput("");
    setFormOpen(true);
  };

  const openEdit = (p: Product) => {
    setFormMode("edit");
    setEditingId(p.productid);
    setForm({
      title: p.title,
      shortDesc: p.shortDesc,
      longDesc: p.longDesc,
      images: [...p.images],
    });
    setImageUrlInput("");
    setFormOpen(true);
  };

  const saveForm = () => {
    if (!form.title.trim()) return alert("Title is required");
    if (formMode === "create") {
      const id =
        "p-" + (products.length + 1).toString().padStart(3, "0");
      const newProd: Product = {
        productid: id,
        title: form.title.trim(),
        shortDesc: form.shortDesc.trim(),
        longDesc: form.longDesc.trim(),
        images: form.images,
      };
      setProducts((prev) => [...prev, newProd]);
    } else if (editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.productid === editingId
            ? {
                ...p,
                title: form.title.trim(),
                shortDesc: form.shortDesc.trim(),
                longDesc: form.longDesc.trim(),
                images: form.images,
              }
            : p
        )
      );
    }
    setFormOpen(false);
  };

  const deleteProduct = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.productid !== id));

  const addImageByUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setForm((f) => ({ ...f, images: [...f.images, url] }));
    setImageUrlInput("");
  };

  const addImagesFromFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== idx),
    }));
  };

  const moveImage = (from: number, to: number) => {
    setForm((f) => {
      const arr = [...f.images];
      if (to < 0 || to >= arr.length) return f;
      const [x] = arr.splice(from, 1);
      arr.splice(to, 0, x);
      return { ...f, images: arr };
    });
  };

  const prevImg = () =>
    setImgIdx((i) =>
      product ? (i - 1 + product.images.length) % product.images.length : 0
    );
  const nextImg = () =>
    setImgIdx((i) =>
      product ? (i + 1) % product.images.length : 0
    );

  return (
    <div className="min-h-[70vh] mt-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard (Dummy)</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
        >
          + Add Product
        </button>
      </div>

      {/* Product grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.productid}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border"
          >
            <img
              src={p.images[0]}
              alt={p.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
              <p className="text-gray-600 text-sm mb-3">{p.shortDesc}</p>

              <details className="mb-4">
                <summary className="cursor-pointer text-blue-600 hover:underline">
                  View Details
                </summary>
                <p className="mt-2 text-gray-700 text-sm whitespace-pre-line">
                  {p.longDesc}
                </p>
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {p.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${p.title} ${i}`}
                      className="h-20 w-32 object-cover rounded-md border"
                    />
                  ))}
                </div>
              </details>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">ID: {p.productid}</span>
              </div>

              <div className="flex justify-between mt-3 gap-2">
                <button
                  onClick={() => setPreviewId(p.productid)}
                  className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
                >
                  View on Site
                </button>
                <button
                  onClick={() => openEdit(p)}
                  className="px-3 py-1 rounded-md bg-amber-600 text-white hover:bg-amber-700 text-sm"
                >
                  Edit / Add Images
                </button>
                <button
                  onClick={() => deleteProduct(p.productid)}
                  className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Create/Edit Product Modal ===== */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {formMode === "create" ? "Add New Product" : `Edit Product ${editingId}`}
              </h2>
              <button
                onClick={() => setFormOpen(false)}
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 grid place-items-center"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-medium">Title</span>
                  <input
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Short Description</span>
                  <input
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    value={form.shortDesc}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, shortDesc: e.target.value }))
                    }
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Long Description</span>
                  <textarea
                    rows={8}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    value={form.longDesc}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, longDesc: e.target.value }))
                    }
                  />
                </label>
              </div>

              {/* Images editor */}
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Add Images</span>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste image URL"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 border rounded-md px-3 py-2"
                    />
                    <button
                      onClick={addImageByUrl}
                      className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Add URL
                    </button>
                  </div>
                  <div className="mt-3">
                    <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => addImagesFromFiles(e.target.files)}
                        className="hidden"
                      />
                      <span className="px-3 py-2 rounded-md border hover:bg-gray-50">
                        Upload files…
                      </span>
                      <span className="text-gray-500">
                        (previewed locally; not uploaded)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Thumbnails with reorder/remove */}
                <div className="border rounded-md p-3 bg-gray-50">
                  {form.images.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No images yet. Add by URL or upload files.
                    </p>
                  ) : (
                    <div className="flex gap-3 overflow-x-auto">
                      {form.images.map((img, i) => (
                        <div
                          key={i}
                          className="relative shrink-0 border bg-white rounded-lg overflow-hidden"
                        >
                          <img
                            src={img}
                            alt={`img-${i}`}
                            className="h-24 w-36 object-cover"
                          />
                          <div className="absolute top-1 right-1 flex gap-1">
                            <button
                              onClick={() => removeImage(i)}
                              className="h-7 w-7 grid place-items-center rounded-full bg-red-600 text-white text-xs"
                              title="Remove"
                            >
                              ×
                            </button>
                          </div>
                          <div className="flex">
                            <button
                              onClick={() => moveImage(i, i - 1)}
                              className="flex-1 text-xs px-2 py-1 hover:bg-gray-100"
                              title="Move left"
                            >
                              ◀
                            </button>
                            <button
                              onClick={() => moveImage(i, i + 1)}
                              className="flex-1 text-xs px-2 py-1 hover:bg-gray-100"
                              title="Move right"
                            >
                              ▶
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setFormOpen(false)}
                className="px-4 py-2 rounded-md border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveForm}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Preview Modal (public product look) ===== */}
      {product && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setPreviewId(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewId(null)}
              className="absolute right-4 top-4 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 grid place-items-center"
              aria-label="Close Preview"
              title="Close"
            >
              ×
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full">
              {/* Left: gallery */}
              <div className="lg:col-span-2 bg-white flex flex-col">
                <div className="relative flex-1 grid place-items-center p-6">
                  <button
                    onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white shadow hover:bg-gray-50"
                    title="Previous image"
                  >
                    ‹
                  </button>
                  <img
                    src={product.images[imgIdx]}
                    alt={product.title}
                    className="max-h-[60vh] object-contain"
                  />
                  <button
                    onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white shadow hover:bg-gray-50"
                    title="Next image"
                  >
                    ›
                  </button>
                </div>
                <div className="border-t bg-gray-50 p-3 overflow-x-auto">
                  <div className="flex gap-3">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`h-20 w-28 shrink-0 rounded-lg border ${
                          i === imgIdx
                            ? "border-orange-400 ring-2 ring-orange-300"
                            : "border-gray-300"
                        } overflow-hidden bg-white`}
                        title={`Image ${i + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${product.title} ${i}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: details */}
              <div className="p-6 overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">{product.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.longDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
