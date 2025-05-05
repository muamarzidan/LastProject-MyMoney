import { ReactNode, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getToken } from "../resolver/auth/index.tsx";


const AuthContext = createContext({
    isAuth: false,
    loginSuccess: () => {},
    logoutSuccess: () => {},
    handleUnauthorized: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuth, setIsAuth] = useState(!!getToken());
    const navigate = useNavigate();

    const loginSuccess = () => setIsAuth(true);
    const logoutSuccess = () => {
        setIsAuth(false);
        localStorage.removeItem("userAppToken");
    };

    const handleUnauthorized = () => {
        logoutSuccess();
        navigate("/", { replace: true });
    };

    return (
        <AuthContext.Provider value={{ isAuth, loginSuccess, logoutSuccess, handleUnauthorized }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);