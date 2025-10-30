import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {checkPhoneNumber, getCurrentUser, login, logout, register} from "./authApi.ts";
import {useNavigate} from "react-router";
import {getItem} from "../../utils/utils.ts";
import {useToast} from "../../hooks/useToast.tsx";

export const useUser = () =>
    useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getCurrentUser();
        },
        retry: false,
        staleTime: 1000 * 60 * 10,          // 10 daqiqa davomida so‘rov yubormaydi
        refetchOnWindowFocus: false,        // sahifa qayta focus bo‘lsa so‘rov yubormaydi
        refetchOnMount: false,              // component qayta mount bo‘lsa so‘rov yubormaydi
        refetchOnReconnect: false,
    });

export const useLogin = () => {
    const navigate = useNavigate();
    const toast = useToast();
    return useMutation({
        mutationFn: login,
        onSuccess: async () => {
            navigate("/")
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
};

export const useRegister = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: register,
        onSuccess: () => {
            navigate("/login");
        },
        onError: (error) => {
            alert(error.message);
        }
    });
};


export const useCheckPhoneNumber = () => {
        const navigate = useNavigate();
        const toast = useToast();
        return useMutation({
            mutationFn: checkPhoneNumber,
            onSuccess: (_, body: { phone: string }) => {
                navigate("/password", {state: {phone: body.phone}});
            },
            onError: (_, body: { phone: string }) => {
                navigate("/register", {state: {phone: body.phone}});
                toast.warning("Ro'yxatdan o'ting!", "Siz saytda yo'qsiz");
            },
        });
    }
;


export const useLogout = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            qc.removeQueries({queryKey: ["currentUser"]});
        },
    });
};

