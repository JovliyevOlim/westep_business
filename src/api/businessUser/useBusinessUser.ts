import {useQuery, useMutation} from "@tanstack/react-query";
import {addBusinessTeacher, getUsersById, addBusinessAssistant, deleteBusinessAssistant} from "./businessUserApi.ts";
import {useNavigate} from "react-router";
import {getItem} from "../../utils/utils.ts";

export const useGetUsers = (businessId: string) =>
    useQuery({
        queryKey: ["users", businessId],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getUsersById(businessId);
        },
        retry: false,
    })


export const useAddBusinessTeacher = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: addBusinessTeacher,
        onSuccess: async () => {
            navigate("/users");
        },
        onError: (error) => {
            alert(error);
        },
    });
};

export const useAddBusinessAssistant = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: addBusinessAssistant,
        onSuccess: async () => {
            navigate("/users");
        },
        onError: (error) => {
            alert(error);
        },
    });
};

export const useDeleteAssistant = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: deleteBusinessAssistant,
        onSuccess: async () => {
            navigate("/courses");
        },
        onError: (error) => {
            alert(error);
        },
    });
};

