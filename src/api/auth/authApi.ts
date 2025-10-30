// src/api/filesApi.ts
import apiClient from "../apiClient";
import {getItem, setItem} from "../../utils/utils.ts";
import {AxiosError} from "axios";
import {BusinessType} from "../../types/types.ts";


export const login = async (body: { phone: string; password: string }) => {
    try {
        const {data} = await apiClient.post("/auth/login", {}, {
            params: {
                phone: body.phone,
                password: body.password,
            }
        });
        setItem<string>("accessToken", data?.accessToken)
        setItem<string>("refreshToken", data?.refreshToken)
        return data
    } catch (error:any) {
        const message = "Parol notog'ri kiritildi";
        throw new Error(message);
    }
};

export const register = async (body: BusinessType) => {
    try {
        const response = await apiClient.post("/business/register", body);
        return response;
    } catch (error) {
        console.log(error);
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const getCurrentUser = async () => {
    const {data} = await apiClient.get("/user/me");
    return data;
};

export const checkPhoneNumber = async ({phone}: { phone: string }) => {
    const {data} = await apiClient.post("/auth/check-phone", {phone});
    if (data.status === "NOT_FOUND") {
        throw new Error(data.message);
    }
};

export const logout = async () => {
    const refreshToken: string | null = getItem<string>("refreshToken");
    await apiClient.post("/auth/logout", refreshToken, {
        headers: {
            "Content-Type": "text/plain"
        }
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};