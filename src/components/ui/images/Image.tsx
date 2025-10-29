import {useEffect, useState} from "react";
import {useGetFileById} from "../../../api/file/useFile.ts";

function Image({id}: { id: string | null }) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const {data} = useGetFileById(id as string);

    useEffect(() => {
        if (data) {
            const blob = new Blob([data], {type: data.type || "image/svg+xml"});
            setPreviewUrl(URL.createObjectURL(blob));
        }
    }, [data]);
    return (
        <div className="w-24 h-20 overflow-hidden">
            {
                previewUrl && <img
                    loading='lazy'
                    width={100}
                    height={80}
                    src={previewUrl}
                    alt={id as string}
                />
            }

        </div>);
}

export default Image;