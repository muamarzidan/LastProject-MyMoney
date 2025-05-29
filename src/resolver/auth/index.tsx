import axiosRequest from "../../utils/request";


interface LoginPayload {
    username: string;
    password: string;
}

interface RegisterPayload {
    name: string;
    username: string;
    password: string;
}

/**
 * Login user
 * @param username Username pengguna
 * @param password Password pengguna
 * @returns Access token jika berhasil
 */

export const login = async (username: string, password: string): Promise<string> => {
    const payload: LoginPayload = { username, password };
    try {
        const response = await axiosRequest.post("/api/auth/login", payload);
        const accessToken = response.data;
        
        if (response.status === 200 && accessToken) {
            localStorage.setItem("app-token", accessToken);
            return accessToken;
        } else {
            throw new Error("Login failed");
        }
    } catch (error) {
        throw error;
    }
};

export const register = async (name: string, username: string, password: string): Promise<string> => {
    const payload: RegisterPayload = { name, username, password };
    try {
        const response = await axiosRequest.post("/api/auth/register", payload);
        const accessToken = response.data;
        
        if (response.status === 200 && accessToken) {
            localStorage.setItem("app-token", accessToken);
            return accessToken;
        } else {
            throw new Error("Registration failed");
        }
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    const accessToken = localStorage.getItem("app-token");
    if (!accessToken) {
        return;
    }

    try {
        await axiosRequest.post("/api/auth/logout", {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } catch (error) {
        console.error("Logout error:", error);
    }
};

export const resetPasswordSendOTP = async (username: string) => {
    try {
        const response = await axiosRequest.post("/api/auth/reset-password/send-otp", { username });
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to send OTP");
        }
    } catch (error) {
        throw error;
    }
};

export const resetPasswordVerifyOTP = async (username: string, otp: string) => {
    try {
        const response = await axiosRequest.post("/api/auth/reset-password/verify-otp", { username, otp });
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
    return localStorage.getItem("app-token");
};

export const isAuthenticated = () => {
    return !!getToken();
};