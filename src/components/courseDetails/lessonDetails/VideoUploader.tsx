import {useEffect, useRef, useState} from "react";
import {AlertTriangle, CheckCircle2, LoaderCircle, Trash2, UploadCloud, X} from "lucide-react";
import {Button} from "../../ui/button.tsx";
import {showErrorToast, showSuccessToast} from "../../../utils/toast.tsx";
import {
    useConfirmVideoUpload,
    useDeleteVideo,
    useGetLessonVideoById,
    useInitVideoUpload,
    useVideoById,
} from "../../../api/vedio/useVedio.ts";
import {uploadFileToMinio} from "../../../api/vedio/vedioApi.ts";
import {parseApiError} from "../../../utils/apiError.ts";
import type {VideoResponse, VideoUploadStatus} from "../../../types/types.ts";

const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024;
const ACCEPTED_TYPE = "video/mp4";

type UploadingState =
    | {phase: "idle"}
    | {phase: "initializing"; file: File}
    | {phase: "uploading"; file: File; videoId: string; percent: number; abort: AbortController}
    | {phase: "confirming"; file: File; videoId: string}
    | {phase: "error"; message: string; videoId?: string};

const statusLabel: Record<VideoUploadStatus, string> = {
    PENDING: "Boshlanmagan",
    UPLOADED: "Yuklandi, tayyorlanmoqda",
    PROCESSING: "Qayta ishlanmoqda",
    READY: "Tayyor",
    FAILED: "Xato — qayta yuklang",
};

const formatBytes = (bytes: number) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
};

