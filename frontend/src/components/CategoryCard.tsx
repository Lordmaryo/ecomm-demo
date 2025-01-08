import { Link } from "react-router-dom";

interface Category {
  href: string;
  name: string;
  imageUrl: string;
}

type CategoryProps = {
  category: Category;
};

const CategoryCard = ({ category }: CategoryProps) => {
  return (
    <div className="relative">
      <Link to={"/category" + category.href}>
        <div className="group overflow-hidden">
          <img
            src={category.imageUrl}
            className="w-60 h-56 object-cover rounded-md transition-transform
             duration-300 ease-out group-hover:scale-110"
            alt={category.name}
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-2 absolute bottom-0 text-white w-full">
        <h3 className="text-xl font-bold">{category.name}</h3>
        <span className="text-sm font-thin">Explore {category.name}</span>
      </div>
    </div>
  );
};

export default CategoryCard;
