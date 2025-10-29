import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getLessonsById, getAllLessons, addLessons, updateLessons, deleteLessons} from "./lessonApi.ts";
import {useNavigate} from "react-router";
import {getItem} from "../../utils/utils.ts";

export const useGetLessons = (moduleId: string | undefined) =>
    useQuery({
        queryKey: ["lessons", moduleId],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            if (!moduleId) throw new Error("No courseId");

            return await getAllLessons(moduleId);
        },
        retry: false,
        enabled: !!moduleId,
    });

export const useGetLessonById = (id: string | undefined) =>
    useQuery({
        queryKey: ["lesson", id],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getLessonsById(id);
        },
        enabled: !!id,
        retry: false,
    });

export const useAddLesson = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addLessons,
        onSuccess: async ({moduleId, courseId}) => {
            const data = await getAllLessons(moduleId);
            qc.setQueryData(["lessons"], data);
            navigate("/lessons", {state: {courseId: courseId, moduleId: moduleId}});
        },
        onError: (error) => {
            alert(error);
        },
    });
};

export const useUpdateLesson = () => {
    const navigate = useNavigate();
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateLessons,
        onSuccess: async ({moduleId, courseId}) => {
            const data = await getAllLessons(moduleId);
            qc.setQueryData(["lessons"], data);
            navigate("/lessons", {state: {courseId: courseId, moduleId: moduleId}});
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
                queryKey: ["lessons"]
            });
        },
        onError: (error) => {
            alert(error);
        },
    });
};

