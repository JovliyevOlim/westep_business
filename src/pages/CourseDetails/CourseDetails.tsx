import PageMeta from "../../components/common/PageMeta.tsx";
import CourseModulesBar from "../../components/courseDetails/CourseModulesBar.tsx";
import {useParams} from "react-router";
import LessonDetails from "../../components/courseDetails/lessonDetails/LessonDetails.tsx";

function CourseDetails() {
    const params = useParams();


    return (
        <>
            <PageMeta
                title="Kurs ma'lumotlari"
                description="Kurs ma'lumotlari"
            />
            <div className={'flex h-full'}>
                <div className={'w-full lg:w-[330px] overflow-scroll custom-scrollbar shadow bg-white lg:bg-[#F8FBFF] p-3 md:p-5'}>
                    <CourseModulesBar id={params?.id}/>
                </div>
                <div
                    className={`hidden lg:block flex-1 transition-all duration-300 ease-in-out`}>
                    <div className="p-5">
                        <LessonDetails/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CourseDetails;