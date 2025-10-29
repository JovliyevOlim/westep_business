import apiClient from "../apiClient.ts";
import {AxiosError} from "axios";
import {Lesson} from "../../types/types.ts";

type addLesson = Pick<Lesson, "name" | "description" | "moduleId" | "id" | "orderIndex" | "estimatedDuration">

type CreateLessonBody = Omit<addLesson, "id">;
export const addLessons = async (payload: { body: CreateLessonBody, courseId?: string }) => {
    try {
        await apiClient.post("/lesson/create", payload.body);
        return {moduleId: payload.body.moduleId, courseId: payload.courseId};
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const updateLessons = async (payload: { body: addLesson, courseId?: string }) => {
    try {
        await apiClient.put("/lesson/update/" + payload.body.id, payload.body);
        return {moduleId: payload.body.moduleId, courseId: payload.courseId};
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const deleteLessons = async (id: string) => {
    try {
        await apiClient.delete("/lesson/" + id);
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};


export const getAllLessons = async (courseId: string | undefined) => {
    try {
        const {data} = await apiClient.get("/lesson/module/" + courseId);
        return data;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const getLessonsById = async (id: string | undefined) => {
    const {data} = await apiClient.get("/lesson/" + id);
    return data;
};
