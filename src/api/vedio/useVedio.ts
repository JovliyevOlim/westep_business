import {useQuery} from "@tanstack/react-query";
import {getVideoByLessonId, getVideoInfoByUrl} from "./vedioApi.ts";
import {getItem} from "../../utils/utils.ts";


export const useGetLessonVideoById = (id: string | undefined) =>
    useQuery({
        queryKey: ["lesson", id],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getVideoByLessonId(id);
        },
        enabled: !!id,
        retry: false,
    });

export const useGetVideoInfoByUrl = (id: string | undefined) =>
    useQuery({
        queryKey: ["lesson", id],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getVideoInfoByUrl(id);
        },
        enabled: !!id,
        retry: false,
    });

