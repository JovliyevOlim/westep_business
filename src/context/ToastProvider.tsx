import {Toaster} from "react-hot-toast";

export const ToastProvider = () => {
    return (
        <Toaster
            // toasterId="area2"
            position="top-right"
            toastOptions={{
                duration: 2000,
            }}
        />
    );
};