import {Play, Watch} from "../../icons";
import {useGetModules} from "../../api/module/useModule.ts";
import ModuleCard from "./ModuleCard.tsx";
import {Module} from "../../types/types.ts";
import AddModule from "./AddModule.tsx";

function CourseModulesBar({id}: { id: string|undefined }) {


    const {data} = useGetModules(id)

    return (
        <div>
            <p className={'text-md text-gray-400 '}>Modul</p>
            <h3 className={'text-lg font-medium text-gray-800'}>Darslar</h3>
            <div className={'flex gap-2 mt-3 justify-start items-center'}>
                <div className={'flex items-center gap-1'}>
                    <Play width={24} height={24}/>
                    <p className=" text-gray-800 text-sm dark:text-white/90">
                        Darslar soni
                    </p>
                </div>
                <div className={'flex items-center gap-1'}>
                    <Watch width={24} height={24}/>
                    <p className="text-gray-800 text-sm dark:text-white/90">
                        Soat
                    </p>
                </div>
            </div>
            <div className={'mt-10 flex justify-center flex-col gap-3'}>
                {
                    data?.map((item: Module, index: number) =>
                        <ModuleCard module={item} key={index}/>
                    )
                }
                <AddModule courseId={id}/>
            </div>
        </div>
    );
}

export default CourseModulesBar;