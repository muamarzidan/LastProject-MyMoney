import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getAllIncome } from "../../../../resolver/transaction/income";
import { getWallet } from "../../../../resolver/wallet/index";
import { deleteTransactionById } from "../../../../resolver/transaction/index";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import ReusableTable, {
    TableColumn,
} from "../../../../components/tables/ReusableTable";


const columns: TableColumn[] = [
    { key: "source", header: "Sumber" },
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

export default function TransactionIncomePage() {
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
            const res = await getAllIncome(walletId);
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
            <div id="header-transaction-income" className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold">Transaction Income</h1>
                <div className="flex justify-between">
                    <div className="flex w-fit gap-4">
                        <Select
                            className="border px-2 py-2 rounded"
                            options={walletList.map((w) => ({
                                value: w.id.toString(),
                                label: w.name,
                            }))}
                            placeholder="---- Pilih Wallet ---- "
                            value={selectedWalletId?.toString() ?? ""}
                            onChange={(val) => setSelectedWalletId(Number(val))}
                        />
                        <Input
                            id="search"
                            type="text"
                            name="search"
                            placeholder="Cari berdasarkan sumber..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-1/2"
                        />
                    </div>
                    <Link to="/transaction-income/create">
                        <button className="bg-green-600 text-white rounded-lg hover:bg-green-800 h-auto py-2 px-4 transition-all duration-200">
                            Tambah Transaksi
                        </button>
                    </Link>
                </div>
            </div>

            <ReusableTable
                data={data.filter((d) =>
                    d.source.toLowerCase().includes(debouncedSearch.toLowerCase())
                )}
                columns={columns}
                showActions
                onDelete={async (row) => {
                    const confirmDelete = confirm(`Hapus transaksi income "${row.source}"?`);
                    if (confirmDelete) {
                        try {
                            await deleteTransactionById(row.id, row.wallet.id);
                            setData((prev) => prev.filter((item) => item.id !== row.id));
                            alert("Transaksi berhasil dihapus");
                        } catch (error) {
                            console.error("Gagal menghapus transaksi:", error);
                            alert("Gagal menghapus transaksi");
                        }
                    }
                }}
            />
        </div>
    );
};