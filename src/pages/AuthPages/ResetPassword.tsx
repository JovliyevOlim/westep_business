import AuthLayout from "../../layout/AuthLayout";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm.tsx";

export default function CreatePassword() {
    return (
        <>
            <AuthLayout>
                <ResetPasswordForm />
            </AuthLayout>
        </>
    );
}
