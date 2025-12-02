import {AddCircle, Play, Watch} from "../../icons";

function CourseAddCard() {
    return (
        <div
            className="hidden  rounded-2xl border flex-1 lg:flex flex-col justify-center border-blue-200 bg-white  px-10 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className={'flex justify-between items-center'}>
                <h3 className={'text-xl text-gray-800 font-medium'}>Yangi Dars qo'shish</h3>
            </div>
            <div className="grid grid-cols-2 items-center justify-between mt-1">
                <div className={'flex gap-2 justify-start items-center'}>
                    <div className={'flex items-center gap-1'}>
                        <Play width={24} height={24}/>
                        <p className=" text-gray-800 text-xs dark:text-white/90">
                            Darslar soni
                        </p>
                    </div>
                    <div className={'flex items-center gap-1'}>
                        <Watch width={24} height={24}/>
                        <p className="text-gray-800 text-xs dark:text-white/90">
                            Soat
                        </p>
                    </div>
                </div>
                <div>
                    <button className={'bg-blue-600 w-full flex justify-center gap-2 px-2 py-2 text-white text-md  rounded-full'}>
                        Dars qo'shish <AddCircle width={24} height={24}/>
                    </button>
                </div>
            </div>
        </div>);
}

export default CourseAddCard;