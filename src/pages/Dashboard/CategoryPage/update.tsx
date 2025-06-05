import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getCategoryById, updateCategory } from "../../../resolver/category";
import { getWallet } from "../../../resolver/wallet";

import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";


export default function UpdateCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [nameCategory, setNameCategory] = useState<string>("");
  const [walletId, setWalletId] = useState<null | number>(0);
  const [walletList, setWalletList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const category = await getCategoryById(parseInt(id), walletId || 0);
        console.log("Fetched category:", category.data);
        setNameCategory(category.data.name);
        setWalletId(category.data.wallet?.id || 0);

        const walletRes = await getWallet();
        setWalletList(walletRes.data);
      } catch (error) {
        console.error("Failed to fetch category:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);


  const parsedId = id ? parseInt(id) : NaN;
  if (isNaN(parsedId)) {
    return <p className="text-red-500">Invalid category ID</p>;
  }

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletId) return alert("Pilih Wallet terlebih dahulu");

    console.log("Updating category with ID:", parsedId);

    setIsLoading(true);
    setIsError(false);

    try {
      await updateCategory(parsedId, nameCategory, walletId);
      navigate("/category", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Failed to update category:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ComponentCard title="Update Kategori">
      <form className="flex flex-col gap-4" onSubmit={handleUpdateCategory}>
        <div>
          <Label htmlFor="name">Nama Kategori</Label>
          <Input
            id="name"
            type="text"
            placeholder="Masukan nama kategori"
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
            {walletList.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
        {isError && <p className="text-red-500">Gagal update kategori</p>}
      </form>
    </ComponentCard>
  );
};