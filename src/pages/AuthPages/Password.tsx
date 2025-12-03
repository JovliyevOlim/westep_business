import AuthLayout from "../../layout/AuthLayout";
import PasswordForm from "../../components/auth/PasswordForm.tsx";

export default function Password() {
    return (
        <>
            <AuthLayout>
                <PasswordForm/>
            </AuthLayout>
        </>
    );
}
