import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {addFile, deleteFile, getFileById} from "./filesApi.ts";
import {getItem} from "../../utils/utils.ts";


export const useGetFileById = (id: string | undefined) =>
    useQuery({
        queryKey: ["", id],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getFileById(id);
        },
        enabled: !!id,
        retry: false,
    });

export const useAddFile = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addFile,
        onSuccess: async (id) => {
            console.log(id)
            qc.setQueryData(["fileId"], id);
        },
        onError: (error) => {
            alert(error);
        },
    });
};


export const useDeleteFile = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteFile,
        onSuccess: async (id) => {
            qc.setQueryData(["file"], id);
        },
        onError: (error) => {
            alert(error);
        },
    });
};

