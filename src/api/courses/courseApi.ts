import apiClient from "../apiClient.ts";
import {AxiosError} from "axios";
import {Course} from "../../types/types.ts";


export const addCourses = async (body: Pick<Course, "name" | "description" | "businessId">) => {
    try {
        await apiClient.post("/course", body);
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const updateCourse = async (body: Pick<Course, "name" | "description" | "businessId" | "id">) => {
    try {
        await apiClient.put("/course/" + body.id, body);
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const deleteCourse = async (id: string) => {
    try {
        await apiClient.delete("/course/" + id);
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};


export const getAllCourses = async () => {
    try {
        const {data} = await apiClient.get("/course/get");
        return data;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const getCourseById = async (id: string | undefined) => {
    const {data} = await apiClient.get("/course/" + id);
    return data;
};
