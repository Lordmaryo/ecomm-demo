import React, { useEffect, useState } from "react";
import axios from "../lib/axios";
import { AnalyticsDataResponse, DailySalesData } from "../types/types";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import AnalyticsCard from "./AnalyticsCard";

const AnalyticsTab = () => {
  const [dailySalesData, setDailySalesData] = useState<DailySalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get<AnalyticsDataResponse>("/analytics");
        setAnalyticsData(res.data.analyticsData);
        setDailySalesData(res.data.dailysalesData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.users.toLocaleString()}
          icon={Users}
          color=""
        />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products.toLocaleString()}
          icon={Package}
          color=""
        />
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart}
          color=""
        />
        <AnalyticsCard
          title="Total Revenue"
          value={"$" + analyticsData.totalRevenue.toLocaleString()}
          icon={DollarSign}
          color=""
        />
      </div>
    </div>
  );
};

export default AnalyticsTab;
