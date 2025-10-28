import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "../../layout/AuthLayout.tsx";
import Register from "../../components/auth/Register.tsx";

export default function SignUp() {
    return (
        <>
            <PageMeta
                title="React.js SignUp Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js SignUp Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <AuthLayout>
                <Register/>
            </AuthLayout>
        </>
    );
}
