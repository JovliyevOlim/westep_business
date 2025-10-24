import {useFormik} from "formik";
import * as Yup from "yup";
import {useLocation} from "react-router-dom";
import InputField from "../InputField.tsx";
import Button from "../button/Button.tsx";
import {BusinessType} from "../../types/types.ts";


interface Props {
    isPending: boolean;
    mutate: (variables: BusinessType) => void;
}

export default function NewPassword({mutate, isPending}: Props) {

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
        <>
            <section>
                <div className="row align-items-center">
                    <div className="col-12 wow fadeIn">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                formik.handleSubmit();
                                return false;
                            }}
                        >
                            <h4 className="login_register_title">Parol yaratish</h4>
                            <InputField name="password" label="" placeholder={'Yangi parol'} type="password"
                                        key='passwords' formik={formik}/>
                            <InputField name="confirmPassword" label="" placeholder={'Parol tasdig’i'} type="password"
                                        key='password' formik={formik}/>
                            <div className="form-group col-lg-12">
                                <Button children={'Davom etish'} type={'submit'} isPending={isPending}/>
                            </div>
                        </form>

                    </div>
                </div>
            </section>
        </>
    );
}
