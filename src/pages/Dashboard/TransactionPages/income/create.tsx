import Input from "../../../../components/form/input/InputField";
import DatePicker from "../../../../components/form/date-picker";
import Label from "../../../../components/form/Label";
import ComponentCard from "../../../../components/common/ComponentCard";

export default function CreateTransactionIncomePage() {
  return (
    <>
      <ComponentCard title="Create Income Transaction" className="">
        <form className="flex flex-col gap-4">
          <div>
            <Label htmlFor="transactionName">Transaction Name</Label>
            <Input
              id="transactionName"
              type="text"
              placeholder="Enter transaction name"
            />
          </div>

          <div>
            <Label htmlFor="input">Input</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <DatePicker
              id="date-picker"
              label="Date Picker Input"
              placeholder="Select a date"
              onChange={(dates, currentDateString) => {
                // Handle your logic
                console.log({ dates, currentDateString });
              }}
            />
          </div>

          <div className="mb-4 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create Transaction
            </button>
          </div>

        </form>
      </ComponentCard>
    </>
  );
};