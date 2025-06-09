import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { getWallet } from "../../../resolver/wallet/index";
import { createCategory } from "../../../resolver/category/index";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";


export default function CreateCategoryPage() {
    const [nameCategory, setNameCategory] = useState<string>("");
    const [walletId, setWalletId] = useState<number | null>(null);
    const [walletList, setWalletList] = useState<any[]>([]);
    const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

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
        if (selectedWalletId) fetchWalletId(selectedWalletId);
    }, [selectedWalletId]);

    const fetchWalletId = async (walletId: number) => {
        try {
            setWalletId(walletId);
        } catch (error) {
            console.error("Failed to fetch wallet ID:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!walletId) return alert("Pilih Wallet terlebih dahulu");

        setIsLoading(true);
        setIsError(false);
        try {
            await createCategory(nameCategory, walletId);
            setNameCategory("");
            navigate("/category", { replace: true });
            window.location.reload();
        } catch (error) {
            console.error("Failed to create category:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            <ComponentCard title="Buat Kategori" className="">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="wallet">Pilih Wallet</Label>
                        <Select
                            options={walletList.map((w) => ({
                                value: w.id.toString(),
                                label: w.name,
                            }))}
                            placeholder="---- Pilih Wallet ---- "
                            value={selectedWalletId?.toString() ?? ""}
                            onChange={(val) => setSelectedWalletId(Number(val))}
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="name">Nama Kategori</Label>
                        <Input
                            name="name"
                            id="name"
                            type="text"
                            placeholder="Masukan nama"
                            value={nameCategory}
                            onChange={(e) => setNameCategory(e.target.value)}
                        />
                    </div>

                    <div className="mb-4 flex justify-end">
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate("/category")}
                                type="button"
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Kembali
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                {isLoading ? "Membuat..." : "Tambah"}
                            </button>
                        </div>
                    </div>

                    {isError && (
                        <div className="text-red-500">
                            Gagal membuat kategori
                        </div>
                    )}
                </form>
            </ComponentCard>
        </>
    );
}
