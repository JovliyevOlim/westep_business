import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {
    checkPhoneNumber,
    DeviceLimitExceededError,
    getCurrentUser,
    login,
    logout,
    resetPassword,
    sendOtpCode,
    verifyCode
} from "./authApi.ts";
import {useNavigate} from "react-router-dom";
import {getItem, removeItem} from "../../utils/utils.ts";
import {useToast} from "../../hooks/useToast.tsx";
import {showErrorToast} from "../../utils/toast.tsx";
import {getCurrentDeviceMeta} from "../../utils/device.ts";

export const normalizeRoleName = (roleName?: string) => (roleName || "").toUpperCase();

export const normalizePermission = (permission?: string) => (permission || "").trim().toUpperCase();

export const hasPermission = (permissionsList: string[] | undefined, permission: string) =>
    permissionsList?.some((item) => normalizePermission(item) === normalizePermission(permission)) || false;

export const isBusinessAdminRole = (roleName?: string) =>
    normalizeRoleName(roleName).includes("BUSINESS_ADMIN");

export const isTeacherRole = (roleName?: string) =>
    normalizeRoleName(roleName).includes("TEACHER");

export const isAssistantRole = (roleName?: string) =>
    normalizeRoleName(roleName).includes("ASSISTANT");

export const isStudentRole = (roleName?: string) =>
    normalizeRoleName(roleName).includes("STUDENT");

export const isTeacherSideRole = (roleName?: string) =>
    isBusinessAdminRole(roleName) || isTeacherRole(roleName);

export const isCourseManagerRole = (roleName?: string) =>
    isTeacherSideRole(roleName);

export const isLessonQuizManagerRole = (roleName?: string) =>
    isTeacherRole(roleName) || isBusinessAdminRole(roleName) || isAssistantRole(roleName);

export const isWorkspaceUserRole = (roleName?: string) =>
    isLessonQuizManagerRole(roleName) || isStudentRole(roleName);

const resolveLoginRedirect = (roleName?: string) =>
    isTeacherSideRole(roleName) ? "/" : "/courses";

const completeLoginFlow = async ({
    navigate,
    toast,
    queryClient,
}: {
    navigate: ReturnType<typeof useNavigate>;
    toast: ReturnType<typeof useToast>;
    queryClient: ReturnType<typeof useQueryClient>;
}) => {
    try {
        const user = await getCurrentUser();

        if (!isWorkspaceUserRole(user?.roleName)) {
            removeItem("accessToken");
            removeItem("refreshToken");
            queryClient.removeQueries({queryKey: ["currentUser"]});
            toast.error("Bu panelga ruxsat berilgan rol bilan kiring.");
            navigate("/login", {replace: true});
            return;
        }

        // Keshda eski "No token" error holati qolib ketmasligi uchun userni shu yerda yozib qo'yamiz,
        // aks holda AuthProtected mount bo'lganda isError=true bo'lib login sahifasiga qaytarib yuboradi.
        queryClient.setQueryData(["currentUser"], user);
        navigate(resolveLoginRedirect(user?.roleName), {replace: true});
    } catch (error) {
        removeItem("accessToken");
        removeItem("refreshToken");
        toast.error(error instanceof Error ? error.message : "Login amalga oshmadi.");
        navigate("/login", {replace: true});
    }
};

export const useUser = () =>
    useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const token = getItem<string>('accessToken');
            if (!token) throw new Error("No token");
            return await getCurrentUser();
        },
        retry: false,
        staleTime: 1000 * 60 * 10,          // 10 daqiqa davomida so‘rov yubormaydi
        refetchOnWindowFocus: false,        // sahifa qayta focus bo‘lsa so‘rov yubormaydi
        refetchOnMount: false,              // component qayta mount bo‘lsa so‘rov yubormaydi
        refetchOnReconnect: false,
    });

export const useLogin = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: login,
        onSuccess: async () => {
            await completeLoginFlow({navigate, toast, queryClient});
        },
        onError: (error: Error) => {
            if (error instanceof DeviceLimitExceededError) {
                return;
            }
            toast.error(error.message);
        },
    });
};

export const useDeviceAwareLogin = () => {
    const loginMutation = useLogin();

    const loginWithCurrentDevice = async (payload: {
        phone: string;
        password: string;
        replaceSessionId?: string;
    }) => {
        const deviceMeta = getCurrentDeviceMeta();

        return await loginMutation.mutateAsync({
            ...payload,
            deviceId: deviceMeta.deviceId,
            deviceName: deviceMeta.deviceName,
        });
    };

    return {
        ...loginMutation,
        loginWithCurrentDevice,
    };
};

export const useCheckPhoneNumber = () => {
        const navigate = useNavigate();
        const toast = useToast();
        return useMutation({
            mutationFn: checkPhoneNumber,
            onSuccess: (_, body: { phone: string }) => {
                navigate("/password", {state: {phone: body.phone}});
            },
            onError: () => {
                toast.warning("Kirish rad etildi", "Bu telefon raqami tizimda ro'yxatdan o'tmagan");
            },
        });
    }
;


export const useLogout = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            qc.removeQueries({queryKey: ["currentUser"]});
        },
    });
};


export const useOtpPhoneNumber = (type: string) => {
    sessionStorage.setItem("otpType", JSON.stringify(type));
    const navigate = useNavigate();
    return useMutation({
        mutationFn: sendOtpCode,
        onSuccess: () => {
            navigate("/verify-code");
        },
        onError: (error) => {
            return error
        },
    });
};


export const useVerifyCode = () => {
    const {mutate: resetPassword} = useResetPassword();
    return useMutation({
        mutationFn: verifyCode,
        onSuccess: () => {
            const form = JSON.parse(sessionStorage.getItem("form") as string);
            resetPassword({
                password: form.password,
                phoneNumber: form.phoneNumber,
            });
        },
        onError: (error) => {
            showErrorToast(error, "Kod tasdiqlanmadi");
        },
    });
};

export const useResetPassword = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            navigate("/login");
        },
        onError: (error) => {
            return error
        },
    });
};
