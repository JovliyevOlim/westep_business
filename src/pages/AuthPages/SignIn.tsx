import AuthLayout from "../../layout/AuthLayout";
import LoginForm from "../../components/auth/Login.tsx";

export default function SignIn() {
    return (
        <>
            <AuthLayout>
                <LoginForm/>
            </AuthLayout>
        </>
    );
}
