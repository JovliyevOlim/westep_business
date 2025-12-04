import {useEffect, useRef, useState} from "react";
import CommonFileInput, {CommonFileInputRef} from "../form/input/CommonFileInput.tsx";
import {useUpdateCourse} from "../../api/courses/useCourse.ts";
import {useUser} from "../../api/auth/useAuth.ts";
import {Course} from "../../types/types.ts";
import {useFormik} from "formik";
import * as Yup from "yup";
import Button from "../ui/button/Button.tsx";
import {CloseIcon} from "../../icons";

function UpdateCourse({data, setOpenEdit}: { data: Course, setOpenEdit: () => void }) {

    const fileRef = useRef<CommonFileInputRef>(null);

    const {data: user} = useUser();
    const {mutateAsync: updateCourse, isSuccess, isPending} = useUpdateCourse();

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

    useEffect(() => {
        if (isSuccess) {
            formik.resetForm()
            setOpenEdit()
        }
    }, [isSuccess]);

    const handleSubmit = async (fileId?: string | null | undefined) => {
        if (fileId) {
            await updateCourse({...formik.values, id: data.id, businessId: user.businessId, attachmentId: fileId});
        }
    }


    return (
        <div className={'border border-blue-200 rounded-3xl overflow-hidden'}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                    return false;
                }}>
                <div>
                    <CommonFileInput attachmentId={formik.values?.attachmentId as string} ref={fileRef}
                                     accept="image/png, image/jpeg, image/jpg, image/webp"
                                     maxSizeMB={20}
                                     className={'flex flex-col items-center justify-center'}
                                     text='Rasm yuklash' handleSubmit={handleSubmit}/>
                </div>
                <div className={'p-4'}>
                    <input
                        type={'text'}
                        id={"name"}
                        name={"name"}
                        value={formik.values.name}
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
                        placeholder={'Kurs nomi'}
                        className={`outline-hidden w-full text-md font-medium ${formik?.errors.name && formik.touched.name
                        && "text-error-500"}`}
                    />
                    <input
                        type={'text'}
                        id={"description"}
                        name={"description"}
                        value={formik.values.description}
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
                        placeholder={'Tavsif'}
                        className={`outline-hidden w-full  text-xs font-light`}
                    />
                    <div className={'flex'}>
                        <Button type={"button"}
                                onClick={setOpenEdit}
                                className={'h-[40px] mt-3 bg-red-400 text-red-400 border border-red-400 hover:bg-red-500 rounded-full p-1 text-center'}>
                            <CloseIcon/>
                        </Button>
                        <Button type={"submit"}
                                isPending={isPending}
                                className={'w-full h-[40px] mt-3 bg-blue-50 text-blue-400 border border-blue-400 rounded-full p-1 text-center'}>
                            Tahrirlash
                        </Button>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default UpdateCourse;