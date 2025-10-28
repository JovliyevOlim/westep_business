import {useFormik} from "formik";
import * as Yup from "yup";
import PhoneNumberInput from "../../components/form/PhoneNumberInput.tsx";
import CommonButton from "../ui/button/AuthButton.tsx";
import {useCheckPhoneNumber} from "../../api/auth/useAuth.ts";

export default function LoginForm() {
    const {mutateAsync, isPending} = useCheckPhoneNumber();


    const formik = useFormik({
        initialValues: {
            phone: '',
        },
        validationSchema: Yup.object().shape({
            phone: Yup.string()
                .required("Telefon raqami xato kiritildi!")
                .length(12, "Telefon raqami xato kiritildi!"),
        }),
        onSubmit: async (values) => {
            await mutateAsync(values);
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
                        Business
                    </p>

                    <div className="space-y-6">
                        <PhoneNumberInput name="phone" formik={formik} className=""/>
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