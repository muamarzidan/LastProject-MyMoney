import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { getWallet } from "../../../resolver/wallet/index";
import { createCategory } from "../../../resolver/category/index";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";


export default function CreateCategoryPage() {
    const [nameCategory, setNameCategory] = useState<string>("");
    const [walletId, setWalletId] = useState<number | null>(null);
    const [walletList, setWalletList] = useState<any[]>([]);
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

                <div>
                    <Label htmlFor="wallet">Pilih Wallet</Label>
                    <select
                        id="wallet"
                        value={walletId ?? ""}
                        onChange={(e) => setWalletId(Number(e.target.value))}
                    >
                        <option value="">-- Pilih Wallet --</option>
                        {walletList.map((w) => (
                            <option key={w.id} value={w.id}>
                                {w.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4 flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        {isLoading ? "Membuat..." : "Tambah"}
                    </button>
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
