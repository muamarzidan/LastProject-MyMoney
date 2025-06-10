import { useState } from "react";
import { useNavigate } from "react-router";

import { createWallet } from "../../../resolver/wallet";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";


interface ValidationErrors {
    nameWallet?: string;
    balanceWallet?: string;
}

export default function CreateWalletPage() {
    const [nameWallet, setNameWallet] = useState<string>("");
    const [balanceWallet, setBalanceWallet] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!nameWallet.trim()) {
            newErrors.nameWallet = "Nama wallet tidak boleh kosong";
        } else if (nameWallet.trim().length < 2) {
            newErrors.nameWallet = "Nama wallet minimal 2 karakter";
        } else if (nameWallet.trim().length > 30) {
            newErrors.nameWallet = "Nama wallet maksimal 30 karakter";
        }

        if (!balanceWallet.trim()) {
            newErrors.balanceWallet = "Saldo tidak boleh kosong";
        } else {
            const balance = Number(balanceWallet);
            if (isNaN(balance)) {
                newErrors.balanceWallet = "Saldo harus berupa angka";
            } else if (balance < 0) {
                newErrors.balanceWallet = "Saldo tidak boleh negatif";
            } else if (balance > 999999999999) {
                newErrors.balanceWallet = "Saldo terlalu besar (maksimal 999,999,999,999)";
            }
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
            await createWallet(nameWallet.trim(), Number(balanceWallet));
            setNameWallet("");
            setBalanceWallet("");
            navigate("/wallet", { replace: true });
            window.location.reload();
        } catch (error) {
            console.error("Failed to create wallet:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
            setIsSubmitting(false);
        }
    };

    const formatNumber = (value: string) => {
        const num = value.replace(/\D/g, '');
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/,/g, '');
        if (!value || /^\d+$/.test(value)) {
            setBalanceWallet(value);
            clearError('balanceWallet');
        }
    };

    if (isLoading) {
        return (
            <ComponentCard title="Buat Wallet">
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Memuat...</p>
                </div>
            </ComponentCard>
        );
    };

    return (
        <>
            <ComponentCard title="Buat Wallet">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="name">Nama Wallet</Label>
                        <Input
                            name="name"
                            id="name"
                            type="text"
                            placeholder="Masukan nama wallet"
                            value={nameWallet}
                            onChange={(e) => {
                                setNameWallet(e.target.value);
                                clearError('nameWallet');
                            }}
                        />
                        {errors.nameWallet && (
                            <p className="text-red-500 text-sm mt-1">{errors.nameWallet}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                            {nameWallet.length}/50 karakter
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="amount">Saldo Awal</Label>
                        <Input
                            name="amount"
                            id="amount"
                            type="text"
                            placeholder="Masukan jumlah saldo awal"
                            value={formatNumber(balanceWallet)}
                            onChange={handleBalanceChange}
                        />
                        {errors.balanceWallet && (
                            <p className="text-red-500 text-sm mt-1">{errors.balanceWallet}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                            {balanceWallet ? `Rp ${formatNumber(balanceWallet)}` : 'Masukkan angka nominal tanpa titik atau koma'}
                        </p>
                    </div>

                    <div className="mb-4 flex justify-end">
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate("/wallet")}
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
                                {isSubmitting ? "Menambahkan..." : "Tambah"}
                            </button>
                        </div>
                    </div>

                    {isError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline">Gagal membuat wallet. Silakan coba lagi.</span>
                        </div>
                    )}
                </form>
            </ComponentCard>
        </>
    );
};