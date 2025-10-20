import {Link, useLocation, useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useState} from "react";
import Button from "../../../ui/Button.tsx";
import InputField from "../../../ui/InputField.tsx";


export default function Register() {

    const location = useLocation();
    const navigate = useNavigate();
    const {phone} = location.state;

    const [isPending, setIsPending] = useState<boolean>(false);

    console.log(phone)

    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            ownerBirthDate: '',
            ownerGender: 'MALE',
            businessName: '',
            address: '',
            description: '',
        },
        validationSchema: Yup.object().shape({
            firstname: Yup.string().required('Ism kiriting!'),
            lastname: Yup.string().required('Familiyani kiriting!'),
            ownerBirthDate: Yup.string().required("Tu'gilgan sanani tanlang!"),
        }),
        onSubmit: (values) => {
            setIsPending(true);
            setTimeout(() => {
                navigate('/create-password', {state: {...values, phone: phone, text: 'Parol yaratish'}})
                setIsPending(false)
            }, 1000)
        },
    });


    return (
        <>
            <section>
                <div className="row d-flex align-items-center justify-content-between">
                    <div className="col-12 wow fadeIn">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                formik.handleSubmit();
                                return false;
                            }}>
                            <h3 className={'text-center mb-3'}>Ro'yxatdan o'tish</h3>
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <InputField placeholder={'Ism'} formik={formik}
                                                type='text'
                                                name={"firstname"}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <InputField placeholder={'Familiya'} formik={formik}
                                                type='text'
                                                name={"lastname"}
                                    />

                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <InputField placeholder={'Biznes nomi'} formik={formik}
                                                type='text'
                                                name={"businessName"}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <InputField placeholder={'Address'} formik={formik}
                                                type='text'
                                                name={"address"}
                                    />
                                </div>
                            </div>
                            <InputField placeholder={'Tavsif'} formik={formik}
                                        type='text'
                                        name={"description"}
                            />
                            <InputField placeholder={"Tug'ilgan kun"} formik={formik}
                                        type='date'
                                        name={"ownerBirthDate"}
                            />
                            <div className="form-group mb-2 d-flex align-items-center justify-content-between">
                                <label className="d-flex align-items-center gap-2 col-5">
                                    <div
                                        className={'form-control d-flex justify-content-center align-items-center gap-3'}>
                                        <p className={"m-0"}>
                                            Ayol
                                        </p>
                                        <input
                                            type="radio"
                                            name="ownerGender"
                                            value="FEMALE"
                                            style={{transform: "scale(1.8)"}}
                                            checked={formik.values.ownerGender === 'FEMALE'}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                </label>

                                <label className="d-flex align-items-center gap-2 col-5">
                                    <div
                                        className={'form-control d-flex justify-content-center align-items-center gap-3'}>
                                        <p className={"m-0"}>
                                            Erkak
                                        </p>
                                        <input
                                            type="radio"
                                            name="ownerGender"
                                            value="MALE"
                                            style={{transform: "scale(1.8)"}}
                                            checked={formik.values.ownerGender === 'MALE'}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                </label>
                            </div>
                            <div className="form-group col-lg-12">
                                <Button isPending={isPending}/>
                            </div>
                            <p className={'text-center text-dark mt-1'}>Akkountingiz bormi? <Link
                                className={"text-primary"} to="/login">Login</Link></p>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}
