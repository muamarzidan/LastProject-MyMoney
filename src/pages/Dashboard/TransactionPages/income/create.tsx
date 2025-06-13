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
  description?: string;
}

export default function CreateTransactionIncomePage() {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [selectedWallet, setSelectedWallet] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState<string>("");
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

    if (!amount.trim()) {
      newErrors.amount = "Nominal tidak boleh kosong";
    } else {
      const numericAmount = Number(amount);
      if (isNaN(numericAmount)) {
        newErrors.amount = "Nominal harus berupa angka";
      } else if (numericAmount < 0) {
        newErrors.amount = "Nominal harus lebih besar dari 0";
      } else if (numericAmount > 999999999999) {
        newErrors.amount = "Nominal terlalu besar (maksimal 999,999,999,999)";
      }
    }

    if (!source.trim()) {
      newErrors.source = "Sumber transaksi tidak boleh kosong";
    }

    if (!date) {
      newErrors.date = "Tanggal harus dipilih";
    }

    if(!description.trim()) {
      newErrors.description = "Deskripsi tidak boleh kosong";
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

  const formatNumber = (value: string) => {
    const num = value.replace(/\D/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (!value || /^\d+$/.test(value)) {
      setAmount(value);
      clearError('amount');
    }
  }


  return (
    <>
      <ComponentCard title="Buat Transaksi" className="">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="w-full flex gap-3 justify-between flex-wrap sm:flex-nowrap">
            <div className="w-full">
              <Label htmlFor="wallet">Wallet</Label>
              <Select
                options={
                  wallets.length > 0
                    ? wallets
                    : [{ value: "", label: "Tidak ada wallet, tambahkan wallet terlebih dahulu" }]
                }
                placeholder="Pilih wallet"
                onChange={(val) => handleWalletChange(val)}
              />
              {errors.selectedWallet && (
                <p className="text-red-500 text-sm mt-1">{errors.selectedWallet}</p>
              )}
            </div>

            <div className="w-full">
              <Label htmlFor="category">Kategori</Label>
              <Select
                options={
                  categories.length > 0
                    ? categories
                    : [{ value: "", label: "Tidak ada kategori dalam wallet yang anda pilih, tambahkan kategori terlebih dahulu" }]
                }
                placeholder="Pilih kategori"
                onChange={(val) => {
                  setSelectedCategory(val);
                  clearError('selectedCategory');
                }}
              />
              {errors.selectedCategory && (
                <p className="text-red-500 text-sm mt-1">{errors.selectedCategory}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="source">Sumber</Label>
            <Input
              id="source"
              name="source"
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

          <div className="w-full flex gap-3 justify-between flex-wrap sm:flex-nowrap">
            <div className="w-full">
              <Label htmlFor="amount">Nominal</Label>
              <Input
                id="amount"
                name="amount"
                type="text"
                value={formatNumber(amount)}
                placeholder="Masukkan jumlah nominal"
                onChange={handleAmountChange}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {amount ? `Jumlah: Rp ${formatNumber(amount)}` : "Masukan angka nominal tanpa titik atau koma"}
              </p>
            </div>

            <div className="w-full">
              <DatePicker
                id="date"
                label="Tanggal"
                placeholder="Pilih tanggal"
                onChange={(dateStr: string) => {
                  setDate(dateStr);
                  clearError('date');
                }}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Deskripsi</Label>
            <TextArea
              value={description}
              placeholder="Masukkan deskripsi"
              onChange={setDescription}
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          
          <div className="mb-4 flex justify-end">
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/transaction-income")}
                type="button"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
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
                {isSubmitting ? 'Menambahkan...' : 'Tambah'}
              </button>
            </div>
          </div>
        </form>
      </ComponentCard >
    </>
  );
};