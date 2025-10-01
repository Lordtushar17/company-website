import { useEffect, useRef, useState } from "react";
import { Product } from "../types/product";
import { presignUpload, uploadToS3Presigned } from "../../api/uploads";

export default function ProductFormModal({
  open,
  mode,
  product,
  stagedProductId,
  onClose,
  onSave,
}: {
  open: boolean;
  mode: "create" | "edit";
  product?: Product;
  stagedProductId?: string;
  onClose: () => void;
  onSave: (data: Omit<Product, "productid">) => void;
}) {
  const [title, setTitle] = useState(product?.title ?? "");
  const [shortDesc, setShort] = useState(product?.shortDesc ?? "");
  const [longDesc, setLong] = useState(product?.longDesc ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [orderId, setOrderId] = useState<number | "">(product?.orderId ?? "");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  //  NEW: max size per image = 10 MB
  const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

  // Sync local form state whenever the modal opens or the product changes
  useEffect(() => {
    if (open) {
      setTitle(product?.title ?? "");
      setShort(product?.shortDesc ?? "");
      setLong(product?.longDesc ?? "");
      setImages(product?.images ?? []);
      setOrderId(product?.orderId ?? "");
      setUrlInput("");
      setUploading(false);
    }
  }, [open, product]);

  if (!open) return null;

  const addImage = () => {
    if (!urlInput.trim()) return;
    setImages((prev) => [...prev, urlInput.trim()]);
    setUrlInput("");
  };

  const pickLocalAndUpload = () => {
    fileInputRef.current?.click();
  };

  const onLocalFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ NEW: block individual files > 10 MB
    if (file.size > MAX_IMAGE_BYTES) {
      alert(
        `This image is too large (${(file.size / (1024 * 1024)).toFixed(
          2
        )} MB). The maximum allowed per image is 10 MB.`
      );
      // reset the input so the same file can be re-selected after compression/resave
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setUploading(true);

      // Use the real product id when uploading:
      // - if editing, upload under real productId
      // - if creating, use the stagedProductId passed from parent
      const forProductId = product?.productid || stagedProductId || "staged";

      // 1) Presign
      const ps = await presignUpload({
        productId: forProductId,
        filename: file.name,
        contentType: file.type || "application/octet-stream",
      });

      // 2) Upload to S3 with form-data
      await uploadToS3Presigned(ps.upload.url, ps.upload.fields, file);

      // 3) Save S3 key to local state (persisted on Save)
      setImages((prev) => [...prev, ps.key]);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const save = () => {
    if (!title.trim()) return;
    const payload: any = {
      title,
      shortDesc,
      longDesc,
      images,
    };
    if (orderId !== "" && orderId !== null && typeof orderId !== "undefined") {
      payload.orderId = Number(orderId);
    }
    onSave(payload);
    onClose();
  };

  const isHttpUrl = (s: string) => /^https?:\/\//i.test(s);

  // NOTE: no S3 call here; we only change the local list.
  // AdminDashboard will delete removed S3 keys AFTER a successful Save.
  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
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
            aria-label="Close"
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

          {/* Order ID input */}
          <input
            type="number"
            min={1}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Order ID (1 = top). Leave blank for default ordering."
            value={orderId === "" ? "" : String(orderId)}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") return setOrderId("");
              const n = parseInt(v, 10);
              if (isNaN(n)) return;
              setOrderId(n);
            }}
          />

          <textarea
            rows={6}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Long description"
            value={longDesc}
            onChange={(e) => setLong(e.target.value)}
          />

          <div>
            {/* Hidden file input for local uploads */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onLocalFileChosen}
            />

            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 border rounded-md px-3 py-2"
                placeholder="Image URL"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <button
                type="button"
                onClick={addImage}
                className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Add URL
              </button>

              <button
                type="button"
                onClick={pickLocalAndUpload}
                disabled={uploading}
                className="px-3 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60"
                title="Upload from your computer"
              >
                {uploading ? "Uploading…" : "Add from computer"}
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  {isHttpUrl(img) ? (
                    <img
                      src={img}
                      alt={`img-${i}`}
                      className="h-24 w-32 object-cover border rounded-md"
                    />
                  ) : (
                    <div className="h-24 w-32 border rounded-md bg-gray-50 grid place-items-center p-2 text-[11px] text-gray-600 break-words">
                      <span className="px-2 py-1 bg-gray-200 rounded">
                        {img.split("/").slice(-1)[0]}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600 text-white text-xs"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
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
            disabled={uploading}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
