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
import {Course, Lesson, Module} from "../../types/types.ts";
import Select from "../../components/form/Select.tsx";
import {getSelectOptions} from "../../utils/utils.ts";
import {useGetModules} from "../../api/module/useModule.ts";
import {useAddLesson, useGetLessonById, useUpdateLesson} from "../../api/lessons/useLesson.ts";

export default function AddLesson() {

    const {id, courseId} = useParams<{ id: string, courseId: string }>();
    const {data: courses} = useGetCourses()
    const [course, setCourse] = useState<string>(courseId || "");
    const {data: modules} = useGetModules(course || courseId)


    const {mutateAsync: addLesson, isPending: isAdding} = useAddLesson();
    const {mutateAsync: updateLesson, isPending: isUpdating} = useUpdateLesson();
    const {data} = useGetLessonById(id);

    const [initialValues, setInitialValues] = useState<Pick<Lesson, "name" | "description" | "moduleId" | "orderIndex" | "estimatedDuration">>({
        name: "",
        description: "",
        moduleId: "",
        orderIndex: null,
        estimatedDuration: null
    });


    useEffect(() => {
        if (data) {
            setInitialValues({
                name: data.name,
                description: data.description,
                moduleId: data.moduleId,
                orderIndex: data.orderIndex,
                estimatedDuration: data.estimatedDuration
            })
        }
    }, [data])


    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            name: Yup.string()
                .required("Nomini kiriting!"),
            moduleId: Yup.string()
                .required("Kurs tanlang!"),
            orderIndex: Yup.number().required("Dars navbatini tanlang!"),
            estimatedDuration: Yup.number().required("Dars davomiyligini kiriting"),
        }),
        onSubmit: async () => {
            if (id) {
                await updateLesson({body: {...formik.values, id}, courseId: course});
            } else {
                await addLesson({body: {...formik.values}, courseId: course});
            }
        },
    });

    console.log(formik.values);
    return (
        <div>
            <PageMeta
                title="Dars yaratish"
                description="Dars yaratish"
            />
            <PageBreadcrumb pageTitle="Dars yaratish"/>
            <ComponentCard>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                        return false;
                    }}>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <Label htmlFor="name">Dars nomi</Label>
                            <Input type="text" formik={formik} name={'name'} placeholder={'Dars nomi'}/>
                        </div>
                        <div>
                            <Label htmlFor="description">Tavsif</Label>
                            <Input type="text" formik={formik} name={'description'} placeholder={'Tavsif'}/>
                        </div>
                        <div>
                            <Label htmlFor="description">Dars navbati</Label>
                            <Input type="number" formik={formik} name={'orderIndex'} placeholder={'Navbat'}/>
                        </div>
                        <div>
                            <Label htmlFor="estimatedDuration">Dars davomiyligi (soat)</Label>
                            <Input type="number" formik={formik} name={'estimatedDuration'}
                                   placeholder={'Davomiyligi'}/>
                        </div>
                        <div>
                            <Label htmlFor="courseId">Kurslar</Label>
                            <Select options={getSelectOptions<Course>(courses)}
                                    placeholder='Kurs tanlang'
                                    defaultValue={course}
                                    onChange={(value) => setCourse(value)}/>
                        </div>
                        <div>
                            <Label htmlFor="moduleId">Modullar</Label>
                            <Select options={getSelectOptions<Module>(modules)}
                                    placeholder='Kurs tanlang'
                                    defaultValue={formik.values.moduleId}
                                    onChange={(value) => formik.setFieldValue("moduleId", value)}/>
                            {formik?.errors.moduleId && formik?.touched.moduleId && (
                                <p
                                    className={`mt-1.5 text-xs ${
                                        formik?.errors.moduleId && formik.touched.moduleId
                                        && "text-error-500"}`}
                                >
                                    {formik?.errors.moduleId as string}
                                </p>
                            )}
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
