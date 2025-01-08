import CategoryCard from "../components/CategoryCard";

const HomePage = () => {
  const categories = [
    { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
    { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
    { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
    { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
    { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
    { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
    { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
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
    </div>
  );
};

export default HomePage;
