import axiosRequest from "../../utils/request";

export const getUserData = async (): Promise<any> => {
    try {
        const response = await axiosRequest.get("/api/users/me");
        return response.data;
    } catch (error) {
        throw error;
    }
};