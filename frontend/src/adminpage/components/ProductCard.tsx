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
  const hero = product.images?.[0];

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border flex flex-col">
      {/* Responsive hero image with dynamic height via breakpoints */}
      {hero && (
        <div className="w-full overflow-hidden">
          {/* Use aspect ratio on small screens; scale height up on larger screens */}
          <div className="aspect-[16/10] sm:aspect-[16/9] md:h-48 lg:h-56 xl:h-64 md:aspect-auto">
            <img
              src={hero}
              alt={product.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        {/* Dynamic text sizing and truncation for tidy cards */}
        <h2 className="text-lg sm:text-xl font-semibold mb-1 line-clamp-2">
          {product.title}
        </h2>
        <p className="text-gray-600 text-sm sm:text-[0.95rem] mb-3 line-clamp-2">
          {product.shortDesc}
        </p>

        <details className="mb-4">
          <summary className="cursor-pointer text-blue-600 hover:underline">
            View Details
          </summary>
          <p className="mt-2 text-gray-700 text-sm whitespace-pre-line">
            {product.longDesc}
          </p>

          {/* Thumb strip becomes horizontally scrollable on small screens, wraps on large */}
          <div className="mt-3 flex gap-2 overflow-x-auto lg:flex-wrap">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.title} ${i}`}
                className="h-16 w-28 sm:h-20 sm:w-32 object-cover rounded-md border flex-none"
                loading="lazy"
              />
            ))}
          </div>
        </details>

        <div className="mt-auto">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-gray-500 truncate" title={product.productid}>
              ID: {product.productid}
            </span>
          </div>

          {/* Buttons stack on small screens, align in a row on md+ */}
          <div className="flex flex-col sm:flex-row justify-between mt-3 gap-2">
            <button
              onClick={() => onPreview(product.productid)}
              className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
              View on Site
            </button>
            <button
              onClick={() => onEdit(product)}
              className="px-3 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700 text-sm"
            >
              Edit / Add Images
            </button>
            <button
              onClick={() => onDelete(product.productid)}
              className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
