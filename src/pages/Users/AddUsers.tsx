import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import * as Yup from "yup";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label.tsx";
import Input from "../../components/form/input/InputField.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import {useState} from "react";
import {useFormik} from "formik";
import Button from "../../components/ui/button/Button.tsx";
import Select from "../../components/form/Select.tsx";
import {useAddBusinessAssistant, useAddBusinessTeacher} from "../../api/businessUser/useBusinessUser.ts";
import {useUser} from "../../api/auth/useAuth.ts";

export default function AddUsers() {

    const {data: user} = useUser()

    const {mutateAsync: addTeacher, isPending: isAdding} = useAddBusinessTeacher();
    const {mutateAsync: addAssistant, isPending: isUpdating} = useAddBusinessAssistant();

    const [initialValues] = useState<{ phone: string }>({
        phone: "",
    });
    const [userStatus, setUserStatus] = useState<string>("TEACHER");


    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            phone: Yup.string().length(12, "Telefon raqami xato kiritildi!")
                .required("Telefon raqamni kiriting!"),
        }),
        onSubmit: async (values) => {
            if (userStatus === "TEACHER") {
                await addTeacher({
                    businessId: user.businessId,
                    ownerId: user.id,
                    teacherPhone: values.phone
                });
            } else {
                await addAssistant(
                    {
                        businessId: user.businessId,
                        ownerId: user.id,
                        assistantPhone: values.phone
                    }
                );
            }
        },
    });

    console.log(formik.values);
    return (
        <div>
            <PageMeta
                title="Xodim qo'shish"
                description="Xodim qo'shish"
            />
            <PageBreadcrumb pageTitle="Xodim qo'shish"/>
            <ComponentCard>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                        return false;
                    }}>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <Label htmlFor="phone">Xodim telefon raqami</Label>
                            <Input type="text" formik={formik} name={'phone'} placeholder={'Telefon raqam'}/>
                        </div>
                        <div>
                            <div className={'grid grid-cols-1'}>
                                <Label htmlFor="courseId">Xodim turi</Label>
                                <Select options={
                                    [
                                        {value: 'TEACHER', label: "O'qituvchi"},
                                        {value: 'ASSISTANT', label: "Assistant"},
                                    ]
                                }
                                        placeholder='Xodim turi'
                                        defaultValue={userStatus}
                                        onChange={(value) => setUserStatus(value)}/>
                            </div>
                        </div>
                    </div>
                    <div className={'mt-3 flex gap-6 justify-end'}>
                        <Button type="submit" variant='primary' isPending={isAdding || isUpdating}
                                disabled={isAdding || isUpdating}>
                            Saqlash
                        </Button>
                    </div>
                </form>

            </ComponentCard>
        </div>
    );
}
