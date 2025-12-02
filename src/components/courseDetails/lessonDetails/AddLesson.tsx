import {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router";
import {useAddLesson, useGetLessonById, useUpdateLesson} from "../../../api/lessons/useLesson.ts";
import {Lesson} from "../../../types/types.ts";
import {useFormik} from "formik";
import * as Yup from "yup";
import Input from "../../form/input/InputField.tsx";
import Button from "../../ui/button/Button.tsx";
import Vedio from "./Vedio.tsx";
import {useMobile} from "../../../hooks/useMobile.ts";

function AddLesson() {

    const {lessonId, id} = useParams<{ lessonId: string, id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMobile();

    const {data} = useGetLessonById(lessonId);

    console.log(data, 'data')

    const {mutateAsync: addLesson, isPending: isAdding} = useAddLesson();
    const {mutateAsync: updateLesson, isPending: isUpdating} = useUpdateLesson();


    const [initialValues, setInitialValues] = useState<Omit<Lesson, "id" | "createdAt">>({
        name: "",
        description: "",
        moduleId: location.state.moduleId,
        orderIndex: 0,
        estimatedDuration: 0,
        videoUrl: '',
    });


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
            videoUrl: Yup.string()
                .required("Vedio link kiriting!"),
        }),
        onSubmit: async () => {
            if (lessonId) {
                await updateLesson({body: {...formik.values, id: lessonId}});
                if (isMobile) {
                    navigate(`/courses/details/${id}`);
                }
            } else {
                await addLesson({body: {...formik.values}});
                if (isMobile) {
                    navigate(`/courses/details/${id}`);
                }
            }

        },
    });


    useEffect(() => {
        if (data && lessonId) {
            setInitialValues({
                name: data.name,
                description: data.description,
                moduleId: data.moduleId,
                orderIndex: data.orderIndex,
                estimatedDuration: data.estimatedDuration,
                videoUrl: data.vedioUrl
            })
        } else {
            formik.resetForm();
            setInitialValues(
                {
                    name: "",
                    description: "",
                    moduleId: location.state.moduleId,
                    orderIndex: 0,
                    estimatedDuration: 0,
                    videoUrl: '',
                }
            )
        }
    }, [data, location.pathname])


    return (
        <div className={'p-3'}>
            <div
                className={'border w-full flex items-center justify-center overflow-hidden aspect-video border-blue-200 bg-white rounded-[20px]'}>

                {
                    formik.values.videoUrl ? <Vedio videoUrl={formik.values.videoUrl}/>
                        : <p className={''}>Dars vediosi</p>
                }

            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                    return false;
                }}>
                <div className="grid grid-cols-1 gap-6 mt-5">
                    <Input type="text" formik={formik} name={'name'} label={'Dars nomi'} placeholder={'Dars nomi'}/>
                    <Input type="text" formik={formik} name={'description'} label={'Dars tavsifi'}
                           placeholder={'Tavsif'}/>
                    <Input type="number" formik={formik} name={'orderIndex'} label={'Dars navbati'}
                           placeholder={'Navbat'}/>
                    <Input type="number" formik={formik} name={'estimatedDuration'} label={'Dars davomiyligi'}
                           placeholder={'Davomiyligi'}/>
                    <Input type="text" formik={formik} name={'videoUrl'} label={'Dars video link'}
                           placeholder={'link'}/>
                </div>
                <div className={'mt-5 flex'}>
                    <Button type="submit" variant='outline' isPending={isAdding || isUpdating}
                            disabled={isAdding || isUpdating} className={'w-full border border-blue-600  rounded-full'}>
                        <p className={'text-blue-600 text-lg'}>
                            {
                                lessonId ? 'Darsni tahrirlash' : "Dars qo'shish"
                            }
                        </p>
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default AddLesson;