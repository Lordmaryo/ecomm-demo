import { Plus } from "lucide-react";
import { useUseStore as useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

interface ProductCardProps {
  productImage: string | null;
  productPrice: number;
  productName: string;
}
const ProductCard = ({
  productImage,
  productPrice,
  productName,
}: ProductCardProps) => {
  const { user } = useUserStore();

  const handleAddToCart = () => {
    if (user) {
      toast.success("Added " + productName + " to Cart", { id: "sucess" });
    } else {
      toast.error("You need to be Authenticated to complete this action", {
        id: "error",
      });
    }
  };

  return (
    <div className="border w-40 h-56">
      <div className="h-36 rounded-md">
        <img
          src={productImage || ""}
          className="object-cover w-full h-full p-2"
          alt={productName}
          loading="lazy"
        />
      </div>
      <div className="space-y-1 px-1">
        <p className="text-sm font-bold">{productName}</p>
        <p className="text-zinc-500">${productPrice}</p>
        <button
          onClick={handleAddToCart}
          className="bg-black text-white w-full py-1 rounded-md text-sm hover:opacity-85 transition-opacity"
        >
          <Plus size={20} className="inline-block mr-1" /> Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
