import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getModulesById, getAllModules, addModules, updateModules, deleteModules} from "./moduleApi.ts";
import {useNavigate} from "react-router";
import {getItem} from "../../utils/utils.ts";

export const useGetModules = (courseId: string | undefined) =>
    useQuery({
        queryKey: ["modules", courseId],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            if (!courseId) throw new Error("No courseId");

            return await getAllModules(courseId);
        },
        retry: false,
        enabled: !!courseId,
    });

export const useGetModuleById = (id: string | undefined) =>
    useQuery({
        queryKey: ["module", id],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getModulesById(id);
        },
        enabled: !!id,
        retry: false,
    });

export const useAddModule = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addModules,
        onSuccess: async (id) => {
            const data = await getAllModules(id);
            qc.setQueryData(["modules"], data);
            navigate("/modules", {state: {courseId: id}});
        },
        onError: (error) => {
            alert(error);
        },
    });
};

export const useUpdateModule = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateModules,
        onSuccess: async (id) => {
            const data = await getAllModules(id);
            qc.setQueryData(["modules"], data);
            navigate("/modules", {state: {courseId: id}});
        },
        onError: (error) => {
            alert(error);
        },
    });
};

export const useDeleteModule = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteModules,
        onSuccess: async () => {
            qc.invalidateQueries({
                queryKey: ["modules"], // yoki ["modules", courseId]
            });
        },
        onError: (error) => {
            alert(error);
        },
    });
};

