import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { getUserData } from "../../resolver/user/index";
import { getWallet, deleteWallet } from "../../resolver/wallet";
import axiosRequest from "../../utils/request"
import PageMeta from "../../components/common/PageMeta";
import Select from "../../components/form/Select";
import { FaWallet, FaEllipsisVertical  } from "react-icons/fa6";


declare global {
  interface Window {
    echarts: any;
  }
}

type User = {
  data: {
    id: string;
    username: string;
  };
};

type DashboardData = {
  walletId: number;
  totalBalance: number;
  allTransactionByType: Array<{
    type: string;
    amount: number;
  }>;
  allTransactionByCategory: Array<{
    category: string;
    amount: number;
  }>;
};

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [walletData, setWalletData] = useState<any>(null);
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const incomeOutcomeChartRef = useRef<HTMLDivElement>(null);
  const categoryChartRef = useRef<HTMLDivElement>(null);
  const [activePopoverId, setActivePopoverId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>("");


  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.3/echarts.min.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const getDashboardData = async (walletId: number) => {
    try {
      const response = await axiosRequest.get(`/api/wallets/transactions/dashboard?walletId=${walletId}`);
      const result = response.data;

      if (result.status === 200) {
        setDashboardData(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Gagal memuat data dashboard");
    }
  };

  useEffect(() => {
    const getUserandWalletData = async () => {
      setIsLoading(true);
      try {
        const userData = await getUserData();
        const walletData = await getWallet();
        setUser(userData);
        setWalletData(walletData);
        if (walletData.data.length > 0) {
          setSelectedWalletId(walletData.data[0].id);
        } else {
          setSelectedWalletId(null);
        }
      } catch (err) {
        console.error("Gagal memuat data pengguna, kesalahan pada server:", err);
        setError("Gagal memuat data, terjadi kesalahan pada server");
      } finally {
        setIsLoading(false);
      }
    };

    getUserandWalletData();
  }, []);

  useEffect(() => {
    if (selectedWalletId && window.echarts) {
      getDashboardData(selectedWalletId);
    }
  }, [selectedWalletId]);

  useEffect(() => {
    if (dashboardData && incomeOutcomeChartRef.current && window.echarts) {
      const chart = window.echarts.init(incomeOutcomeChartRef.current);

      const incomeData = dashboardData.allTransactionByType.find(item => item.type === 'income')?.amount || 0;
      const outcomeData = dashboardData.allTransactionByType.find(item => item.type === 'outcome')?.amount || 0;

      const maxValue = Math.max(incomeData, outcomeData);

      let gridLeft = '5%';
      if (maxValue >= 1_000_000_000) {
        gridLeft = '20%';
      } else if (maxValue >= 1_000_000) {
        gridLeft = '15%';
      } else if (maxValue >= 1_000) {
        gridLeft = '10%';
      } else {
        gridLeft = '30%';
      }

      const option = {
        title: {
          text: 'Tipe Transaksi',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params: any) {
            return params[0].name + '<br/>' +
              params[0].marker + params[0].seriesName + ': ' +
              formatCurrency(params[0].value);
          }
        },
        xAxis: {
          type: 'category',
          data: ['Income', 'Outcome']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: function (value: number) {
              return formatCurrency(value);
            }
          }
        },
        series: [
          {
            name: 'Amount',
            type: 'bar',
            data: [incomeData, outcomeData],
            itemStyle: {
              color: function (params: any) {
                const colors = ['#465fff', '#EF4444'];
                return colors[params.dataIndex];
              }
            },
            barWidth: '50%'
          }
        ],
        grid: {
          left: gridLeft,
          right: '10%',
          bottom: '10%',
          top: '20%'
        }
      };

      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    }
  }, [dashboardData]);

  useEffect(() => {
    if (dashboardData && categoryChartRef.current && window.echarts) {
      const chart = window.echarts.init(categoryChartRef.current);

      const categoryData = dashboardData.allTransactionByCategory.map(item => ({
        name: item.category,
        value: item.amount
      }));

      const option = {
        title: {
          text: 'Transaksi per Kategori',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: 'Kategori',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '60%'],
            data: categoryData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 2
            }
          }
        ],
        color: ['#06B6D4', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
      };

      chart.setOption(option);

      // Cleanup
      return () => {
        chart.dispose();
      };
    }
  }, [dashboardData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.popover-container')) {
        setActivePopoverId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const selectedWallet = walletData?.data?.find((wallet: any) => wallet.id === selectedWalletId);
  const currentBalance = dashboardData?.totalBalance || selectedWallet?.myMoney || 0;

  const calmDarkColors = [
    '#1E293B',
    '#334155',
    '#0F172A',
    '#1F2937',
    '#111827',
    '#0C4A6E',
    '#14532D',
    '#7F1D1D',
    '#4C1D95',
    '#3730A3',
    '#78350F',
  ];

  const getRandomCalmColor = (index :any) => {
    return calmDarkColors[index];
  };

  return (
    <>
      <PageMeta
        title="MyMoney - Home"
        description="My Money is a dashboard personal finance management application that helps you track your income and expenses, set budgets, and manage your finances effectively."
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="w-full col-span-12 h-[200px] bg-[url('/images/bg_wallet.svg')] bg-cover bg-center rounded-lg shadow-md flex flex-col justify-between p-5">
          <h1 className="text-white text-2xl">Halo, selamat pagi {user?.data?.username}</h1>
          <div className="flex gap-2 items-center">
            <Select
              className="w-fit !text-lg backdrop-blur-sm !text-white focus:border-gray-200 sm:py-1"
              options={walletData?.data?.map((wallet: any) => ({
                value: wallet.id.toString(),
                label: wallet.name,
              })) || []}
              placeholder="Pilih Wallet"
              value={selectedWalletId?.toString() ?? ""}
              onChange={(val) => setSelectedWalletId(Number(val))}
            />
            <p className="text-xl text-white">Saldo sekarang : {formatCurrency(currentBalance)}</p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 h-[400px]">
            <div ref={incomeOutcomeChartRef} className="w-full h-full"></div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 h-[400px]">
            <div ref={categoryChartRef} className="w-full h-full"></div>
          </div>
        </div>

        <div className="col-span-12 mt-2">
          <h2 className="text-2xl font-bold mb-2">Available Wallet</h2>
          {
            walletData?.data?.length > 0 ? (
              walletData.data.map((wallet: any, index: any) => {
                const bgWaletColor = getRandomCalmColor(index);
                return (
                  <div key={wallet.id} className="col-span-12 md:col-span-6 h-[300px] rounded-lg" style={{ backgroundColor: bgWaletColor }}>
                    <div className="p-4 flex flex-col items-center justify-between h-full text-white">
                      <div className="flex justify-between w-full h-fit">
                        <div className="flex w-fit gap-2">
                          <FaWallet className="text-2xl" />
                          <strong>{wallet.name}</strong>
                        </div>
                        <div className="relative popover-container">
                          <FaEllipsisVertical
                            className="text-2xl cursor-pointer"
                            onClick={() =>
                              setActivePopoverId(activePopoverId === wallet.id ? null : wallet.id)
                            }
                          />
                          {activePopoverId === wallet.id && (
                            <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg z-10">
                              <button
                                className="w-full px-4 py-2 text-left hover:bg-blue-100 rounded"
                                onClick={() => {
                                  navigate(`/wallet/edit/${wallet.id}`);
                                }}
                              >
                                Update
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left hover:bg-red-100 text-red-600 rounded"
                                onClick={async () => {
                                  const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus wallet ${wallet.name} ?`);
                                  if (confirmDelete) {
                                    await deleteWallet(wallet.id);
                                    alert("Wallet berhasil dihapus.");
                                    navigate("/", { replace: true });
                                    window.location.reload();
                                  }
                                }}
                              >
                                Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-full flex justify-between">
                        <div className="flex flex-col gap-2">
                          <p>Saldo Sekarang</p>
                          <strong>{formatCurrency(wallet.myMoney)}</strong>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p>Saldo Awal</p>
                          <strong>{formatCurrency(wallet.balance)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-gray-500">Tidak ada wallet yang tersedia.</p>
            )
          }
        </div>
        </div>
    </>
  );
};