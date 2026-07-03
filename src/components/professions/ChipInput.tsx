import {useState} from "react";
import {X} from "lucide-react";
import {Badge} from "../ui/badge.tsx";
import {Input} from "../ui/input.tsx";

export default function ChipInput({
    label,
    value,
    onChange,
    placeholder,
    helper,
}: {
    label: string;
    value: string[];
    onChange: (next: string[]) => void;
    placeholder: string;
    helper?: string;
}) {
    const [input, setInput] = useState("");

    const commitValue = (rawValue: string) => {
        const nextItem = rawValue.trim();
        if (!nextItem) {
            return;
        }

        const normalized = nextItem.replace(/\s+/g, " ");
        if (value.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
            setInput("");
            return;
        }

        onChange([...value, normalized]);
        setInput("");
    };

    return (
        <div className="space-y-2">
            <div>
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</label>
                {helper ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helper}</p> : null}
            </div>
            <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-2 dark:border-slate-800 dark:bg-slate-900/70">
                {value.map((item) => (
                    <Badge key={item} variant="secondary" className="gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-200">
                        {item}
                        <button
                            type="button"
                            onClick={() => onChange(value.filter((chip) => chip !== item))}
                            className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            aria-label={`${label}dan ${item} ni o'chirish`}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
                <Input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === ",") {
                            event.preventDefault();
                            commitValue(input);
                        }
                    }}
                    onBlur={() => commitValue(input)}
                    placeholder={placeholder}
                    className="min-w-[180px] flex-1 border-0 bg-transparent px-2 py-2 shadow-none outline-none focus-visible:ring-0"
                />
            </div>
        </div>
    );
}
