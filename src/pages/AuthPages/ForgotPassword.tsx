import AuthLayout from "../../layout/AuthLayout.tsx";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm.tsx";

function ForgotPassword() {
    return (
        <>
            <AuthLayout>
                <ForgotPasswordForm/>
            </AuthLayout>
        </>);
}

export default ForgotPassword;