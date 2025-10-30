import toast from "react-hot-toast";
import Alert from "../components/ui/alert/Alert.tsx";

export const useToast = () => {
    return {
        success: (msg: string, body?: string) =>
            toast.custom(() => (
                <Alert
                    variant="success"
                    message={body}
                    title={msg}
                />
            )),

        error: (msg: string, body?: string) =>
            toast.custom(() => (
                <Alert
                    variant="error"
                    message={body}
                    title={msg}
                />
            )),

        info: (msg: string, body?: string) =>
            toast.custom(() => (
                <Alert
                    variant="info"
                    message={body}
                    title={msg}
                />
            )),

        warning: (msg: string, body?: string) =>
            toast.custom(() => (
                <Alert
                    variant="warning"
                    message={body}
                    title={msg}
                />
            )),
    }
        ;
};