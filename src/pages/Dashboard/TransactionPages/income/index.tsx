import { Link } from "react-router";
import Input from "../../../../components/form/input/InputField";

export default function TransactionIncomePage() {
    return (
        <div className="flex flex-col justify-start w-full h-screen">
            <h1 className="text-2xl font-bold">Transaction Income</h1>

            <div className="flex justify-between">
                <Input
                    id="search"
                    type="text"
                    name="search"
                    placeholder="Search by name..."
                    value=""
                    onChange={() => {}}
                    className="w-1/2 mt-4"
                    success={false}
                    error={false}
                    disabled={false}
                    step={1}
                ></Input>
                <div className="flex gap-2">
                    <Link to="/transaction-income/create" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Create New Transaction
                    </Link>
                    <Link to="/transaction-income/edit/1" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        Edit Transaction
                    </Link>
                </div>
            </div>
        </div>
    );
};