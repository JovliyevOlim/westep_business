import {AlertTriangle, CheckCircle2, FileEdit, Globe2, RefreshCw, Send} from "lucide-react";
import type {ComponentType, SVGProps} from "react";
import type {CourseStatus} from "../../types/types.ts";

type StatusMeta = {
    label: string;
    className: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const statusMeta: Record<CourseStatus, StatusMeta> = {
    DRAFT: {
        label: "Qoralama",
        className: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
        Icon: FileEdit,
    },
    SUBMITTED: {
        label: "Tekshiruvda",
        className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
        Icon: Send,
    },
    APPROVED: {
        label: "Tasdiqlandi",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
        Icon: CheckCircle2,
    },
    REJECTED: {
        label: "Rad etildi",
        className: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200",
        Icon: AlertTriangle,
    },
    PUBLISHED: {
        label: "Published",
        className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200",
        Icon: Globe2,
    },
    ARCHIVED: {
        label: "Arxiv",
        className: "border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400",
        Icon: RefreshCw,
    },
};

const fallbackMeta: StatusMeta = {
    label: "Noma'lum",
    className: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
    Icon: FileEdit,
};

export function getCourseStatusMeta(status?: string | null) {
    if (!status) return fallbackMeta;
    return statusMeta[status.toUpperCase() as CourseStatus] || fallbackMeta;
}

export default function CourseStatusBadge({status, className = ""}: {status?: string | null; className?: string}) {
    const meta = getCourseStatusMeta(status);
    const Icon = meta.Icon;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${meta.className} ${className}`}
        >
            <Icon className="h-3.5 w-3.5" />
            {meta.label}
        </span>
    );
}
