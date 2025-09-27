import { Product } from "../types/product";

export default function ProductCard({
  product,
  onPreview,
  onEdit,
  onDelete,
}: {
  product: Product;
  onPreview: (id: string) => void;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border">
      {product.images[0] && (
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
        <p className="text-gray-600 text-sm mb-3">{product.shortDesc}</p>

        <details className="mb-4">
          <summary className="cursor-pointer text-blue-600 hover:underline">
            View Details
          </summary>
          <p className="mt-2 text-gray-700 text-sm whitespace-pre-line">
            {product.longDesc}
          </p>
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.title} ${i}`}
                className="h-20 w-32 object-cover rounded-md border"
              />
            ))}
          </div>
        </details>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">ID: {product.productid}</span>
        </div>

        <div className="flex justify-between mt-3 gap-2">
          <button
            onClick={() => onPreview(product.productid)}
            className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            View on Site
          </button>
          <button
            onClick={() => onEdit(product)}
            className="px-3 py-1 rounded-md bg-amber-600 text-white hover:bg-amber-700 text-sm"
          >
            Edit / Add Images
          </button>
          <button
            onClick={() => onDelete(product.productid)}
            className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
