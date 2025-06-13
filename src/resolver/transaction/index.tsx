import axiosRequest from "../../utils/request";


export const getAllTransactions = async (walletId: number): Promise<any> => {
    try {
        const response = await axiosRequest.get("/api/wallets/transactions", {
            params: { walletId },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTransactionById = async (id: number, walletId: number): Promise<any> => {
    try {
        const response = await axiosRequest.delete(`/api/wallets/transactions/${id}`, {
            params: { walletId },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};