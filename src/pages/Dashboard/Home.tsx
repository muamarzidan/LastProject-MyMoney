import { useState, useEffect } from "react";

import { getUserData } from "../../resolver/user/index"
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";


type User = {
  data: {
    id: string;
    email: string;
    username: string;
  };
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const userData = await getUserData();
        setUser(userData);
      } catch (err) {
        console.error("Gagal memuat data pengguna, kesalahan pada server:", err);
        setError("Gagal memuat data, terjadi kesalahan pada server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    )
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">Terjadi kesalahan saat memuat data, mohon coba lagi</div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="MyMoney - Home"
        description="My Money is a dashboard personal finance management application that helps you track your income and expenses, set budgets, and manage your finances effectively."
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="w-full col-span-12">
          <h1>Halo, selamat pagi {user?.data?.username}</h1>
        </div>
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
};