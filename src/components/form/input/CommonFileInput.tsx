import {
    ChangeEvent,
    useState,
    useImperativeHandle,
    forwardRef, useEffect,
} from "react";
import {AddCircle, TrashBinIcon} from "../../../icons";
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
            <div className={`${className} `}>
                {file ?

                    <div className="relative w-full h-[180px]">
                        {preview && previewUrl &&
                            <img
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    objectPosition: 'center'
                                }}
                                src={previewUrl}
                                alt={file.name}
                            />}
                        {file && (
                            <TrashBinIcon onClick={handleRemove}
                                          className="text-xl  absolute top-2 right-2 text-red-500"/>
                        )}
                    </div>
                    :
                    <label className="h-[180px] border-b border-blue-300 w-full cursor-pointer flex justify-center flex-col items-center gap-2"
                    >
                        <input
                            type="file"
                            accept={accept}
                            name={name}
                            onChange={handleChange}
                            className="sr-only"
                        />
                        <AddCircle height={24} width={24} className={'text-blue-600'}/>
                        <span className={'text-md'}>{text}</span>
                        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    </label>
                }

            </div>
        );
    }
);

export default CommonFileInput;