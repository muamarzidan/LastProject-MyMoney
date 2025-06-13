import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllCategory } from "../../../../resolver/category/index";
import { getWallet} from "../../../../resolver/wallet/index"; 
import { createExpense } from "../../../../resolver/transaction/expanse";
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
  destination?: string;
  date?: string;
  description?: string;
}

export default function CreateTransactionOutcomePage () {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [selectedWallet, setSelectedWallet] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const walletRes = await getWallet();
        const walletOptions = walletRes.data.map((w: any) => ({
          id: w.id,
          name: w.name,
          value: w.id,
          label: w.name,
          myMoney: w.myMoney,
        }));
        setWallets(walletOptions);
      } catch (error) {
        console.error("Gagal mengambil wallet: ", error);
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
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
      setCategories([]);
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const newErr: ValidationErrors = {};

    if (!selectedWallet) {
      newErr.selectedWallet = "Wallet harus dipilih dahulu";
    }

    if (!selectedCategory) {
      newErr.selectedCategory = "Kategori harus dipilih";
    }

    if (!amount.trim()) {
      newErr.amount = "Nominal harus berupa angka";
    } else {
      const numericAmount = parseInt(amount.replace(/,/g, ""));
      if (isNaN(numericAmount)) {
        newErr.amount = "Nominal harus diisi dengan angka";
      } else if (numericAmount < 0) {
        newErr.amount = "Nominal harus lebih dari 0";
      } else if (numericAmount > 999999999) {
        newErr.amount = "Nomimal tidak boleh dari 999,999,999";
      }

      const selectedWalletData = wallets.find(w => w.id === Number(selectedWallet));
      const MyMoney = selectedWalletData?.myMoney;

      if (MyMoney === undefined || MyMoney === null) {
        newErr.amount = "Saldo kamu saat ini tidak mencukupi"
      } else if (numericAmount > MyMoney) {
        newErr.amount = `Nominal melebihi saldo kamu saat ini (Saldo: Rp ${MyMoney.toLocaleString("id-ID")})`;
      }
    }

    if (!destination.trim()) {
      newErr.destination = "Destinasi transaksi tidak boleh kosong";
    }

    if (!date) {
      newErr.date = "Tanggal harus dipilih";
    }

    if (!description.trim()) {
      newErr.description = "Deskripsi tidak boleh kosong";
    }

    setErrors(newErr);
    return Object.keys(newErr).length === 0; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCategoryData = categories.find(c => c.value === selectedCategory);
      
      const payload = {
        wallet: {id: Number(selectedWallet)},
        category: selectedCategoryData?.label || selectedCategory,
        amount: parseInt(amount.replace(/,/g, "")),
        description,
        destination,
        date,
      };
      await createExpense(payload);
      navigate("/transaction-outcome");
    } catch (err) {
      console.error("Gagal menambahkan outcome", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = (field: keyof ValidationErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined}));
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
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              name="destination"
              type="text"
              value={destination}
              placeholder="Masukkan Destinasi Transaksi"
              onChange={(e) => {
                setDestination(e.target.value);
                clearError('destination');
              }}
            />
            {errors.destination && (
              <p className="text-red-500 text-sm mt-1">{errors.destination}</p>
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
                onChange={(_, currentDateString) => {
                  setDate(currentDateString);
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
                onClick={() => navigate("/transaction-outcome")}
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