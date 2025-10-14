import React from "react";
import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[]; // Ruxsat etilgan rollar ro'yxati
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                           children,
                                                           allowedRoles,
                                                       }) => {
    const {userPermission} = useSelector((state: any) => state.Login)

    const hasPermission = allowedRoles?.some((role: any) => userPermission?.includes(role));

    return hasPermission ? <>{children}</> : <Navigate to="/dashboard"/>;
};

export default ProtectedRoute;
