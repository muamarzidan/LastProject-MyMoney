import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getWallet } from "../../../resolver/wallet/index";
import { getAllCategory, deleteCategory } from "../../../resolver/category/index";
import ReusableTable, { TableColumn } from "../../../components/tables/ReusableTable";
import Select from "../../../components/form/Select";


const columns: TableColumn[] = [
    {
        key: "name",
        header: "Nama Kategori",
    }
];

export default function CategoryPage() {
    const [categoryData, setCategoryData] = useState<any[]>([]);
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
        if (selectedWalletId) fetchCategoryData(selectedWalletId);
    }, [selectedWalletId]);

    const fetchCategoryData = async (walletId: number) => {
        try {
            const response = await getAllCategory(walletId);
            setCategoryData(response.data);
        } catch (error) {
            console.error("Failed to fetch category data:", error);
        }
    };

    return (
        <div className="flex flex-col justify-start w-full h-screen gap-6">
            <div className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold">Kategori</h1>

                <div className="flex justify-between">
                    <Select
                        className="w-fit"
                        options={walletList.map((w) => ({
                            value: w.id.toString(),
                            label: w.name,
                        }))}
                        placeholder="---- Pilih Wallet ---- "
                        value={selectedWalletId?.toString() ?? ""}
                        onChange={(val) => setSelectedWalletId(Number(val))}
                    />

                    <Link to="/category/create">
                        <button className="bg-green-600 text-white rounded-lg hover:bg-green-800 h-auto py-2 px-4 transition-all duration-200">
                            Tambah Kategori
                        </button>
                    </Link>
                </div>

                {selectedWalletId && (
                    <ReusableTable
                        data={categoryData}
                        columns={columns}
                        showActions
                        showEdit={false}
                        onDelete={async (row) => {
                            const confirmDelete = confirm(`Hapus kategori "${row.name}"?`);
                            if (confirmDelete && selectedWalletId) {
                                try {
                                    await deleteCategory(row.id, selectedWalletId);
                                    setCategoryData((prev) =>
                                        prev.filter((item) => item.id !== row.id)
                                    );
                                    alert("Kategori berhasil dihapus");
                                } catch (error) {
                                    console.error("Gagal menghapus kategori:", error);
                                    alert("Gagal menghapus kategori.");
                                }
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
};