import React from 'react';
import {Navigate} from 'react-router-dom';
import {useUser} from "../api/auth/useAuth.ts";

const AuthProtected = ({children}: { children: React.ReactNode }) => {
    const {isLoading} = useUser();
    if (isLoading) {
        return (
            <Navigate to={{pathname: '/login'}}/>
        );
    }

    return <>{children}</>;
};


export default AuthProtected;

