import { useState } from "react";
import { Product } from "../types/product";

export default function ProductFormModal({
  open,
  mode,
  product,
  onClose,
  onSave,
}: {
  open: boolean;
  mode: "create" | "edit";
  product?: Product;
  onClose: () => void;
  onSave: (data: Omit<Product, "productid">) => void;
}) {
  const [title, setTitle] = useState(product?.title ?? "");
  const [shortDesc, setShort] = useState(product?.shortDesc ?? "");
  const [longDesc, setLong] = useState(product?.longDesc ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [urlInput, setUrlInput] = useState("");

  if (!open) return null;

  const addImage = () => {
    if (!urlInput.trim()) return;
    setImages([...images, urlInput.trim()]);
    setUrlInput("");
  };

  const save = () => {
    if (!title.trim()) return;
    onSave({ title, shortDesc, longDesc, images });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Add Product" : "Edit Product"}
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 grid place-items-center"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          <input
            className="w-full border rounded-md px-3 py-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full border rounded-md px-3 py-2"
            placeholder="Short description"
            value={shortDesc}
            onChange={(e) => setShort(e.target.value)}
          />
          <textarea
            rows={6}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Long description"
            value={longDesc}
            onChange={(e) => setLong(e.target.value)}
          />
          <div>
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 border rounded-md px-3 py-2"
                placeholder="Image URL"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <button
                onClick={addImage}
                className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Add URL
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`img-${i}`}
                  className="h-24 w-32 object-cover border rounded-md"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
