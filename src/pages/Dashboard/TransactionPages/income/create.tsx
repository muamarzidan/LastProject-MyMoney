export default function CreateTransactionIncomePage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Create Transaction Income Page</h1>
    </div>
  );
};

// import { useState } from "react";

// import ComponentCard from "../../../../components/common/ComponentCard";
// import DatePicker from "../../../../components/form/date-picker";
// import Input from "../../../../components/form/input/InputField";
// import TextArea from "../../../../components/form/input/TextArea";
// import Label from "../../../../components/form/Label";
// import Select from "../../../../components/form/Select";


// const optionCategory = [
//   { value: "marketing", label: "Marketing" },
//   { value: "template", label: "Template" },
//   { value: "development", label: "Development" },
// ];

// const optionTransaction = [
//   { value: "income", label: "Income" },
//   { value: "outcome", label: "Outcome" },
// ];

// const optionWallet = [
//   { value: "wallet1", label: "Wallet 1" },
//   { value: "wallet2", label: "Wallet 2" },
//   { value: "wallet3", label: "Wallet 3" },
// ];

// export default function CreateTransactionIncomePage() {
//   const [typeTransaction, setTypeTransaction] = useState("");
//   const [wallet, setWallet] = useState("");
//   const [category, setCcategory] = useState("");
//   const [date, setDate] = useState("");
//   const [amount, setAmount] = useState("");
//   const [description, setDescription] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);

//   const handleSelectChangeCategory = (value: string) => {
//     console.log("Selected value:", value);
//   };
//   const handleSelectChangeTransaction = (value: string) => {
//     console.log("Selected value:", value);
//   };
//   const handleSelectChangeWallet = (value: string) => {
//     console.log("Selected value:", value);
//   };

//   return (
//     <>
//       <ComponentCard title="Buat Transaksi" className="">
//         <form className="flex flex-col gap-4">
//           <div>
//             <Label htmlFor="transactionName">Tipe Transaksi</Label>
//             <Select
//               options={optionTransaction}
//               placeholder="Pilih opsi kategori"
//               onChange={handleSelectChangeTransaction}
//               className="dark:bg-dark-900"
//             />
//           </div>
//           <div>
//             <Label htmlFor="input">Nomimal</Label>
//             <Input
//               id="amount"
//               type="number"
//               placeholder="Masukan jumlah uang"
//             />
//           </div>
//           <div>
//             <Label>Categori</Label>
//             <Select
//               options={optionCategory}
//               placeholder="Pilih opsi kategori"
//               onChange={handleSelectChangeCategory}
//               className="dark:bg-dark-900"
//             />
//           </div>
//           <div>
//             <Label>Wallet</Label>
//             <Select
//               options={optionWallet}
//               placeholder="Pilih opsi kategori"
//               onChange={handleSelectChangeWallet}
//               className="dark:bg-dark-900"
//             />
//           </div>
//           <div>
//             <DatePicker
//               id="date-picker"
//               label="Tanggal"
//               placeholder="Pilih tanggal"
//               onChange={(dates, currentDateString) => {
//                 console.log({ dates, currentDateString });
//               }}
//             />
//           </div>
//           <div>
//             <Label>Description</Label>
//             <TextArea
//               value={description}
//               placeholder="Masukan deskripsi"
//               onChange={(value) => setDescription(value)}
//               rows={6}
//             />
//           </div>

//           <div className="mb-4 flex justify-end">
//             <button
//               type="submit"
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//             >
//               Tambah
//             </button>
//           </div>
//         </form>
//       </ComponentCard >
//     </>
//   );
// };