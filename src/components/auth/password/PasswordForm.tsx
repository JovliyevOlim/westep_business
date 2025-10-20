import {useLogin} from "../../../api/auth/useAuth.ts";
import 'react-phone-number-input/style.css';
import {useFormik} from "formik";
import * as Yup from "yup";
import {Link, useLocation} from "react-router-dom";
import Button from "../../../ui/Button.tsx";


export default function PasswordForm() {

    const location = useLocation();
    const {phone} = location.state;
    const {mutateAsync, isPending} = useLogin();


    const formik = useFormik({
        initialValues: {
            password: ''
        },
        validationSchema: Yup.object().shape({
            password: Yup.string()
                .required("Parolni kiriting!")
                .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak!"),
        }),
        onSubmit: async (values) => {
            await mutateAsync({
                phone: phone,
                password: values.password
            })
        },
    });

    return (
        <>
            <section className="login_register section-padding">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12 wow fadeIn">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    formik.handleSubmit();
                                    return false;
                                }}
                            >
                                <h4 className="login_register_title">Kirish</h4>
                                <div className={'form-group mb-4'}>
                                    <label htmlFor="phone" className="form-label text-dark">
                                        Parolni kiriting!
                                    </label>
                                    <input type="password" placeholder="Parol" id="password"
                                           className="form-control m-0" name="password"
                                           value={formik.values.password}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}/>
                                    {formik.errors.password && formik.touched.password ? (
                                        <p className={'text-start d-flex text-danger m-0'}>{formik.errors.password}</p>
                                    ) : null}

                                </div>
                                <div className="form-group col-lg-12">
                                    <Button isPending={isPending}/>
                                </div>
                                <p className={'mt-2'}><Link to="/forgot-password">Parolni unutdingizmi?</Link></p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
