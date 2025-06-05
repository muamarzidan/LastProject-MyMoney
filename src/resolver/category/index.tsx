import axiosRequest from "../../utils/request";


export const getAllCategory = async (walletId: number): Promise<any> => {
    try {
        const response = await axiosRequest.get("/api/wallets/categories", {
            params: { walletId }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCategoryById = async (
    categoryId: number,
    walletId: number
): Promise<any> => {
    try {
        console.log("Fetching category with ID:", categoryId, "for wallet ID:", walletId);
        const response = await axiosRequest.get(`/api/wallets/categories/${categoryId}`, {
            params: { walletId },
        });
        console.log("Category fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createCategory = async (name: string, walletId: number): Promise<any> => {
    try {
        const payload = {
            name,
            wallet: { id: walletId }
        };
        const response = await axiosRequest.post("/api/wallets/categories", payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCategory = async (id: number, name: string, walletId: number): Promise<any> => {
    try {
        const payload = {
            name,
            wallet: { id: walletId }
        };
        const response = await axiosRequest.put(`/api/wallets/categories/${id}`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCategory = async (id: number, walletId: number): Promise<any> => {
    try {
        const response = await axiosRequest.delete(`/api/wallets/categories/${id}`, {
            params: { walletId }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};