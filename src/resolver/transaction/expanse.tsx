import axiosRequest from "../../utils/request";


export const getAllExpense = async (walletId: number): Promise<any> => {
    try {
        const response = await axiosRequest.get("/api/wallets/transactions/expense", {
            params: { walletId },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createExpense = async (expense: {
    wallet: { id: number },
    amount: number,
    description?: string,
    category?: string,
    date?: string,
}): Promise<any> => {
    try {
        const response = await axiosRequest.post("/api/wallets/transactions/expense", expense);
        return response.data;
    } catch (error) {
        throw error;
    }
};