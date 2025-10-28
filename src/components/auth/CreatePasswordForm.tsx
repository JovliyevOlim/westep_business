import {useRegister} from "../../api/auth/useAuth.ts";
import {useLocation} from "react-router";
import {useFormik} from "formik";
import {useRequireState} from "../../hooks/useRequireState.ts";
import * as Yup from "yup";
import CommonButton from "../ui/button/AuthButton.tsx";
import InputField from "../form/input/AuthInput.tsx";

function PasswordForm() {
    useRequireState('phone')

    const {mutate, isPending} = useRegister()
    const location = useLocation();


    console.log("phone", location.state);

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object().shape({
            password: Yup.string()
                .required("Parolni kiriting!")
                .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak!"),
            confirmPassword: Yup.string()
                .required("Parolni kiriting!")
                .oneOf([Yup.ref("password")], "Parollar bir xil bo‘lishi kerak!"),
        }),
        onSubmit: (values) => {
            mutate({
                ...location.state, password:
                values.password
            })
            ;
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
                    <p className="text-2xl text-gray-900 font-semibold text-center mb-8">
                        Parol yaratish
                    </p>
                    <div className="grid grid-cols-1 mt-2 gap-3">
                        <InputField
                            name="password" label="" placeholder={'Yangi parol'} type="password"
                            key='passwords' formik={formik}
                        />
                        <InputField
                            name="confirmPassword" label="" placeholder={'Parol tasdig’i'} type="password"
                            key='password' formik={formik}
                        />
                    </div>

                    <div className="mt-8 w-full">
                        <CommonButton
                            type="submit"
                            children={"Davom etish"}
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