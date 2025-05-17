import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../../../../components/form/input/InputField";
import ReusableTable, { TableColumn } from "../../../../components/tables/ReusableTable";


const columns: TableColumn[] = [
    {
        key: "name",
        header: "Nama Transaksi",
    },
    {
        key: "status",
        header: "Status",
        render: (row) => (
            <span
                className={`px-2 py-1 text-xs rounded ${row.status === "Active"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
            >
                {row.status}
            </span>
        ),
    },
    {
        key: "amount",
        header: "Jumlah",
        render: (row) => `Rp ${row.amount.toLocaleString("id-ID")}`,
    },
    {
        key: "date",
        header: "Tanggal",
        render: (row) => new Date(row.date).toLocaleDateString("id-ID"),
    }
];


export default function TransactionIncomePage() {
    const navigate = useNavigate();
    // const [search, setSearch] = useState("");
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = [
                { id: 1, name: "Gaji", status: "Active", date: "2023-10-01", amount: 5000000 },
                { id: 2, name: "Bonus", status: "Pending", date: "2023-10-01", amount: 1500000 },
            ];
            setData(res);
        };

        fetchData();
    }, []);


    return (
        <div className="flex flex-col justify-start w-full h-screen gap-6">
            <div id="header-transaction-income" className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold">Transaction Income</h1>
                <div className="flex justify-between">
                    <Input
                        id="search"
                        type="text"
                        name="search"
                        placeholder="Search by name..."
                        value=""
                        // onChange={() => { }}
                        className="w-1/2"
                        success={false}
                        error={false}
                        disabled={false}
                        step={1}
                    ></Input>

                    <Link to="/transaction-income/create">
                        <button className="bg-green-600 text-white rounded hover:bg-green-800 h-auto py-2 px-4 transition-all duration-200">
                            Tambah Transaksi
                        </button>
                    </Link>
                </div>
            </div>

            <ReusableTable
                data={data}
                columns={columns}
                showActions
                onEdit={(row) => navigate(`/transaction-income/${row.id}`)}
                onDelete={(row) => {
                    if (confirm(`Yakin hapus "${row.name}"?`)) {
                        setData((prev) => prev.filter((item) => item.id !== row.id));
                    }
                }}
            />
        </div>
    );
};