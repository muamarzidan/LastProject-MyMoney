import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createIncome } from "../../../../resolver/transaction/income";
import { getAllCategory } from "../../../../resolver/category/index";
import { getWallet } from "../../../../resolver/wallet/index"; 
import ComponentCard from "../../../../components/common/ComponentCard";
import DatePicker from "../../../../components/form/date-picker";
import Input from "../../../../components/form/input/InputField";
import TextArea from "../../../../components/form/input/TextArea";
import Label from "../../../../components/form/Label";
import Select from "../../../../components/form/Select";

interface ValidationErrors {
  selectedWallet?: string;
  selectedCategory?: string;
  amount?: string;
  source?: string;
  date?: string;
}

export default function CreateTransactionIncomePage() {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [selectedWallet, setSelectedWallet] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const walletRes = await getWallet();
        const walletOptions = walletRes.data.map((w: any) => ({
          value: w.id,
          label: w.name,
        }));
        setWallets(walletOptions);
      } catch (err) {
        console.error("Gagal mengambil wallet:", err);
      }
    };

    fetchWallets();
  }, []);

  const handleWalletChange = async (walletId: string) => {
    setSelectedWallet(walletId);
    setErrors(prev => ({ ...prev, selectedWallet: undefined }));

    try {
      const numericId = parseInt(walletId, 10);
      const categoryRes = await getAllCategory(numericId);

      const categoryOptions = categoryRes.data.map((c: any) => ({
        value: c.name,
        label: c.name,
      }));
      setCategories(categoryOptions);
      
      setSelectedCategory("");
    } catch (err) {
      console.error("Gagal mengambil kategori:", err);
      setCategories([]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!selectedWallet) {
      newErrors.selectedWallet = "Wallet harus dipilih";
    }

    if (!selectedCategory) {
      newErrors.selectedCategory = "Kategori harus dipilih";
    }

    if (!amount) {
      newErrors.amount = "Nominal harus diisi";
    } else if (Number(amount) <= 0) {
      newErrors.amount = "Nominal harus lebih dari 0";
    }

    if (!source.trim()) {
      newErrors.source = "Sumber transaksi harus diisi";
    }

    if (!date) {
      newErrors.date = "Tanggal harus dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        wallet: { id: Number(selectedWallet) },
        category: selectedCategory,
        amount: Number(amount),
        description,
        source,
        date,
      };
      await createIncome(payload);
      navigate("/transaction-income");
    } catch (err) {
      console.error("Gagal menambahkan income:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = (field: keyof ValidationErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
      <ComponentCard title="Buat Transaksi" className="">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label>Wallet</Label>
            <Select
              options={wallets}
              placeholder="Pilih wallet"
              onChange={(val) => handleWalletChange(val)}
            />
            {errors.selectedWallet && (
              <p className="text-red-500 text-sm mt-1">{errors.selectedWallet}</p>
            )}
          </div>

          <div>
            <Label>Categori</Label>
            <Select
              options={categories}
              placeholder="Pilih kategori"
              onChange={(val) => {
                setSelectedCategory(val);
                clearError('selectedCategory');
              }}
              className="dark:bg-dark-900"
            />
            {errors.selectedCategory && (
              <p className="text-red-500 text-sm mt-1">{errors.selectedCategory}</p>
            )}
          </div>

          <div>
            <Label>Nominal</Label>
            <Input
              type="number"
              value={amount}
              placeholder="Masukkan jumlah"
              onChange={(e) => {
                setAmount(e.target.value);
                clearError('amount');
              }}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <Label>Sumber</Label>
            <Input
              type="text"
              value={source}
              placeholder="Masukkan Sumber Transaksi"
              onChange={(e) => {
                setSource(e.target.value);
                clearError('source');
              }}
            />
            {errors.source && (
              <p className="text-red-500 text-sm mt-1">{errors.source}</p>
            )}
          </div>

          <div>
            <DatePicker
              id="date"
              label="Tanggal"
              placeholder="Pilih tanggal"
              onChange={(_, currentDateString) => {
                setDate(currentDateString);
                clearError('date');
              }}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <Label>Deskripsi</Label>
            <TextArea
              value={description}
              placeholder="Masukkan deskripsi"
              onChange={setDescription}
              rows={4}
            />
          </div>
          
          <div className="mb-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white rounded-lg ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSubmitting ? 'Menambahkan...' : 'Tambah'}
            </button>
          </div>
        </form>
      </ComponentCard >
    </>
  );
};