import { useEffect } from "react";
import CategoryCard from "../components/CategoryCard";
import { useProductStore } from "../stores/useProductStore";
import LoadingSpinner from "../components/LoadingSpinner";

const HomePage = () => {
  const { fetchFeauturedProduct, loading, products } = useProductStore();

  useEffect(() => {
    fetchFeauturedProduct();
  }, [fetchFeauturedProduct]);

  const categories = [
    { href: "/Jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
    { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
    { href: "/Shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
    { href: "/Glasses", name: "Glasses", imageUrl: "/glasses.png" },
    { href: "/Jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
    { href: "/Suits", name: "Suits", imageUrl: "/suits.jpg" },
    { href: "/Bags", name: "Bags", imageUrl: "/bags.jpg" },
  ];

  return (
    <div className="px-4 w-full md:max-w-[800px] mx-auto mt-10">
      <h1 className="lg:text-5xl md:text-3xl text-2xl font-bold text-center">
        Explore Our Categories
      </h1>
      <p className="mt-2 text-center">
        Discover the latest trends in eco-friendly fashion
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 place-items-center justify-center gap-4 mt-10">
        {categories.map((category, index) => (
          <CategoryCard category={category} key={index} />
        ))}
      </div>
      <div className="mt-4">{loading ? <LoadingSpinner /> : <div></div>}</div>
    </div>
  );
};

export default HomePage;
