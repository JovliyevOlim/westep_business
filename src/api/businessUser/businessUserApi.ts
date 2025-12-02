import apiClient from "../apiClient.ts";
import {AxiosError} from "axios";

interface Data {
    businessId: string,
    ownerId: string,
    teacherPhone: string
    assistantPhone: string
}

export const addBusinessTeacher = async (body: Omit<Data, "assistantPhone">) => {
    try {
        await apiClient.post("/business/teacher/add/" + body.businessId, {}, {
            params: {
                ownerId: body.ownerId,
                teacherPhone: body.teacherPhone,
            }
        });
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const addBusinessAssistant = async (body: Omit<Data, "teacherPhone">) => {
    try {
        await apiClient.post("/business/assistant/add/" + body.businessId, {}, {
            params: {
                ownerId: body.ownerId,
                assistantPhone: body.assistantPhone
            }
        });
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
