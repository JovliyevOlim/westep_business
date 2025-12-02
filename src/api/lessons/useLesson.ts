import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getLessonsById, getAllLessons, addLessons, updateLessons, deleteLessons} from "./lessonApi.ts";
import {getItem} from "../../utils/utils.ts";

export const useGetLessons = (moduleId: string | undefined, openLesson: boolean) =>
    useQuery({
        queryKey: ["courses", moduleId],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            if (!moduleId) throw new Error("No courseId");

            return await getAllLessons(moduleId);
        },
        retry: false,
        enabled: openLesson,
    });

export const useGetLessonById = (id: string | undefined) =>
    useQuery({
        queryKey: ["lesson", id],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getLessonsById(id);
        },
        retry: false,
        enabled: !!id
    });

export const useAddLesson = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addLessons,
        onSuccess: async () => {
            qc.invalidateQueries({
                queryKey: ["courses"]
            });
        },
        onError: (error) => {
            alert(error);
        },
    });
};

export const useUpdateLesson = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateLessons,
        onSuccess: async () => {
            qc.invalidateQueries({
                queryKey: ["courses"]
            });
        },
        onError: (error) => {
            alert(error);
        },
    });
};

export const useDeleteLesson = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteLessons,
        onSuccess: async () => {
            qc.invalidateQueries({
                queryKey: ["courses"]
            });
        },
        onError: (error) => {
            alert(error);
        },
    });
};

