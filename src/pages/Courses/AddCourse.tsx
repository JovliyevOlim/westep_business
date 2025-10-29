import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import * as Yup from "yup";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label.tsx";
import Input from "../../components/form/input/InputField.tsx";
import ComponentCard from "../../components/common/ComponentCard.tsx";
import {useParams} from "react-router";
import {useAddCourse, useGetCourseById, useUpdateCourse} from "../../api/courses/useCourse.ts";
import {useEffect, useRef, useState} from "react";
import {useFormik} from "formik";
import Button from "../../components/ui/button/Button.tsx";
import {Course} from "../../types/types.ts";
import {useUser} from "../../api/auth/useAuth.ts";
import CommonFileInput, {CommonFileInputRef} from "../../components/form/input/CommonFileInput.tsx";

export default function AddCourse() {

    const {id} = useParams<{ id: string }>();
    const fileRef = useRef<CommonFileInputRef>(null);

    const {mutateAsync: addCourse, isPending: isAdding} = useAddCourse();
    const {data: user} = useUser();
    const {mutateAsync: updateCourse, isPending: isUpdating} = useUpdateCourse();
    const {data} = useGetCourseById(id);

    const [initialValues, setInitialValues] = useState<Pick<Course, "name" | "description" | "attachmentId">>({
        name: "",
        description: "",
        attachmentId: ""
    });


    useEffect(() => {
        if (data) {
            setInitialValues({
                name: data.name,
                description: data.description,
                attachmentId: data.attachmentId
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
        onSubmit: () => {
            if (fileRef.current) {
                fileRef.current.saveFile()
            }
        },
    });


    const handleSubmit = async (fileId?: string | null) => {
        if (fileId) {
            if (id) {
                await updateCourse({...formik.values, id, businessId: user.businessId, attachmentId: fileId});
            } else {
                await addCourse({...formik.values, businessId: user.businessId, attachmentId: fileId});
            }
        }
    }


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
                        <div>
                            <CommonFileInput attachmentId={formik.values?.attachmentId as string} ref={fileRef}
                                             accept="image/png, image/jpeg, image/jpg, image/webp"
                                             maxSizeMB={20}
                                             text='Rasm yuklash' handleSubmit={handleSubmit}/>
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
