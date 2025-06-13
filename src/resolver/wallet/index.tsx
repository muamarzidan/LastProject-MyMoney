import axiosRequest from "../../utils/request";


export const getWallet = async () : Promise<any> => {
    try {
        const response = await axiosRequest.get("/api/wallets");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getWalletById = async (id: number): Promise<any> => {
    try {
        const response = await axiosRequest.get(`/api/wallets/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createWallet = async (name: string, balance: number): Promise<any> => {
    try {
        const payload = { name, balance };
        const response = await axiosRequest.post("/api/wallets", payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateWallet = async (id: number, name: string, balance: number): Promise<any> => {
    try {
        const payload = { name, balance };
        const response = await axiosRequest.put(`/api/wallets/${id}`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteWallet = async (id: number): Promise<any> => {
    try {
        const response = await axiosRequest.delete(`/api/wallets/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};