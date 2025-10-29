import {
    ChangeEvent,
    useState,
    useImperativeHandle,
    forwardRef, useEffect,
} from "react";
import {TrashBinIcon} from "../../../icons";
import {useAddFile, useDeleteFile, useGetFileById} from "../../../api/file/useFile.ts";

type Props = {
    name?: string;
    accept?: string;
    maxSizeMB?: number;
    onChange?: (file: File | null) => void;
    handleSubmit?: (fileId?: string | null) => Promise<void>;
    className?: string;
    preview?: boolean;
    text?: string;
    attachmentId?: string;
};

export type CommonFileInputRef = {
    saveFile: () => void;
};

const CommonFileInput = forwardRef<CommonFileInputRef, Props>(
    (
        {
            name,
            accept = "*/*",
            maxSizeMB = 10,
            onChange,
            className = "",
            preview = true,
            text = "Yuklash",
            attachmentId,
            handleSubmit
        },
        ref
    ) => {
        const {mutate: addFile, data: fileId} = useAddFile()
        const [error, setError] = useState<string | null>(null);
        const [file, setFile] = useState<File | null>(null);
        const [previewUrl, setPreviewUrl] = useState<string | null>(null);
        const {data} = useGetFileById(attachmentId)
        const {mutate: fileDelete} = useDeleteFile()

        useEffect(() => {
            if (data) {
                const blob = new Blob([data], {type: data.type || "image/svg+xml"});
                setPreviewUrl(URL.createObjectURL(blob));
                setFile(data)
            }
        }, [data]);



        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            setError(null);

            if (!selectedFile) {
                setFile(null);
                setPreviewUrl(null);
                onChange?.(null);
                return;
            }

            if (selectedFile.size > maxSizeMB * 1024 * 1024) {
                setError(`Fayl hajmi ${maxSizeMB}MB dan oshmasligi kerak.`);
                return;
            }

            setFile(selectedFile);
            onChange?.(selectedFile);

            if (preview && selectedFile.type.startsWith("image/")) {
                setPreviewUrl(URL.createObjectURL(selectedFile));
            } else {
                setPreviewUrl(null);
            }
        };

        const handleRemove = () => {
            setFile(null);
            setPreviewUrl(null);
            onChange?.(null);
        };

        // 🔥 forwardRef orqali ota komponentga funksiya eksport qilamiz
        useImperativeHandle(ref, () => ({
            saveFile() {
                if (file) {
                    const formData = new FormData();
                    formData.append("file", file);
                    addFile(formData)
                } else {
                    setError('Rasm tanlang!')
                }
            }
        }));

        useEffect(() => {
            const handleAsync = async () => {
                if (fileId) {
                    if (handleSubmit) {
                        await handleSubmit(fileId);
                    }
                    if (attachmentId) {
                        await fileDelete(attachmentId);
                    }
                }
            };

            handleAsync();
        }, [fileId]);

        return (
            <div className={`file-input ${className}`}>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2">
                    <label
                        className="inline-flex cursor-pointer justify-center items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <input
                            type="file"
                            accept={accept}
                            name={name}
                            onChange={handleChange}
                            className="sr-only"
                        />
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 5v14M5 12h14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span>{text}</span>
                    </label>

                    {file && (
                        <button
                            onClick={handleRemove}
                            className="flex items-center gap-2 justify-center rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                        >
                            <TrashBinIcon className="text-xl"/> Bekor qilish
                        </button>
                    )}
                </div>

                {file && (
                    <div
                        className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg p-3">
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                            {preview && previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt={file.name}
                                    className="h-24 w-24 sm:h-36 sm:w-36 rounded-lg object-cover"
                                />
                            ) : (
                                <div
                                    className="h-16 w-16 flex items-center justify-center rounded-lg bg-gray-200 text-gray-600 text-sm font-medium">
                                    {file.name.split(".").pop()?.toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);

export default CommonFileInput;