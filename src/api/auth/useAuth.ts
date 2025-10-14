// src/hooks/useAuth.ts
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getCurrentUser, login, logout, register} from "./authApi.ts";

export const useUser = () =>
    useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        retry: false,
    });

export const useLogin = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: login,
        onSuccess: (user) => {
            qc.setQueryData(["currentUser"], user);
        },
    });
};

export const useRegister = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: register,
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["currentUser"]});
        },
    });
};

export const useLogout = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            qc.removeQueries({queryKey: ["currentUser"]});
        },
    });
};