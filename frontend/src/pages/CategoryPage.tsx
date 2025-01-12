import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
  const { products, fetchProductByCategory } = useProductStore();
  const { category } = useParams();

  useEffect(() => {
    fetchProductByCategory(category ?? "");
  }, []);

  return (
    <div className="max-w-[800px] mx-auto mt-10 px-4">
      <motion.h1
        className="lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-bold text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {category?.charAt(0).toUpperCase().concat(category.slice(1))}
      </motion.h1>
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {products.length === 0 ? (
          <div className="text-center text-zinc-600">
            No Products based on this category
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 place-items-center justify-center gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CategoryPage;
