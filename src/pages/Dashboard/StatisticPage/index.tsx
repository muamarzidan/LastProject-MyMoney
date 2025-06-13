import { useState, useEffect, useRef } from "react";
import * as echarts from 'echarts';
import axios from "axios";
import { IoMdArrowRoundDown } from "react-icons/io";

import { getWallet } from "../../../resolver/wallet/index";
import axiosRequest from "../../../utils/request";
import Select from "../../../components/form/Select";
import ReusableTable, { TableColumn } from "../../../components/tables/ReusableTable";
const API_URL = import.meta.env.VITE_BE_API_URL;


interface Wallet {
    id: number;
    name: string;
}
interface TransactionByType {
    type: string;
    amount: number;
}

interface TransactionByCategory {
    category: string;
    amount: number;
}

interface StatisticsData {
    walletId: number;
    totalTransaction: number;
    totalIncome: number;
    totalOutcome: number;
    allTransactionByType: TransactionByType[];
    allTransactionByCategory: TransactionByCategory[];
}

interface Transaction {
    id: number;
    amount: number;
    date: string;
    transactionType: string;
    source: string;
    category: string;
    value: number;
    wallet: {
        id: number;
        name: string;
        balance: number;
    };
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

const columns: TableColumn[] = [
    {
        key: "source",
        header: "Sumber/Destinasi",
        render: (row) => {
            if (row.transactionType === 'INCOME') {
                return row.source || '-';
            } else {
                return row.destination || '-';
            }
        },
    },
    {
        key: "category",
        header: "Kategori",
    },
    {
        key: "value",
        header: "Nominal",
        render: (row) => formatCurrency(row.value),
    },
    {
        key: "date",
        header: "Tanggal",
        render: (row) => new Date(row.date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }),
    },
        {
        key: "transactionType",
        header: "Tipe Transaksi",
        render: (row) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                row.transactionType === 'INCOME' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
            }`}>
                {row.transactionType === 'INCOME' ? 'Income' : 'Outcome'}
            </span>
        ),
    }
];

export default function StatisticPage() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<string>("");
    const [selectedDateRange, setSelectedDateRange] = useState<string>("monthly");
    const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
    const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    const pieChartRef = useRef<HTMLDivElement>(null);
    const barChartRef = useRef<HTMLDivElement>(null);

    const formatRupiahFilter = (value: number) => {
        const newValue = Number(value);

        if (newValue >= 1_000_000_000) {
        return (newValue / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'b';
        } else if (newValue >= 1_000_000) {
        return (newValue / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
        } else if (newValue >= 1_000) {
        return (newValue / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
        } else {
        return newValue.toString();
        }
    };

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const response = await getWallet();
                if (response.status === 200 && response.data) {
                    setWallets(response.data);
                    if (response.data.length > 0) {
                        setSelectedWallet(response.data[0].id.toString());
                    }
                }
            } catch (error) {
                console.error("Error fetching wallets:", error);
            }
        };

        fetchWallets();
    }, []);

    useEffect(() => {
        if (selectedWallet) {
            fetchStatistics();
            fetchTransactions();
        }
    }, [selectedWallet, selectedDateRange]);

    const fetchStatistics = async () => {
        if (!selectedWallet) return;
        
        setLoading(true);
        try {
            const isYear = selectedDateRange === "yearly";
            const response = await axiosRequest.get(
                `/api/wallets/transactions/statistics?walletId=${selectedWallet}&isYear=${isYear}`
            );
            
            if (response.data.status === 200) {
                setStatisticsData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching statistics:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactions = async () => {
        if (!selectedWallet) return;
        
        setLoadingTransactions(true);
        try {
            const response = await axiosRequest.get(
                `/api/wallets/transactions?walletId=${selectedWallet}`
            );
            
            if (response.data.status === 200) {
                setTransactionsData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoadingTransactions(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
        }).format(amount);
    };

    useEffect(() => {
        if (statisticsData && pieChartRef.current) {
            const chartInstance = echarts.init(pieChartRef.current);
            
            const pieData = statisticsData.allTransactionByCategory.map(item => ({
                name: item.category,
                value: item.amount
            }));

            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                series: [
                    {
                        name: 'Kategori',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
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
                        },
                        data: pieData,
                        color: ['#06B6D4', '#0C0707', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
                    }
                ]
            };

            chartInstance.setOption(option);

            return () => {
                chartInstance.dispose();
            };
        }
    }, [statisticsData]);

    useEffect(() => {
        if (statisticsData && barChartRef.current) {
            const chartInstance = echarts.init(barChartRef.current);
            
            const incomeData = statisticsData.allTransactionByType.find(item => item.type === 'income');
            const outcomeData = statisticsData.allTransactionByType.find(item => item.type === 'outcome');

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['Income', 'Outcome'],
                    axisTick: {
                        alignWithLabel: true
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                    formatter: function (value: number) {
                            return formatRupiahFilter(value);
                        }
                    }
                },
                series: [
                    {
                        name: 'Amount',
                        type: 'bar',
                        barWidth: '60%',
                        data: [
                            {
                                value: outcomeData?.amount || 0,
                                itemStyle: { color: '#465fff' }
                            },
                            {
                                value: incomeData?.amount || 0,
                                itemStyle: { color: '#EF4444' }
                            }
                        ]
                    }
                ]
            };

            chartInstance.setOption(option);

            return () => {
                chartInstance.dispose();
            };
        }
    }, [statisticsData]);

    const getToken = localStorage.getItem("app-token");
    const handlePrintExcel = async (walletId: number, isYear: boolean) => {
        try {
            const response = await axios.get(
            `${API_URL}/api/wallets/export-excel/${walletId}?isYear=${isYear}`,
            {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${getToken}`,
                },
            }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'transactions.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Gagal download file:", error);
        }
    };

    const walletOptions = wallets.map(wallet => ({
        value: wallet.id.toString(),
        label: wallet.name
    }));

    const dateRangeOptions = [
        { value: "monthly", label: "Bulanan" },
        { value: "yearly", label: "Tahunan" },
    ];

    const changeValueBool = (value: string) => {
        if (value === "yearly") {
            return true;
        } 
        return false;
    }

    return (
        <div className="flex flex-col w-full h-screen gap-6">
            <h1 className="text-3xl font-bold text-gray-800">Statistik</h1>
            
            <div className="w-full flex flex-col sm:flex-row justify-between items-center">
                <div className="flex w-full flex-col sm:flex-row gap-4">
                    <Select
                        className="w-full sm:w-48"
                        options={walletOptions}
                        placeholder="---- Pilih Wallet ----"
                        value={selectedWallet}
                        onChange={setSelectedWallet}
                    />
                    <Select
                        className="w-full sm:w-48"
                        options={dateRangeOptions}
                        placeholder="---- Pilih Rentang Waktu ----"
                        value={selectedDateRange}
                        onChange={setSelectedDateRange}
                    />
                </div>
                <div 
                    onClick={() => handlePrintExcel(Number(selectedWallet), changeValueBool(selectedDateRange))}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-colors flex gap-1 items-center cursor-pointer w-full sm:w-fit mt-5 sm:mt-0"
                >
                    <p>Cetak</p>
                    <IoMdArrowRoundDown className="text-xl text-white" />   
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="text-lg text-gray-600">Loading...</div>
                </div>
            ) : (
                <>
                    <div className="flex flex-wrap justify-between w-full gap-6">
                        <div className="flex-1 p-6 bg-white rounded-xl shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Transaksi</h2>
                            <p className="text-md sm:text-lg lg:text-2xl font-bold text-gray-900">
                                {statisticsData ? formatCurrency(statisticsData.totalTransaction) : formatCurrency(0)}
                            </p>
                        </div>

                        <div className="flex-1 p-6 bg-white rounded-xl shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Income</h2>
                            <p className="text-md sm:text-lg lg:text-2xl font-bold text-green-600">
                                {statisticsData ? formatCurrency(statisticsData.totalIncome) : formatCurrency(0)}
                            </p>
                        </div>

                        <div className="flex-1 p-6 bg-white rounded-xl shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Outcome</h2>
                            <p className="text-md sm:text-lg lg:text-2xl font-bold text-red-600">
                                {statisticsData ? formatCurrency(statisticsData.totalOutcome) : formatCurrency(0)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 md:col-span-6 p-6 bg-white rounded-xl shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Statistik Kategori</h2>
                            <div ref={pieChartRef} style={{ width: '100%', height: '300px' }}></div>
                        </div>

                        <div className="col-span-12 md:col-span-6 p-6 bg-white rounded-xl shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Statistik Tipe Transaksi</h2>
                            <div ref={barChartRef} style={{ width: '100%', height: '300px' }}></div>
                        </div>
                    </div>

                    <div className="w-full mb-6">
                        <div className="p-6 bg-white rounded-xl shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-gray-700">Riwayat Transaksi</h2>
                                <div className="text-sm text-gray-500">
                                    Total: {transactionsData.length} transaksi
                                </div>
                            </div>
                            
                            {loadingTransactions ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="text-lg text-gray-600">Loading transaksi...</div>
                                </div>
                            ) : transactionsData.length > 0 ? (
                                <ReusableTable
                                    data={transactionsData}
                                    columns={columns}
                                    showActions={false}
                                />
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Tidak ada data transaksi
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};