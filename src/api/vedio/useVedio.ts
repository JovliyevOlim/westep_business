import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    confirmVideoUpload,
    deleteVideo,
    getVideoById,
    getVideoByLessonId,
    getVideoInfoByUrl,
    getVideoPlaybackUrl,
    initVideoUpload,
    attachYoutubeToVideo,
} from "./vedioApi.ts";
import {getItem} from "../../utils/utils.ts";
import {showErrorToast} from "../../utils/toast.tsx";
import type {VideoUploadStatus} from "../../types/types.ts";

const videoKey = ["video"] as const;
const lessonVideosKey = (lessonId: string | undefined) => [...videoKey, "lesson", lessonId] as const;
const videoDetailKey = (id: string | undefined) => [...videoKey, "detail", id] as const;
const videoPlaybackKey = (id: string | undefined) => [...videoKey, "playback", id] as const;

export const useGetLessonVideoById = (id: string | undefined) =>
    useQuery({
        queryKey: lessonVideosKey(id),
        queryFn: async () => {
            const token = getItem<string>("accessToken");
            if (!token) throw new Error("No token");
            return await getVideoByLessonId(id);
        },
        enabled: !!id,
        retry: false,
    });

export const useGetVideoInfoByUrl = (id: string | undefined) =>
    useQuery({
        queryKey: ["video", "youtube-info", id],
        queryFn: async () => {
            const token = getItem<string>("accessToken");
            if (!token) throw new Error("No token");
            return await getVideoInfoByUrl(id);
        },
        enabled: !!id,
        retry: false,
    });

export const useInitVideoUpload = () =>
    useMutation({
        mutationFn: initVideoUpload,
        onError: (error) => {
            showErrorToast(error, "Video yuklash uchun URL olinmadi");
        },
    });

export const useConfirmVideoUpload = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: confirmVideoUpload,
        onSuccess: async (_data, videoId) => {
            await qc.invalidateQueries({queryKey: videoDetailKey(videoId)});
        },
        onError: (error) => {
            showErrorToast(error, "Video yuklash tasdiqlanmadi");
        },
    });
};

const TERMINAL_STATUSES: VideoUploadStatus[] = ["READY", "FAILED"];

export const useVideoById = (id: string | undefined, options?: {pollWhilePending?: boolean}) =>
    useQuery({
        queryKey: videoDetailKey(id),
        queryFn: async () => {
            const token = getItem<string>("accessToken");
            if (!token) throw new Error("No token");
            if (!id) throw new Error("No id");
            return await getVideoById(id);
        },
        enabled: Boolean(id),
        retry: false,
        refetchInterval: (query) => {
            if (!options?.pollWhilePending) return false;
            const status = query.state.data?.uploadStatus;
            if (!status || TERMINAL_STATUSES.includes(status)) return false;
            return 4000;
        },
    });

export const useVideoPlaybackUrl = (id: string | undefined, enabled = true) =>
    useQuery({
        queryKey: videoPlaybackKey(id),
        queryFn: async () => {
            const token = getItem<string>("accessToken");
            if (!token) throw new Error("No token");
            if (!id) throw new Error("No id");
            return await getVideoPlaybackUrl(id);
        },
        enabled: Boolean(id) && enabled,
        retry: false,
        staleTime: 1000 * 60 * 60 * 3,
    });

export const useDeleteVideo = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteVideo,
        onSuccess: async () => {
            await qc.invalidateQueries({queryKey: videoKey});
        },
        onError: (error) => {
            showErrorToast(error, "Videoni o'chirib bo'lmadi");
        },
    });
};

export const useAttachYoutubeToVideo = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({videoId, youtubeUrl}: {videoId: string; youtubeUrl: string}) =>
            attachYoutubeToVideo(videoId, youtubeUrl),
        onSuccess: async (_data, variables) => {
            await qc.invalidateQueries({queryKey: videoDetailKey(variables.videoId)});
            await qc.invalidateQueries({queryKey: videoKey});
        },
        onError: (error) => {
            showErrorToast(error, "YouTube linkini biriktirib bo'lmadi");
        },
    });
};
