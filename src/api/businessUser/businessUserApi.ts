import apiClient from "../apiClient.ts";
import {AxiosError} from "axios";
import {Course} from "../../types/types.ts";

type addCourse = Pick<Course, "name" | "description" | "businessId" | "id" | "attachmentId">

export const addBusinessTeacher = async (body: Omit<addCourse, "id">) => {
    try {
        await apiClient.post("/business/assistant/add", body);
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const addBusinessAssistant = async (body: Omit<addCourse, "id">) => {
    try {
        await apiClient.post("/business/teacher/add", body);
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};


export const deleteBusinessAssistant = async (id: string) => {
    try {
        await apiClient.delete("/business/assistant/remove" + id);
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};


export const getUsersById = async (id: string | undefined) => {
    const {data} = await apiClient.get("/business/members/" + id);
    return data;
};
