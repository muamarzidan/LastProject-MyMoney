import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getWalletById, updateWallet } from "../../../resolver/wallet";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";


interface ValidationErrors {
    nameWallet?: string;
    balanceWallet?: string;
}

export default function UpdateWalletPage() {
    const { id } = useParams<{ id: string }>();
    const [nameWallet, setNameWallet] = useState<string>("");
    const [balanceWallet, setBalanceWallet] = useState<string>("0");
    const [currentBalance, setCurrentBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<{ nameWallet: boolean; balanceWallet: boolean }>({
        nameWallet: false,
        balanceWallet: false
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWallet = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const parsedId = parseInt(id);
                const data = await getWalletById(parsedId);
                setNameWallet(data.data.name);
                setCurrentBalance(data.data.balance);
            } catch (error) {
                console.error("Failed to fetch wallet:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWallet();
    }, [id]);

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!nameWallet.trim()) {
            newErrors.nameWallet = "Nama wallet tidak boleh kosong";
        } else if (nameWallet.trim().length < 3) {
            newErrors.nameWallet = "Nama wallet minimal 3 karakter";
        } else if (nameWallet.trim().length > 50) {
            newErrors.nameWallet = "Nama wallet maksimal 50 karakter";
        }

        if (Number(balanceWallet) < 0) {
            newErrors.balanceWallet = "Nominal tidak boleh negatif";
        } else if (Number(balanceWallet) > 999999999) {
            newErrors.balanceWallet = "Nominal terlalu besar (maksimal 999,999,999)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNameWallet(value);
        
        if (touched.nameWallet) {
            const newErrors = { ...errors };
            if (!value.trim()) {
                newErrors.nameWallet = "Nama wallet tidak boleh kosong";
            } else if (value.trim().length < 3) {
                newErrors.nameWallet = "Nama wallet minimal 3 karakter";
            } else if (value.trim().length > 50) {
                newErrors.nameWallet = "Nama wallet maksimal 50 karakter";
            } else {
                delete newErrors.nameWallet;
            }
            setErrors(newErrors);
        }
    };

    const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/,/g, '');
        if (!value || /^\d+$/.test(value)) {
            setBalanceWallet(value);
        }
        
        if (touched.balanceWallet) {
            const newErrors = { ...errors };
            if (Number(value) < 0) {
                newErrors.balanceWallet = "Nominal tidak boleh negatif";
            } else if (Number(value) > 999999999) {
                newErrors.balanceWallet = "Nominal terlalu besar (maksimal 999,999,999)";
            } else {
                delete newErrors.balanceWallet;
            }
            setErrors(newErrors);
        }
    };

    const parsedId = id ? parseInt(id) : NaN;
    if (isNaN(parsedId)) {
        return <p className="text-red-500">Invalid wallet ID</p>;
    }

    const formatNumber = (value: string) => {
        const num = value.replace(/\D/g, '');
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleUpdateWallet = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setTouched({ nameWallet: true, balanceWallet: true });
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setIsError(false);

        try {
            await updateWallet(parsedId, nameWallet.trim(), Number(balanceWallet));
            navigate("/wallet", { replace: true });
            window.location.reload();
        } catch (error) {
            console.error("Failed to update wallet:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = !errors.nameWallet && !errors.balanceWallet && nameWallet.trim().length >= 3;

    return (
        <>
            <ComponentCard title="Update Wallet" className="">
                <form className="flex flex-col gap-4" onSubmit={handleUpdateWallet}>
                    <div>
                        <Label htmlFor="name">Nama Wallet</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Masukan nama wallet"
                            value={nameWallet}
                            onChange={handleNameChange}
                            className={errors.nameWallet ? "border-red-500" : ""}
                        />
                        {errors.nameWallet && (
                            <p className="text-red-500 text-sm mt-1">{errors.nameWallet}</p>
                        )}
                    </div>
                    
                    <div>
                        <Label htmlFor="amount">Nominal tambahan</Label>
                        <Input
                            id="amount"
                            type="text"
                            min="0"
                            max="999999999"
                            placeholder="Masukan jumlah saldo"
                            value={formatNumber(balanceWallet)}
                            onChange={handleBalanceChange}
                            className={errors.balanceWallet ? "border-red-500" : ""}
                        />
                        {errors.balanceWallet && (
                            <p className="text-red-500 text-sm mt-1">{errors.balanceWallet}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                            Saldo saat ini: {currentBalance.toLocaleString()} (Silahkan tambahkan saldo baru diatas)
                        </p>
                    </div>

                    <div className="mb-4 flex justify-end">
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate("/wallet")}
                                type="button"
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Kembali
                            </button>
                            <button
                                disabled={isLoading || !isFormValid}
                                type="submit"
                                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                                    isLoading || !isFormValid
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {isLoading ? "Mengupdate..." : "Update"}
                            </button>
                        </div>
                    </div>
                    
                    {isError && (
                        <p className="text-red-500 text-center">Gagal update data. Silahkan coba lagi.</p>
                    )}
                </form>
            </ComponentCard>
        </>
    );
};