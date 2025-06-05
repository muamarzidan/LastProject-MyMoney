import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getWalletById, updateWallet } from "../../../resolver/wallet";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";

export default function UpdateWalletPage() {
    const { id } = useParams<{ id: string }>();
    const [nameWallet, setNameWallet] = useState<string>("");
    const [balanceWallet, setBalanceWallet] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWallet = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const parsedId = parseInt(id);
                const data = await getWalletById(parsedId);
                setNameWallet(data.data.name);
                setBalanceWallet(data.data.balance);
            } catch (error) {
                console.error("Failed to fetch wallet:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWallet();
    }, [id]);

    const parsedId = id ? parseInt(id) : NaN;
    if (isNaN(parsedId)) {
        return <p className="text-red-500">Invalid wallet ID</p>;
    }

    const handleUpdateWallet = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsError(false);

        try {
            await updateWallet(parsedId, nameWallet, balanceWallet);
            navigate("/wallet", { replace: true });
            window.location.reload();
        } catch (error) {
            console.error("Failed to update wallet:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ComponentCard title="Update Wallet" className="">
                <form className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="input">Nama Wallet</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Masukan nama wallet"
                            value={nameWallet}
                            onChange={(e) => setNameWallet(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="input">Nominal</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="Masukan jumlah saldo"
                            value={balanceWallet}
                            onChange={(e) => setBalanceWallet(Number(e.target.value))}
                        />
                    </div>

                    <div className="mb-4 flex justify-end">
                        <button
                            disabled={isLoading || isError}
                            onClick={handleUpdateWallet}
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {isLoading ? "Updating..." : "Update"}
                        </button>
                    </div>
                    {isError && <p className="text-red-500">Gagal update data</p>}
                </form>
            </ComponentCard>
        </>
    );
};