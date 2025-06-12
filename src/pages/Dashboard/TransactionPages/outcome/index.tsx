import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getAllIncome } from "../../../../resolver/transaction/income";
import { getWallet } from "../../../../resolver/wallet/index";
import { deleteTransactionById } from "../../../../resolver/transaction/index";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import ReusableTable, {
    TableColumn,
} from "../../../../components/tables/ReusableTable";
import { getAllExpense } from "../../../../resolver/transaction/expanse";
import { getAllCategory } from "../../../../resolver/category/index";

// const columns: TableColumn[] = [
//     {key: "destination", header: "Destinasi"},
//     {
//         key: "category", 
//         header: "Kategori",
//         render: (row) => categoryMap.get(row.category) || row.category,
//     },
//     {
//         key: "amount", 
//         header: "Jumlah", 
//         render: (row) => `Rp ${row.amount.toLocaleString("id-ID")}`,
//     },
//     {
//         key: "date",
//         header: "Tanggal",
//         render: (row) => new Date(row.date).toLocaleDateString("id-ID"),
//     },
// ];
const columns: TableColumn[] = [
    { key: "destination", header: "Destinasi" },
    { key: "category", header: "Kategori" },
    {
        key: "amount",
        header: "Jumlah",
        render: (row) => `Rp ${row.amount.toLocaleString("id-ID")}`,
    },
    {
        key: "date",
        header: "Tanggal",
        render: (row) => new Date(row.date).toLocaleDateString("id-ID"),
    },
];

export default function TransactionOutcomePage() {
    const [search, setSearch] = useState("");
    const [data, setData] = useState<any[]>([]);
    const [walletList, setWalletList] = useState<any[]>([]);
    const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);

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
        if (selectedWalletId) fetchTransactionIncome(selectedWalletId);
    }, [selectedWalletId]);

    const fetchTransactionIncome = async (walletId: number) => {
        try {
            const res = await getAllExpense(walletId);
            setData(res.data);
        } catch (error) {
            console.error("Failed to fetch transaction income", error);
        }
    };

    

    

    const [debouncedSearch, setDebouncedSearch] = useState(search);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);
    return (
        <div className="flex flex-col justify-start w-full h-screen gap-6">
            <div id="header-transaction-outcome" className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold">Transaction Outcome</h1>
                <div className="flex justify-between">
                    <div className="flex w-fit gap-4">
                        <Select 
                            className="w-fit" 
                            options={walletList.map((w) => ({
                                value: w.id.toString(),
                                label: w.name,
                            }))}
                            placeholder="---- Pilih Wallet ----"
                            value={selectedWalletId?.toString() ?? ""}
                            onChange={(val) => setSelectedWalletId(Number(val))} 
                        />
                        <Input
                            id="search"
                            type="text"
                            name="search"
                            placeholder="Cari berdasarkan destinasi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-1/2"
                        />
                    </div>
                    <Link to="/transaction-outcome/create">
                            <button className="bg-blue-600 text-white rounded-lg hover:bg-blue-800 h-auto py-2 px-4 transition-all duration-200">
                                Tambah Transaksi
                            </button>
                    </Link>
                </div>
            </div>
            
            <ReusableTable
                data={data.filter((d) => 
                    d?.destination?.toLowerCase().includes(debouncedSearch.toLowerCase())
                )}
                columns={columns}
                showActions
                onDelete={async (row) => {
                    const confirmDelete = confirm(`Hapus transaksi outcome "${row.destination}"?`);
                    if (confirmDelete) {
                        try {
                            await deleteTransactionById(row.id, row.wallet.id);
                            setData((prev) => prev.filter((item) => item.id !== row.id));
                            alert("Transaksi berhasil dihapus");
                        } catch (err) {
                            console.error("Gagal menghapus transaksi:", err);
                            alert("Gagal menghapus transaksi");
                        }
                    }
                }}
            />
            
        </div>
    );
};

// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import Input from "../../../../components/form/input/InputField";
// import ReusableTable, { TableColumn } from "../../../../components/tables/ReusableTable";


// const columns: TableColumn[] = [
//     {
//         key: "name",
//         header: "Nama Transaksi",
//     },
//     {
//         key: "status",
//         header: "Status",
//         render: (row) => (
//             <span
//                 className={`px-2 py-1 text-xs rounded-full ${row.status === "Active"
//                         ? "bg-green-200 text-green-800"
//                         : "bg-yellow-200 text-yellow-800"
//                     }`}
//             >
//                 {row.status}
//             </span>
//         ),
//     },
//     {
//         key: "amount",
//         header: "Jumlah",
//         render: (row) => `Rp ${row.amount.toLocaleString("id-ID")}`,
//     },
//     {
//         key: "date",
//         header: "Tanggal",
//         render: (row) => new Date(row.date).toLocaleDateString("id-ID"),
//     }
// ];


// export default function TransactionOutcomePage() {
//     const navigate = useNavigate();
//     const [search, setSearch] = useState("");
//     const [data, setData] = useState<any[]>([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             const res = [
//                 { id: 1, name: "Gaji", status: "Active", date: "2023-10-01", amount: 5000000 },
//                 { id: 2, name: "Bonus", status: "Pending", date: "2023-10-01", amount: 1500000 },
//             ];
//             setData(res);
//         };

//         fetchData();
//     }, []);


//     return (
//         <div className="flex flex-col justify-start w-full h-screen gap-6">
//             <div id="header-transaction-income" className="flex flex-col gap-3">
//                 <h1 className="text-2xl font-bold">Transaction Outcome</h1>
//                 <div className="flex justify-between">
//                     <Input
//                         id="search"
//                         type="text"
//                         name="search"
//                         placeholder="Cari berdasarkan tipe..."
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         className="w-1/2"
//                         success={false}
//                         error={false}
//                         disabled={false}
//                         step={1}
//                     ></Input>

//                     <Link to="/transaction-income/create">
//                         <button className="bg-green-600 text-white rounded-lg hover:bg-green-800 h-auto py-2 px-4 transition-all duration-200">
//                             Tambah Transaksi
//                         </button>
//                     </Link>
//                 </div>
//             </div>

//             <ReusableTable
//                 data={data}
//                 columns={columns}
//                 showActions
//                 onEdit={(row) => navigate(`/transaction-outcome/edit/${row.id}`)}
//                 onDelete={(row) => {
//                     if (confirm(`Yakin hapus "${row.name}"?`)) {
//                         setData((prev) => prev.filter((item) => item.id !== row.id));
//                     }
//                 }}
//             />
//         </div>
//     );
// };