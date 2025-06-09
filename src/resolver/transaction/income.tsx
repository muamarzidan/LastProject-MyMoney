import axiosRequest from "../../utils/request";


export const getAllIncome = async (walletId: number): Promise<any> => {
    try {
        const response = await axiosRequest.get("/api/wallets/transactions/income", {
            params: { walletId },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createIncome = async (income: {
    wallet: { id: number },
    category: string,
    amount: number,
    description: string,
    source: string,
    date: string,
}): Promise<any> => {
    try {
        const response = await axiosRequest.post("/api/wallets/transactions/income", income);
        return response.data;
    } catch (error) {
        throw error;
    }
};