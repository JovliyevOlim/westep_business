import PageMeta from "../../components/common/PageMeta";
import MainPageBar from "../../components/mainpage/MainPageBar.tsx";
import MainPageStatistic from "../../components/mainpage/MainPageStatistic.tsx";
import Courses from "../../components/courses/Courses.tsx";


export default function MainPage() {
    return (
        <>
            <PageMeta
                title="Asosiy sahifa"
                description="Asosiy sahifa"
            />
            <div className={'flex'}>
                <div className={'w-[350px] hidden lg:block shadow bg-white p-5'}>
                    <MainPageBar/>
                </div>
                <div
                    className={`flex-1 transition-all duration-300 ease-in-out`}>
                    <div className="grid grid-cols-12 gap-4 md:gap-6 p-3">
                        <div className="col-span-12">
                            <MainPageStatistic/>
                        </div>
                        <div className="col-span-12">
                            <Courses/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
