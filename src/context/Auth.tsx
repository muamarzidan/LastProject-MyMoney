import { ReactNode, createContext, useContext, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import { getToken, logout } from "../resolver/auth";
import { checkTokenExpiration } from "../utils/TokenDecode";


interface AuthContextType {
    isAuth: boolean;
    loginSuccess: () => void;
    logoutSuccess: () => void;
    handleUnauthorized: () => void;
};

const AuthContext = createContext<AuthContextType>({
    isAuth: false,
    loginSuccess: () => {},
    logoutSuccess: () => {},
    handleUnauthorized: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(() => {
        const token = getToken();
        if (token) {
            const isExpired = checkTokenExpiration();
            return !isExpired;
        }
        return false;
    });

    useEffect(() => {
        const checkAuth = () => {
            const isExpired = checkTokenExpiration();
            if (isExpired && isAuth) {
                setIsAuth(false);
                navigate("/signin", { replace: true });
            }
        };

        checkAuth();
        
        window.addEventListener('focus', checkAuth);
        
        return () => {
            window.removeEventListener('focus', checkAuth);
        };
    }, [navigate, isAuth]);

    const loginSuccess = () => setIsAuth(true);
    const logoutSuccess = async () => {
        try {
            await logout();
            setIsAuth(false);
            navigate("/signin", { replace: true });
        } catch (error) {
            console.error("Logout error:", error);
            setIsAuth(false);
            navigate("/signin", { replace: true });
        }
    };

    const handleUnauthorized = () => {
        localStorage.removeItem("app-token");
        setIsAuth(false);
        navigate("/signin", { replace: true });
    };

    return (
        <AuthContext.Provider value={{ isAuth, loginSuccess, logoutSuccess, handleUnauthorized }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);