import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const useRequireState = (key: string, redirectTo: string = "/login") => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const hasState = location.state && Object.prototype.hasOwnProperty.call(location.state, key);
        if (!hasState || !location.state[key]) {
            navigate(redirectTo);
        }
    }, [location.state, key, redirectTo, navigate]);
};