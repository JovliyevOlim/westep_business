import {Lesson} from "../../types/types.ts";
import {EditIcon, TrashBinIcon} from "../../icons";
import {Link} from "react-router";
import {useState} from "react";
import {useDeleteLesson} from "../../api/lessons/useLesson.ts";
import DeleteModal from "../common/DeleteModal.tsx";

function LessonCard({lesson, courseId}: { lesson: Lesson, courseId: string }) {


    const {mutate,isPending} = useDeleteLesson()

    const [deleteModal, setDeleteModal] = useState(false);

    const handleDelete = async () => {
        await mutate(lesson.id)
        setDeleteModal(false)
    }

    const openDeleteModal = () => {
        setDeleteModal(true);
    };


    return (
        <>
            <div className={'border border-blue-200 bg-white rounded-[20px] p-[9px] py-[6px] overflow-hidden'}>
                <div className={'flex items-center justify-between'}>
                    <div className={'flex items-center gap-2 justify-start ms-[-14px]'}>
                        <span className={'size-[14px] bg-blue-600 rounded-full'}></span>
                        <p className={'text-sm leading-normal font-normal p-0 m-0  break-all w-[100%]'}>
                            {lesson.name}
                        </p>
                    </div>

                    <div className={'flex items-center gap-2 justify-between'}>
                        <Link className={'hidden lg:block'} to={`/courses/details/${courseId}/updateLesson/${lesson.id}`}
                              state={{moduleId: lesson.moduleId}}>
                            <EditIcon width={16} height={16} className='text-gray-400'/>
                        </Link>
                        <Link className={'lg:hidden'}  to={`/courses/updateLesson/${courseId}/lesson/${lesson.id}`}
                              state={{moduleId: lesson.moduleId}}>
                            <EditIcon width={16} height={16} className='text-gray-400'/>
                        </Link>
                        <TrashBinIcon onClick={(e)=>{
                            e.stopPropagation()
                            openDeleteModal()
                        }} width={16} height={16} className='text-gray-400 cursor-pointer'/>
                    </div>
                </div>
            </div>
            <DeleteModal
                isPending={isPending}
                setOpen={setDeleteModal}
                open={deleteModal}
                deleteFunction={handleDelete}
            />
        </>

    );
}

export default LessonCard;