import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import * as Yup from "yup";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label.tsx";
import Input from "../../components/form/input/InputField.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import {useParams} from "react-router";
import {useAddCourse, useGetCourseById, useUpdateCourse} from "../../api/courses/useCourse.ts";
import {useEffect, useState} from "react";
import {useFormik} from "formik";
import Button from "../../components/ui/button/Button.tsx";
import {Course} from "../../types/types.ts";
import {useUser} from "../../api/auth/useAuth.ts";

export default function AddCourse() {

    const {id} = useParams<{ id: string }>();
    const {mutateAsync, isPending: isAdding} = useAddCourse();
    const {data: user} = useUser();
    const {mutateAsync: updateCourse, isPending: isUpdating} = useUpdateCourse();
    const {data} = useGetCourseById(id);

    const [initialValues, setInitialValues] = useState<Pick<Course, "name" | "description">>({
        name: "",
        description: ""
    });

    useEffect(() => {
        if (data) {
            setInitialValues({
                name: data.name,
                description: data.description,
            })
        }
    }, [data])


    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            name: Yup.string()
                .required("Nomini kiriting!"),
        }),
        onSubmit: async (values) => {
            console.log(values);
            if (id) {
                await updateCourse({...values, id, businessId: user.businessId});
            } else {
                await mutateAsync({...values, businessId: user.businessId});
            }
        },
    });

    console.log(formik);

    return (
        <div>
            <PageMeta
                title="Kurs yaratish"
                description="Kurs yaratish"
            />
            <PageBreadcrumb pageTitle="Kurs yaratish"/>
            <ComponentCard>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                        return false;
                    }}>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <Label htmlFor="name">Kurs nomi</Label>
                            <Input type="text" formik={formik} name={'name'} placeholder={'Kurs nomi'}/>
                        </div>
                        <div>
                            <Label htmlFor="description">Tavsif</Label>
                            <Input type="text" formik={formik} name={'description'} placeholder={'Tavsif'}/>
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
