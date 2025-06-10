import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { getWallet } from "../../../resolver/wallet/index";
import { createCategory } from "../../../resolver/category/index";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";

interface ValidationErrors {
    selectedWalletId?: string;
    nameCategory?: string;
}

export default function CreateCategoryPage() {
    const [nameCategory, setNameCategory] = useState<string>("");
    const [walletId, setWalletId] = useState<number | null>(null);
    const [walletList, setWalletList] = useState<any[]>([]);
    const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
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

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!selectedWalletId) {
            newErrors.selectedWalletId = "Wallet harus dipilih";
        }

        if (!nameCategory.trim()) {
            newErrors.nameCategory = "Nama kategori tidak boleh kosong";
        } else if (nameCategory.trim().length < 2) {
            newErrors.nameCategory = "Nama kategori minimal 2 karakter";
        } else if (nameCategory.trim().length > 50) {
            newErrors.nameCategory = "Nama kategori maksimal 50 karakter";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearError = (field: keyof ValidationErrors) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setIsSubmitting(true);
        setIsError(false);
        
        try {
            await createCategory(nameCategory.trim(), walletId!);
            setNameCategory("");
            navigate("/category", { replace: true });
            window.location.reload();
        } catch (error) {
            console.error("Failed to create category:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <ComponentCard title="Buat Kategori">
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Memuat...</p>
                </div>
            </ComponentCard>
        );
    }

    return (
        <>
            <ComponentCard title="Buat Kategori" className="">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="wallet">Pilih Wallet</Label>
                        <Select
                            className="w-fit"
                            options={walletList.map((w) => ({
                                value: w.id.toString(),
                                label: w.name,
                            }))}
                            placeholder="---- Pilih Wallet ---- "
                            value={selectedWalletId?.toString() ?? ""}
                            onChange={(val) => {
                                setSelectedWalletId(Number(val));
                                clearError('selectedWalletId');
                            }}
                        />
                        {errors.selectedWalletId && (
                            <p className="text-red-500 text-sm mt-1">{errors.selectedWalletId}</p>
                        )}
                    </div>
                    
                    <div>
                        <Label htmlFor="name">Nama Kategori</Label>
                        <Input
                            name="name"
                            id="name"
                            type="text"
                            placeholder="Masukan nama kategori"
                            value={nameCategory}
                            onChange={(e) => {
                                setNameCategory(e.target.value);
                                clearError('nameCategory');
                            }}
                        />
                        {errors.nameCategory && (
                            <p className="text-red-500 text-sm mt-1">{errors.nameCategory}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                            {nameCategory.length}/50 karakter
                        </p>
                    </div>

                    <div className="mb-4 flex justify-end">
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate("/category")}
                                type="button"
                                disabled={isSubmitting}
                                className={`px-4 py-2 text-white rounded-lg ${
                                    isSubmitting 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-gray-600 hover:bg-gray-700'
                                }`}
                            >
                                Kembali
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-4 py-2 text-white rounded-lg ${
                                    isSubmitting 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {isSubmitting ? "Membuat..." : "Tambah"}
                            </button>
                        </div>
                    </div>

                    {isError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> Gagal membuat kategori. Silakan coba lagi.</span>
                        </div>
                    )}
                </form>
            </ComponentCard>
        </>
    );
};