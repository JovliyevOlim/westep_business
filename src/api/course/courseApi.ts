// src/api/courseApi.ts
import apiClient from "../apiClient";
import {getItem, setItem} from "../../utils/utils.ts";
import {AxiosError} from "axios";
import {BusinessType} from "../../types/types.ts";


export const addCourse = async (body: { phone: string; password: string }) => {
    try {
        const {data} = await apiClient.post("/auth/login", {}, {
            params: {
                phone: body.phone,
                password: body.password,
            }
        });
        setItem<string>("accessToken", data?.accessToken)
        setItem<string>("refreshToken", data?.refreshToken)
    } catch (error) {
        console.log(error);
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const updateCourse = async (body: BusinessType) => {
    try {
        const {data} = await apiClient.post("/auth/business/register", body);
        setItem<string>("accessToken", data.accessToken)
        setItem<string>("refreshToken", data.refreshToken)
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const getAllCourses = async () => {
    try {
        const {data} = await apiClient.get("/course/get",);
        return data;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const getCourse = async (body: { phone: string }) => {
    const {data} = await apiClient.post("/auth/check-phone", {phone: body.phone});
    if (data.status === "NOT_FOUND") {
        throw new Error(data.message);
    }
};

export const deleteCourse = async () => {
    const refreshToken: string | null = getItem("refreshToken");
    await apiClient.post("/auth/logout", refreshToken);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};