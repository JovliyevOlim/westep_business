import apiClient from "../apiClient.ts";
import {AxiosError} from "axios";

export const getVideoByLessonId = async (lessonId: string | undefined) => {
    try {
        const {data} = await apiClient.get("/videos/lesson/" + lessonId);
        return data;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};