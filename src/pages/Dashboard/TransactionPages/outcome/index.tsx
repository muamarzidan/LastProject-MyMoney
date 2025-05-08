import { Link } from "react-router";

import Input from "../../../../components/form/input/InputField";
import BasicTableOne from "../../../../components/tables/BasicTables/BasicTableOne";


export default function TransactionOutcomePage() {
    return (
        <div className="flex flex-col justify-start w-full h-screen gap-6">
            <div id="header-transaction-income" className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold">Transaction Outcome</h1>
                <div className="flex justify-between">
                    <Input
                        id="search"
                        type="text"
                        name="search"
                        placeholder="Search by name..."
                        value=""
                        onChange={() => {}}
                        className="w-1/2"
                        success={false}
                        error={false}
                        disabled={false}
                        step={1}
                    ></Input>
                    <Link to="/transaction-outcome/create" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800">
                        Tambah Transaksi
                    </Link>
                </div>
            </div>

            <BasicTableOne />
        </div>
    );
};