import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "../../layout/AuthLayout";
import CreatePasswordForm from "../../components/auth/CreatePasswordForm.tsx";

export default function CreatePassword() {
    return (
        <>
            <PageMeta
                title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <AuthLayout>
                <CreatePasswordForm />
            </AuthLayout>
        </>
    );
}
