import {useLogin} from "../../api/auth/useAuth.ts";
import {useLocation} from "react-router";
import {useFormik} from "formik";
import {useRequireState} from "../../hooks/useRequireState.ts";
import * as Yup from "yup";
import CommonButton from "../ui/button/AuthButton.tsx";
import InputField from "../form/input/AuthInput.tsx";

function PasswordForm() {
    useRequireState('phone')

    const location = useLocation();
    const phone = location.state?.phone;
    const {mutateAsync, isPending} = useLogin();


    const formik = useFormik({
        initialValues: {
            password: ''
        },
        validationSchema: Yup.object().shape({
            password: Yup.string()
                .required("Parolni kiriting!")
            // .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak!"),
        }),
        onSubmit: async (values) => {
            await mutateAsync({
                phone: phone,
                password: values.password
            })
        },
    });
    return (
        <section className="flex items-center justify-center w-full">
            <div className="w-full max-w-lg animate-fadeIn">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                        return false;
                    }}
                    className="bg-transparent"
                >
                    <p className="text-2xl font-semibold text-gray-900 text-center mb-8">
                        Kirish
                    </p>
                    <div className="grid grid-cols-1 mt-2">
                        <InputField
                            placeholder="Parolni kiriting!"
                            formik={formik}
                            type="password"
                            name="password"
                        />
                    </div>

                    <div className="mt-8 w-full">
                        <CommonButton
                            type="submit"
                            children={"Kirish"}
                            variant="primary"
                            isPending={isPending}
                        />
                    </div>
                </form>
            </div>
        </section>
    );
}

export default PasswordForm;