export default function VideoUploader({lessonId, lessonTitle}: {lessonId: string; lessonTitle?: string}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState<UploadingState>({phase: "idle"});

    const {data: lessonVideos = [], isLoading: isVideosLoading} = useGetLessonVideoById(lessonId);
    const activeVideo: VideoResponse | undefined = Array.isArray(lessonVideos) ? lessonVideos[0] : undefined;
    const inFlightVideoId =
        uploading.phase === "uploading" || uploading.phase === "confirming"
            ? uploading.videoId
            : undefined;
    const pendingVideoId = inFlightVideoId || activeVideo?.id;
    const shouldPoll = activeVideo
        ? activeVideo.uploadStatus !== "READY" && activeVideo.uploadStatus !== "FAILED"
        : Boolean(pendingVideoId);
    const {data: pollingVideo} = useVideoById(pendingVideoId, {pollWhilePending: shouldPoll});

    const initMutation = useInitVideoUpload();
    const confirmMutation = useConfirmVideoUpload();
    const deleteMutation = useDeleteVideo();

    const currentVideo = pollingVideo || activeVideo;

    useEffect(() => {
        if (uploading.phase !== "uploading") return;
        return () => {
            uploading.abort.abort();
        };
    }, [uploading]);

    const resetInput = () => {
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleSelect = async (file: File | null) => {
        if (!file) return;

        if (file.type !== ACCEPTED_TYPE) {
            showErrorToast(new Error("Faqat MP4 video qabul qilinadi"), "Noto'g'ri format");
            resetInput();
            return;
        }
        if (file.size > MAX_VIDEO_BYTES) {
            showErrorToast(new Error(`Maksimal hajm ${formatBytes(MAX_VIDEO_BYTES)}`), "Fayl katta");
            resetInput();
            return;
        }

        setUploading({phase: "initializing", file});

        try {
            const initResponse = await initMutation.mutateAsync({
                lessonId,
                filename: file.name,
                fileSize: file.size,
                contentType: file.type,
                title: lessonTitle,
            });

            const abort = new AbortController();
            setUploading({phase: "uploading", file, videoId: initResponse.videoId, percent: 0, abort});

            await uploadFileToMinio({
                uploadUrl: initResponse.uploadUrl,
                file,
                contentType: file.type,
                signal: abort.signal,
                onProgress: ({percent}) => {
                    setUploading((current) =>
                        current.phase === "uploading" && current.videoId === initResponse.videoId
                            ? {...current, percent}
                            : current,
                    );
                },
            });

            setUploading({phase: "confirming", file, videoId: initResponse.videoId});
            await confirmMutation.mutateAsync(initResponse.videoId);
            setUploading({phase: "idle"});
            resetInput();
            showSuccessToast("Video yuklandi, tayyorlanmoqda");
        } catch (error) {
            const parsed = parseApiError(error, "Video yuklab bo'lmadi");
            setUploading({phase: "error", message: parsed.message});
            showErrorToast(parsed, "Video yuklab bo'lmadi");
            resetInput();
        }
    };

    const handleCancel = () => {
        if (uploading.phase === "uploading") {
            uploading.abort.abort();
            setUploading({phase: "idle"});
            resetInput();
        }
    };

    const handleDeleteVideo = async () => {
        if (!currentVideo?.id) return;
        if (!window.confirm("Videoni o'chirmoqchimisiz?")) return;
        try {
            await deleteMutation.mutateAsync(currentVideo.id);
            showSuccessToast("Video o'chirildi");
        } catch (error) {
            // toast already shown by hook
        }
    };

    const isBusy =
        uploading.phase === "initializing"
        || uploading.phase === "uploading"
        || uploading.phase === "confirming"
        || initMutation.isPending
        || confirmMutation.isPending;

    return (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-100">Video</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        MP4, maksimal {formatBytes(MAX_VIDEO_BYTES)}. MinIO'ga to‘g‘ridan-to‘g‘ri yuklanadi.
                    </p>
                </div>
                {currentVideo ? (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteVideo}
                        disabled={deleteMutation.isPending}
                        className="gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        O‘chirish
                    </Button>
                ) : null}
            </div>

            {isVideosLoading ? (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    Yuklanmoqda...
                </div>
            ) : null}

            {currentVideo ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {currentVideo.title || "Video"}
                        </span>
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                currentVideo.uploadStatus === "READY"
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"
                                    : currentVideo.uploadStatus === "FAILED"
                                        ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-200"
                                        : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200"
                            }`}
                        >
                            {currentVideo.uploadStatus === "READY" ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : currentVideo.uploadStatus === "FAILED" ? (
                                <AlertTriangle className="h-3.5 w-3.5" />
                            ) : (
                                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                            )}
                            {statusLabel[currentVideo.uploadStatus] || currentVideo.uploadStatus}
                        </span>
                    </div>
                    {currentVideo.duration ? (
                        <p className="mt-1 text-slate-500 dark:text-slate-400">
                            Davomiyligi: {Math.round((currentVideo.duration || 0) / 60)} daqiqa
                        </p>
                    ) : null}
                </div>
            ) : null}

            {uploading.phase === "uploading" ? (
                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">{uploading.file.name}</span>
                        <span>{uploading.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                            className="h-full bg-blue-600 transition-all"
                            style={{width: `${uploading.percent}%`}}
                        />
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={handleCancel} className="gap-1.5">
                        <X className="h-3.5 w-3.5" />
                        Bekor qilish
                    </Button>
                </div>
            ) : null}

            {uploading.phase === "initializing" || uploading.phase === "confirming" ? (
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    {uploading.phase === "initializing" ? "Yuklash uchun tayyorlanmoqda..." : "Tasdiqlanmoqda..."}
                </div>
            ) : null}

            {uploading.phase === "error" ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                    {uploading.message}
                </div>
            ) : null}

            <label
                className={`inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${
                    isBusy ? "pointer-events-none opacity-60" : "cursor-pointer hover:border-blue-400 hover:bg-blue-50/40"
                }`}
            >
                <UploadCloud className="h-4 w-4" />
                {currentVideo ? "Boshqa video yuklash" : "Video tanlash"}
                <input
                    ref={inputRef}
                    type="file"
                    accept="video/mp4"
                    className="hidden"
                    onChange={(event) => handleSelect(event.target.files?.[0] || null)}
                    disabled={isBusy}
                />
            </label>
        </div>
    );
}
