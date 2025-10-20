import React from 'react';
import {Navigate} from 'react-router-dom';
import {useUser} from "../api/auth/useAuth.ts";
import Preloader from "../ui/common/Preloader.tsx";

const AuthProtected = ({children}: { children: React.ReactNode }) => {
    const { data: user, isLoading, isError } = useUser();

    if (isLoading) return <Preloader/>;

    if (isError || !user) return <Navigate to="/login" replace />;

    return <>{children}</>;
};


export default AuthProtected;

