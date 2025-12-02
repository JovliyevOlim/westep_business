import {useGetLessons} from "../../api/lessons/useLesson.ts";
import {Lesson} from "../../types/types.ts";
import LessonCard from "./LessonCard.tsx";
import {AddCircle} from "../../icons";
import {Link} from "react-router";

function Lessons({id, openLesson, courseId}: { id: string, openLesson: boolean, courseId: string }) {
    const {data, isPending, isError, error} = useGetLessons(id, openLesson)

    if (!openLesson) return null;
    if (isPending) return <p>Loading...</p>;
    if (isError) return <p>Error: {error.message}</p>;


    return (
        <div onClick={(e) => {e.stopPropagation()}}>
            <div className={'flex flex-col justify-center gap-2'}>
                {
                    data.map((lesson: Lesson) =>
                        <LessonCard key={lesson.id} lesson={lesson} courseId={courseId}/>
                    )
                }
            </div>
            <Link className={'hidden lg:flex'} to={`/courses/details/${courseId}/addLesson`} state={{moduleId: id}}>
                <div
                    className={'mt-5 flex items-center justify-center gap-2 bg-white text-md border border-blue-600 text-blue-600 w-full p-[7px] rounded-full'}>
                    Dars qo'shish <AddCircle width={24} height={24}/>
                </div>
            </Link>
            <Link className={'lg:hidden'} to={`/courses/addLesson/${courseId}`} state={{moduleId: id}}>
                <div
                    className={'mt-5 flex items-center justify-center gap-2 bg-blue-600 text-md text-white w-full p-[7px] rounded-full'}>
                    Dars qo'shish <AddCircle width={24} height={24}/>
                </div>
            </Link>
        </div>
    );
}

export default Lessons;