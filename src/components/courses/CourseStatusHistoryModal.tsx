import {LoaderCircle, MessageSquare} from "lucide-react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "../ui/dialog.tsx";
import {useCourseStatusHistory} from "../../api/courses/useCourse.ts";
import CourseStatusBadge from "./CourseStatusBadge.tsx";

const formatTimestamp = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function CourseStatusHistoryModal({
    open,
    onClose,
    courseId,
}: {
    open: boolean;
    onClose: () => void;
    courseId: string | undefined;
}) {
    const {data: history = [], isLoading, error} = useCourseStatusHistory(courseId, open);

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Status tarixi</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Yuklanmoqda...
                    </div>
                ) : error ? (
                    <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 dark:bg-rose-500/10 dark:text-rose-200">
                        Status tarixi yuklanmadi.
                    </p>
                ) : history.length === 0 ? (
                    <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                        Hali status o‘zgarishi qayd etilmagan.
                    </p>
                ) : (
                    <ol className="space-y-3">
                        {history.map((item, index) => (
                            <li
                                key={item.id || `${item.toStatus}-${index}`}
                                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/40"
                            >
                                <div className="flex flex-wrap items-center gap-2">
                                    {item.fromStatus ? (
                                        <>
                                            <CourseStatusBadge status={String(item.fromStatus)} />
                                            <span className="text-xs text-slate-400">→</span>
                                        </>
                                    ) : null}
                                    <CourseStatusBadge status={String(item.toStatus)} />
                                </div>
                                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <span>{item.changedByFullName || item.changedBy || "Tizim"}</span>
                                    <span>{formatTimestamp(item.changedAt)}</span>
                                </div>
                                {item.note ? (
                                    <div className="mt-2 flex gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                                        <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                                        <span>{item.note}</span>
                                    </div>
                                ) : null}
                            </li>
                        ))}
                    </ol>
                )}
            </DialogContent>
        </Dialog>
    );
}
