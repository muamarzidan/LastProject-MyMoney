import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Auth";
import { checkTokenExpiration } from "../utils/TokenDecode";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuth, logoutSuccess } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const isTokenExpired = checkTokenExpiration();
        if (isTokenExpired) {
            logoutSuccess();
        }
    }, [logoutSuccess]);

    if (!isAuth) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
