import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getWallet, deleteWallet } from "../../../resolver/wallet";
import Input from "../../../components/form/input/InputField";
import ReusableTable, { TableColumn } from "../../../components/tables/ReusableTable";


const columns: TableColumn[] = [
    {
        key: "name",
        header: "Nama Transaksi",
    },
    {
        key: "balance",
        header: "Saldo",
        render: (row) => `Rp ${row.balance.toLocaleString("id-ID")}`,
    },
];
export default function WalletPage() {
    const [walletData, setWalletData] = useState<any[]>([]);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const fetchWalletData = async () => {
        try {
            const response = await getWallet();
            setWalletData(response.data);
        } catch (error) {
            console.error("Failed to fetch wallet data:", error);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    return (
        <div className="flex flex-col justify-start w-full h-screen gap-6">
            <div id="header-transaction-income" className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold">Wallet</h1>
                <div className="flex justify-between">
                    <Input
                        id="search"
                        type="text"
                        name="search"
                        placeholder="Cari berdasarkan tipe..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-1/2"
                        success={false}
                        error={false}
                        disabled={false}
                        step={1}
                    ></Input>

                    <Link to="/wallet/create">
                        <button className="bg-green-600 text-white rounded-lg hover:bg-green-800 h-auto py-2 px-4 transition-all duration-200">
                            Tambah Wallet
                        </button>
                    </Link>
                </div>
            </div>

            <ReusableTable
                data={walletData}
                columns={columns}
                showActions
                onEdit={(row) => navigate(`/wallet/edit/${row.id}`)}
                onDelete={async (row) => {
                    const confirmDelete = confirm(`Yakin hapus wallet "${row.name}"?`);
                    if (confirmDelete) {
                        try {
                            await deleteWallet(row.id);
                            setWalletData((prev) => prev.filter((item) => item.id !== row.id));
                            alert("Wallet berhasil dihapus.");
                            navigate("/wallet", { replace: true });
                            window.location.reload();
                        } catch (error) {
                            console.error("Gagal menghapus wallet:", error);
                            alert("Gagal menghapus wallet. Silakan coba lagi.");
                        }
                    }
                }}
            />
        </div>
    );
};