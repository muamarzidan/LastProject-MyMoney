import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getWallet } from "../../../../resolver/wallet/index";
import { deleteTransactionById } from "../../../../resolver/transaction/index";
import { getAllExpense } from "../../../../resolver/transaction/expanse";
import ReusableTable, {
    TableColumn,
} from "../../../../components/tables/ReusableTable";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";


const columns: TableColumn[] = [
    { key: "destination", header: "Destinasi" },
    { key: "category", header: "Kategori" },
    {
        key: "amount",
        header: "Jumlah",
        render: (row) => `Rp ${row.amount.toLocaleString("id-ID")}`,
    },
    {
        key: "date",
        header: "Tanggal",
        render: (row) => new Date(row.date).toLocaleDateString("id-ID"),
    },
];

export default function TransactionOutcomePage() {
    const [search, setSearch] = useState("");
    const [data, setData] = useState<any[]>([]);
    const [walletList, setWalletList] = useState<any[]>([]);
    const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await getWallet();
                setWalletList(res.data);
            } catch (error) {
                console.error("Failed to fetch wallets", error);
            }
        })();
    }, []);

    useEffect(() => {
        if (selectedWalletId) fetchTransactionIncome(selectedWalletId);
    }, [selectedWalletId]);

    const fetchTransactionIncome = async (walletId: number) => {
        try {
            const res = await getAllExpense(walletId);
            setData(res.data);
        } catch (error) {
            console.error("Failed to fetch transaction income", error);
        }
    };
    
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);
    
    return (
        <div className="flex flex-col justify-start w-full h-screen gap-6">
            <div id="header-transaction-outcome" className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold mb-3 sm:mb-0">Transaction Outcome</h1>
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                    <div className="flex w-full sm:w-fit gap-4">
                        <Select 
                            className="w-fit" 
                            options={walletList.map((w) => ({
                                value: w.id.toString(),
                                label: w.name,
                            }))}
                            placeholder="---- Pilih Wallet ----"
                            value={selectedWalletId?.toString() ?? ""}
                            onChange={(val) => setSelectedWalletId(Number(val))} 
                        />
                        <Input
                            id="search"
                            type="text"
                            name="search"
                            placeholder="Cari berdasarkan destinasi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-1/2"
                        />
                    </div>
                    <Link to="/transaction-outcome/create">
                            <button className="bg-blue-600 text-white rounded-lg hover:bg-blue-800 h-auto py-2 px-4 transition-all duration-200 w-full sm:w-fit">
                                Tambah Transaksi
                            </button>
                    </Link>
                </div>
            </div>
            
            <ReusableTable
                data={data.filter((d) => 
                    d?.destination?.toLowerCase().includes(debouncedSearch.toLowerCase())
                )}
                columns={columns}
                showActions
                onDelete={async (row) => {
                    const confirmDelete = confirm(`Hapus transaksi outcome "${row.destination}"?`);
                    if (confirmDelete) {
                        try {
                            await deleteTransactionById(row.id, row.wallet.id);
                            setData((prev) => prev.filter((item) => item.id !== row.id));
                            alert("Transaksi berhasil dihapus");
                        } catch (err) {
                            console.error("Gagal menghapus transaksi:", err);
                            alert("Gagal menghapus transaksi");
                        }
                    }
                }}
            />
            
        </div>
    );
};