import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import { useEffect, useState } from "react";
import { Product } from "../types/types";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

const PeopleAlsoBought = () => {
  const [recommendation, setRecommendation] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getReccomendations = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/product/recommendation");
        setRecommendation(res.data);
      } catch (error) {
        console.error("Error fetching recommendations", error);
        toast.error("Error fetching recommendation");
      } finally {
        setLoading(false);
      }
    };
    getReccomendations();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-[720px] px-4 mt-10">
      <h3 className="md:text-2xl text-xl font-medium">People also bought</h3>
      <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 mt-4 place-items-center">
        {recommendation?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
