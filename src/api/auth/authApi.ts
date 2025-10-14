// src/api/authApi.ts
import apiClient from "../apiClient";

const user: any = {
    name: "olim"

}

export const login = async (body: { name: string; password: string }) => {
    const {data} = await apiClient.post("/auth/login", body);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return user;
};

export const register = async (body: { name: string; email: string; password: string }) => {
    const {data} = await apiClient.post("/auth/register", body);
    return data;
};

export const getCurrentUser = async () => {
    // const {data} = await apiClient.get("/auth/me");
    return user;
};

export const logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};