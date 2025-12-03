import AuthLayout from "../../layout/AuthLayout.tsx";
import VerifyCodeForm from "../../components/auth/VerifyCodeForm.tsx";

export default function VerifyCode() {
    return (
        <>
            <AuthLayout>
                <VerifyCodeForm />
            </AuthLayout>
        </>
    );
}
