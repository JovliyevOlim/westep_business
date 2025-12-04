import StatisticCard from "./StatisticCard.tsx";
import {Book, Star} from "../../icons";
import CourseAddCard from "./CourseAddCard.tsx";


const items = [
    {
        icon: <Book className="text-blue-600 size-6 dark:text-white/90"/>,
        title: 'Jami',
        result: '3',
        body: 'Davom etayotgan kurslar'
    },
    {
        icon: <Star className="text-blue-600 size-6 dark:text-white/90"/>,
        title: 'Hozirgi',
        result: '80%',
        body: 'Umumiy ball'
    }
]

function MainPageStatistic() {
    return (
        <div className="grid xl:grid-cols-2 md:grid-cols-1  gap-4 items-stretch">
            <div className={'lg:hidden'}>
                <h1 className={'text-3xl'}>Salom Ustoz!</h1>
                <p className={'text-sm text-gray-300'}>Yangiliklarni koshish va o’quvchilarizi tekshiring</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 md:gap-6">
                {
                    items.map((item,index) =>
                        <StatisticCard item={item} key={index} />)
                }
            </div>
            <CourseAddCard/>
        </div>

    );
}

export default MainPageStatistic;