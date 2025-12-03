import {useFormik} from "formik";
import {useRequireState} from "../../hooks/useRequireState.ts";
import * as Yup from "yup";
import CommonButton from "../ui/button/AuthButton.tsx";
import InputField from "../form/input/AuthInput.tsx";
import {useOtpPhoneNumber} from "../../api/auth/useAuth.ts";


function ResetPasswordForm() {
    useRequireState('phoneNumber')

    const form = JSON.parse(sessionStorage.getItem('form') as string);
    const {mutate, isPending} = useOtpPhoneNumber('RESET_PASSWORD')

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object().shape({
            password: Yup.string()
                .required("Parolni kiriting!")
                .matches(/[A-Z]/, "Kamida bitta katta harf bo‘lishi kerak")
                .matches(/[a-z]/, "Kamida bitta kichik harf bo‘lishi kerak")
                .matches(/\d/, "Kamida bitta raqam bo‘lishi kerak")
                .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak"),
            confirmPassword: Yup.string()
                .required("Parolni kiriting!")
                .oneOf([Yup.ref("password")], "Parollar bir xil bo‘lishi kerak!"),
        }),
        onSubmit: (values) => {
            sessionStorage.setItem('form', JSON.stringify({
                ...form, password: values.password,
            }));
            mutate({phoneNumber: form.phoneNumber, type: 'RESET_PASSWORD'})
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
                        Yangi Parol o'rnatish
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
                            disabled={!(formik.isValid && formik.dirty)}
                        />
                    </div>
                </form>
            </div>
        </section>
    );
}

export default ResetPasswordForm;