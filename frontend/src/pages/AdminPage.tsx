import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import CreateProductForm from "../components/CreateProductForm";
import ProductList from "../components/ProductList";
import AnalyticsTab from "../components/AnalyticsTab";

enum Tabs {
  CREATE = "CREATE",
  PRODUCTS = "PRODUCTS",
  ANALYTICS = "ANALYTICS",
}

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(Tabs.CREATE);

  const tabs = [
    { id: Tabs.CREATE, label: "Create Product", icon: PlusCircle },
    { id: Tabs.PRODUCTS, label: "Products", icon: ShoppingBasket },
    { id: Tabs.ANALYTICS, label: "Analytics", icon: BarChart },
  ];
  return (
    <div className="max-w-[800px] mx-auto mt-10">
      <motion.h1
        className="md:text-4xl sm:text-3xl text-2xl font-bold text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Admin Dashboard
      </motion.h1>
      <div className="flex justify-center items-center my-4 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="bg-zinc-200 flex items-center gap-2 py-2 px-4 rounded-md"
          >
            <tab.icon /> {tab.label}
          </button>
        ))}
      </div>
      <div>
        {activeTab === Tabs.CREATE && <CreateProductForm />}
        {activeTab === Tabs.PRODUCTS && <ProductList />}
        {activeTab === Tabs.ANALYTICS && <AnalyticsTab />}
      </div>
    </div>
  );
};

export default AdminPage;
