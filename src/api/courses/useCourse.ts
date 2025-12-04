import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getAllCourses, addCourses, updateCourse, deleteCourse, getCourseById} from "./courseApi.ts";
import {useNavigate} from "react-router";
import {getItem} from "../../utils/utils.ts";

export const useGetCourses = () =>
    useQuery({
        queryKey: ["courses"],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getAllCourses();
        },
        retry: false,
    });

export const useGetCourseById = (id: string | undefined) =>
    useQuery({
        queryKey: ["role", id],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getCourseById(id);
        },
        enabled: !!id,
        retry: false,
    });

export const useAddCourse = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addCourses,
        onSuccess: async () => {
            const roles = await getAllCourses();
            qc.setQueryData(["courses"], roles);
            navigate(0);
        },
        onError: (error) => {
            alert(error);
        },
    });
};

export const useUpdateCourse = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateCourse,
        onSuccess: async () => {
            const roles = await getAllCourses();
            qc.setQueryData(["courses"], roles);
            navigate("/");
        },
        onError: (error) => {
            alert(error);
        },
    });
};

export const useDeleteCourse = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteCourse,
        onSuccess: async () => {
            const roles = await getAllCourses();
            qc.setQueryData(["courses"], roles);
            navigate("/");
        },
        onError: (error) => {
            alert(error);
        },
    });
};

