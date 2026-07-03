import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getItem} from "../../utils/utils.ts";
import {showErrorToast} from "../../utils/toast.tsx";
import {
    bindProfessionCourse,
    createProfession,
    deleteProfession,
    deleteProfessionTranslation,
    getProfessionById,
    getProfessionFields,
    getProfessions,
    reorderProfessionCourses,
    saveProfessionTranslation,
    setProfessionActive,
    syncProfessionCourses,
    unbindProfessionCourse,
    updateProfession,
} from "./professionApi.ts";
import type {SupportedLanguage} from "../../types/types.ts";

const professionsKey = ["professions"] as const;
const professionsListKey = [...professionsKey, "list"] as const;
const professionFieldsKey = [...professionsKey, "fields"] as const;
const professionDetailKey = (id: string | undefined) => [...professionsKey, "detail", id] as const;

export const useGetProfessions = (enabled = true) =>
    useQuery({
        queryKey: professionsListKey,
        queryFn: async () => {
            const token = getItem<string>("accessToken");
            if (!token) throw new Error("No token");
            return await getProfessions();
        },
        retry: false,
        enabled,
    });

export const useGetProfession = (id: string | undefined) =>
    useQuery({
        queryKey: professionDetailKey(id),
        queryFn: async () => {
            const token = getItem<string>("accessToken");
            if (!token) throw new Error("No token");
            if (!id) throw new Error("No id");
            return await getProfessionById(id);
        },
        enabled: Boolean(id),
        retry: false,
    });

export const useGetProfessionFields = (enabled = true) =>
    useQuery({
        queryKey: professionFieldsKey,
        queryFn: async () => {
            const token = getItem<string>("accessToken");
            if (!token) throw new Error("No token");
            return await getProfessionFields();
        },
        retry: false,
        enabled,
    });

export const useCreateProfession = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createProfession,
        onSuccess: async () => {
            await qc.invalidateQueries({queryKey: professionsKey});
        },
        onError: (error) => {
            showErrorToast(error, "Kasb qo'shib bo'lmadi");
        },
    });
};

export const useUpdateProfession = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: updateProfession,
        onSuccess: async (_data, variables) => {
            await qc.invalidateQueries({queryKey: professionsKey});
            await qc.invalidateQueries({queryKey: professionDetailKey(variables.id)});
        },
        onError: (error) => {
            showErrorToast(error, "Kasbni yangilab bo'lmadi");
        },
    });
};

export const useDeleteProfession = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteProfession,
        onSuccess: async () => {
            await qc.invalidateQueries({queryKey: professionsKey});
        },
        onError: (error) => {
            showErrorToast(error, "Kasbni yashirib bo'lmadi");
        },
    });
};

export const useSetProfessionActive = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({id, active}: {id: string; active: boolean}) => setProfessionActive(id, active),
        onSuccess: async (_data, variables) => {
            await qc.invalidateQueries({queryKey: professionsKey});
            await qc.invalidateQueries({queryKey: professionDetailKey(variables.id)});
        },
        onError: (error) => {
            showErrorToast(error, "Holatni o'zgartirib bo'lmadi");
        },
    });
};

export const useSaveProfessionTranslation = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({id, payload}: {id: string; payload: Parameters<typeof saveProfessionTranslation>[1]}) =>
            saveProfessionTranslation(id, payload),
        onSuccess: async (_data, variables) => {
            await qc.invalidateQueries({queryKey: professionsKey});
            await qc.invalidateQueries({queryKey: professionDetailKey(variables.id)});
        },
        onError: (error) => {
            showErrorToast(error, "Tarjimani saqlab bo'lmadi");
        },
    });
};

export const useDeleteProfessionTranslation = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({id, languageCode}: {id: string; languageCode: SupportedLanguage}) =>
            deleteProfessionTranslation(id, languageCode),
        onSuccess: async (_data, variables) => {
            await qc.invalidateQueries({queryKey: professionsKey});
            await qc.invalidateQueries({queryKey: professionDetailKey(variables.id)});
        },
        onError: (error) => {
            showErrorToast(error, "Tarjimani o'chirib bo'lmadi");
        },
    });
};

export const useBindProfessionCourse = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({id, courseId, displayOrder}: {id: string; courseId: string; displayOrder?: number}) =>
            bindProfessionCourse(id, {courseId, displayOrder}),
        onSuccess: async (_data, variables) => {
            await qc.invalidateQueries({queryKey: professionsKey});
            await qc.invalidateQueries({queryKey: professionDetailKey(variables.id)});
        },
        onError: (error) => {
            showErrorToast(error, "Kursni biriktirib bo'lmadi");
        },
    });
};

export const useUnbindProfessionCourse = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({id, courseId}: {id: string; courseId: string}) => unbindProfessionCourse(id, courseId),
        onSuccess: async (_data, variables) => {
            await qc.invalidateQueries({queryKey: professionsKey});
            await qc.invalidateQueries({queryKey: professionDetailKey(variables.id)});
        },
        onError: (error) => {
            showErrorToast(error, "Kursni uzib bo'lmadi");
        },
    });
};

export const useReorderProfessionCourses = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({id, courseIds}: {id: string; courseIds: string[]}) =>
            reorderProfessionCourses(id, {courseIds}),
        onSuccess: async (_data, variables) => {
            await qc.invalidateQueries({queryKey: professionsKey});
            await qc.invalidateQueries({queryKey: professionDetailKey(variables.id)});
        },
        onError: (error) => {
            showErrorToast(error, "Kurslar tartibini yangilab bo'lmadi");
        },
    });
};

export const useSyncProfessionCourses = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: syncProfessionCourses,
        onSuccess: async (_data, variables) => {
            await qc.invalidateQueries({queryKey: professionsKey});
            await qc.invalidateQueries({queryKey: professionDetailKey(variables.id)});
        },
        onError: (error) => {
            showErrorToast(error, "Kurslarni sinxronlashda xatolik");
        },
    });
};
