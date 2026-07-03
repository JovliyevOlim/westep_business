import {useState} from "react";
import {X} from "lucide-react";

export default function ChipListInput({
    values,
    onChange,
    placeholder,
    helper = "Enter yoki vergul bilan qo‘shing.",
}: {
    values: string[];
    onChange: (next: string[]) => void;
    placeholder: string;
    helper?: string;
}) {
    const [draft, setDraft] = useState("");

    const commit = () => {
        const next = draft.trim();
        if (!next) return;
        if (values.some((item) => item.toLowerCase() === next.toLowerCase())) {
            setDraft("");
            return;
        }
        onChange([...values, next]);
        setDraft("");
    };

    return (
        <div className="mt-2 space-y-2">
            <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900">
                {values.map((item) => (
                    <span
                        key={item}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200"
                    >
                        {item}
                        <button
                            type="button"
                            onClick={() => onChange(values.filter((value) => value !== item))}
                            className="inline-flex h-4 w-4 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            aria-label={`${item} ni o‘chirish`}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
                <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === ",") {
                            event.preventDefault();
                            commit();
                        }
                    }}
                    onBlur={commit}
                    placeholder={placeholder}
                    className="min-w-[180px] flex-1 bg-transparent px-2 py-1 text-sm text-slate-700 outline-none dark:text-slate-200"
                />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{helper}</p>
        </div>
    );
}
