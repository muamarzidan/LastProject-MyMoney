import { useState } from "react";
import { useNavigate } from "react-router";

import { createWallet } from "../../../resolver/wallet";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";


export default function CreateWalletPage() {
    const [nameWallet, setNameWallet] = useState<string>("");
    const [balanceWallet, setBalanceWallet] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsError(false);

        try {
            await createWallet(nameWallet, balanceWallet);
            setNameWallet("");
            setBalanceWallet(0);
            navigate("/wallet", { replace: true });
            window.location.reload();
        } catch (error) {
            console.error("Failed to create wallet:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            <ComponentCard title="Buat Wallet" className="">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            name="name"
                            id="name"
                            type="text"
                            placeholder="Masukan nama"
                            value={nameWallet}
                            onChange={(e) => setNameWallet(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="amount">Saldo</Label>
                        <Input
                            name="amount"
                            id="amount"
                            type="number"
                            placeholder="Masukan jumlah saldo"
                            value={balanceWallet}
                            onChange={(e) => setBalanceWallet(Number(e.target.value))}
                        />
                    </div>

                    <div className="mb-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            {isLoading ? "Creating..." : "Tambah"}
                        </button>
                    </div>
                </form>
            </ComponentCard>
        </>
    );
}
