import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/Auth";


export default function PrivateRoute({ children }: { children: ReactNode }) {
    const { isAuth } = useAuth();

    return isAuth ? children : <Navigate to="/" replace />;
};