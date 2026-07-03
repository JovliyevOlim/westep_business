import apiClient from "../apiClient.ts";
import {AxiosError} from "axios";
import type {
    VideoPlaybackResponse,
    VideoResponse,
    VideoUploadConfirmResponse,
    VideoUploadInitRequest,
    VideoUploadInitResponse,
} from "../../types/types.ts";
import {parseApiError} from "../../utils/apiError.ts";

export const getVideoByLessonId = async (lessonId: string | undefined) => {
    try {
        const {data} = await apiClient.get("/videos/lesson/" + lessonId);
        return data as VideoResponse[];
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const getVideoInfoByUrl = async (videolink: string | undefined) => {
    try {
        const {data} = await apiClient.get("/videos/youtube/info", {
            params: {
                youtubeUrl: videolink,
            }
        });
        return data;
    } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const message = err.response?.data?.message;
        throw new Error(message);
    }
};

export const initVideoUpload = async (body: VideoUploadInitRequest) => {
    try {
        const {data} = await apiClient.post("/videos/upload/init", body);
        return data as VideoUploadInitResponse;
    } catch (error) {
        throw parseApiError(error, "Video yuklash uchun URL olinmadi.");
    }
};

export const confirmVideoUpload = async (videoId: string) => {
    try {
        const {data} = await apiClient.post(`/videos/upload/${videoId}/confirm`);
        return data as VideoUploadConfirmResponse;
    } catch (error) {
        throw parseApiError(error, "Video yuklash tasdiqlanmadi.");
    }
};

export const getVideoById = async (id: string) => {
    try {
        const {data} = await apiClient.get(`/videos/${id}`);
        return data as VideoResponse;
    } catch (error) {
        throw parseApiError(error, "Video ma'lumotlari yuklanmadi.");
    }
};

export const getVideoPlaybackUrl = async (id: string) => {
    try {
        const {data} = await apiClient.get(`/videos/${id}/playback-url`);
        return data as VideoPlaybackResponse;
    } catch (error) {
        throw parseApiError(error, "Video playback URL olinmadi.");
    }
};

export const deleteVideo = async (id: string) => {
    try {
        await apiClient.delete(`/videos/${id}`);
    } catch (error) {
        throw parseApiError(error, "Videoni o'chirib bo'lmadi.");
    }
};

export const attachYoutubeToVideo = async (videoId: string, youtubeUrl: string) => {
    try {
        const {data} = await apiClient.put(`/videos/${videoId}/youtube`, {youtubeUrl});
        return data;
    } catch (error) {
        throw parseApiError(error, "YouTube linkini biriktirib bo'lmadi.");
    }
};

export type UploadProgressHandler = (info: {loaded: number; total: number; percent: number}) => void;

export const uploadFileToMinio = ({
    uploadUrl,
    file,
    contentType,
    onProgress,
    signal,
}: {
    uploadUrl: string;
    file: File | Blob;
    contentType: string;
    onProgress?: UploadProgressHandler;
    signal?: AbortSignal;
}) =>
    new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", contentType);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                onProgress({
                    loaded: event.loaded,
                    total: event.total,
                    percent: Math.round((event.loaded / event.total) * 100),
                });
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
            } else {
                reject(new Error(`MinIO yuklash xatosi (HTTP ${xhr.status})`));
            }
        };

        xhr.onerror = () => reject(new Error("MinIO bilan ulanish uzilib qoldi"));
        xhr.onabort = () => reject(new Error("Video yuklash bekor qilindi"));

        if (signal) {
            if (signal.aborted) {
                xhr.abort();
                return;
            }
            signal.addEventListener("abort", () => xhr.abort());
        }

        xhr.send(file);
    });
