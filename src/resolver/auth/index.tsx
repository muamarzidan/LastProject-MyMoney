import axiosRequest from "../../utils/request";


interface LoginPayload {
    username: string;
    password: string;
}

interface LoginResponse {
    status: number;
    data: {
        accessToken: string;
    };
}

export const login = async (username: string, password: string): Promise<string> => {
    const payload: LoginPayload = { username, password };
    try {
        const response: LoginResponse = await axiosRequest.post("auth/login", payload);
        if (response.status === 200 && response.data) {
            const { accessToken } = response.data;
            localStorage.setItem("userAppToken", accessToken);
            return accessToken;
        } else {
            throw new Error("Login failed");
        }
    } catch (error) {    
        throw error;
    }
};

export const logout = async () => {
    const accessToken = localStorage.getItem("userAppToken");
    if (!accessToken) {
        return;
    }

    try {
        await axiosRequest.post("auth/logout", {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        localStorage.removeItem("userAppToken");
    } catch (error) {
        throw error;
    }
};

export const resetPasswordSendOTP = async (email: string) => {
    try {
        const response = await axiosRequest.post("auth/reset-password/send-otp", { email });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to send OTP");
        }
    } catch (error) {
        throw error;
    }
};

export const resetPasswordVerifyOTP = async (email: string, otp: string) => {
    try {
        const response = await axiosRequest.post("auth/reset-password/verify-otp", { email, otp });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to verify OTP");
        }
    } catch (error) {
        throw error;
    }
};

export const getToken = () => {
    return localStorage.getItem("userAppToken");
};

export const isAuthenticated = () => {
    return !!getToken();
};