import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import * as Yup from "yup";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label.tsx";
import Input from "../../components/form/input/InputField.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import {useParams} from "react-router";
import {useGetCourses} from "../../api/courses/useCourse.ts";
import {useEffect, useState} from "react";
import {useFormik} from "formik";
import Button from "../../components/ui/button/Button.tsx";
import {Course, Module} from "../../types/types.ts";
import Select from "../../components/form/Select.tsx";
import {getSelectOptions} from "../../utils/utils.ts";
import {useAddModule, useGetModuleById, useUpdateModule} from "../../api/module/useModule.ts";

export default function AddModule() {

    const {id} = useParams<{ id: string }>();
    const {data: courses} = useGetCourses()

    const {mutateAsync: addModule, isPending: isAdding} = useAddModule();
    const {mutateAsync: updateModule, isPending: isUpdating} = useUpdateModule();
    const {data} = useGetModuleById(id);

    const [initialValues, setInitialValues] = useState<Pick<Module, "name" | "description" | "courseId" | "orderIndex">>({
        name: "",
        description: "",
        courseId: "",
        orderIndex: null
    });


    useEffect(() => {
        if (data) {
            setInitialValues({
                name: data.name,
                description: data.description,
                courseId: data.courseId,
                orderIndex: data.orderIndex
            })
        }
    }, [data])


    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            name: Yup.string()
                .required("Nomini kiriting!"),
            courseId: Yup.string()
                .required("Kurs tanlang!"),
            orderIndex: Yup.number().required("Module navbatini tanlang!"),
        }),
        onSubmit: async () => {
            if (id) {
                await updateModule({...formik.values, id});
            } else {
                await addModule({...formik.values});
            }
        },
    });

    console.log(formik.values);
    return (
        <div>
            <PageMeta
                title="Module yaratish"
                description="Module yaratish"
            />
            <PageBreadcrumb pageTitle="Module yaratish"/>
            <ComponentCard>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                        return false;
                    }}>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <Label htmlFor="name">Module nomi</Label>
                            <Input type="text" formik={formik} name={'name'} placeholder={'Module nomi'}/>
                        </div>
                        <div>
                            <Label htmlFor="description">Tavsif</Label>
                            <Input type="text" formik={formik} name={'description'} placeholder={'Tavsif'}/>
                        </div>
                        <div>
                            <Label htmlFor="description">Module navbati</Label>
                            <Input type="number" formik={formik} name={'orderIndex'} placeholder={'Module navbati'}/>
                        </div>
                        <div>
                            <div className={'grid grid-cols-1'}>
                                <Label htmlFor="courseId">Kurslar</Label>
                                <Select options={getSelectOptions<Course>(courses)}
                                        placeholder='Kurs tanlang'
                                        defaultValue={formik.values.courseId}
                                        onChange={(value) => formik.setFieldValue("courseId", value)}/>
                                {formik?.errors.courseId && formik?.touched.courseId && (
                                    <p
                                        className={`mt-1.5 text-xs ${
                                            formik?.errors.courseId && formik.touched.courseId
                                            && "text-error-500"}`}
                                    >
                                        {formik?.errors.courseId as string}
                                    </p>
                                )}
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
