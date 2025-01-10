import { useProductStore } from "../stores/useProductStore";
import { Star, Trash } from "lucide-react";

const ProductList = () => {
  const { deleteProduct, toggleFeauturedProduct, products } = useProductStore();

  return (
    <div className="w-full sm:max-w-[600px] mx-auto mt-10 mb-4 px-4">
      <thead className="bg-zinc-200 uppercase font-bold">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs tracking-wider"
          >
            Product
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs tracking-wider"
          >
            Price
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs tracking-wider"
          >
            Category
          </th>

          <th
            scope="col"
            className="px-6 py-3 text-left text-xs tracking-wider"
          >
            Featured
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-zinc-300 divide-y divide-gray-700">
        {products?.map((product) => (
          <tr key={product?._id} className="hover:bg-gray-400">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={product?.image ?? ""}
                    alt={product?.name}
                  />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium">{product?.name}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm">
                {product.price ? `$${product.price.toFixed(2)}` : "Loading..."}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm">{product?.category}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                onClick={() =>
                  product?._id && toggleFeauturedProduct(product?._id)
                }
                className={`p-1 rounded-full ${
                  product?.isFeatured
                    ? "bg-yellow-400 text-gray-900"
                    : "transparent"
                } hover:bg-yellow-500 transition-colors duration-200`}
              >
                <Star className="h-5 w-5" />
              </button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                onClick={() => product?._id && deleteProduct(product?._id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash className="h-5 w-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </div>
  );
};

export default ProductList;
