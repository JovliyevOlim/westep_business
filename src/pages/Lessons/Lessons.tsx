import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CommonTable from "../../components/tables/CommonTable/CommonTable.tsx";
import {useGetCourses} from "../../api/courses/useCourse.ts";
import {ColumnDef} from "@tanstack/react-table";
import Actions from "../../components/tables/Actions/Actions.tsx";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import {Course, Module} from "../../types/types.ts";
import {useGetModules} from "../../api/module/useModule.ts";
import {useState} from "react";
import Select from "../../components/form/Select.tsx";
import {getSelectOptions} from "../../utils/utils.ts";
import {useLocation} from "react-router";
import {useDeleteLesson, useGetLessons} from "../../api/lessons/useLesson.ts";
import Label from "../../components/form/Label.tsx";

export default function Lessons() {
    const location = useLocation();
    const {data: courses} = useGetCourses()
    const {mutate, isPending: isDeletePending} = useDeleteLesson()

    const [courseId, setCourseId] = useState<string>(location?.state?.courseId);
    const [moduleId, setModuleId] = useState<string>(location?.state?.moduleId);

    const {data: modules} = useGetModules(courseId)
    const {data, isPending, isError, error} = useGetLessons(moduleId)


    const handleDelete = async (id: string) => {
        await mutate(id)
    }

    const columns: ColumnDef<Course>[] = [
        {accessorKey: 'name', header: 'Nomi'},
        {accessorKey: 'description', header: 'Tavsif'},
        {accessorKey: 'orderIndex', header: 'Navbat'},
        {accessorKey: 'estimatedDuration', header: 'Davomiyligi'},
        {
            id: 'actions',
            header: '',
            cell: ({row}) => <Actions path={`/lessons/update/${courseId}/`} isPending={isDeletePending}
                                      key={row.original.id}
                                      deleteFunction={handleDelete}
                                      id={row.original.id}/>,
        },
    ]


    return (
        <>
            <PageMeta
                title="Darslar"
                description="Darslar"
            />
            <PageBreadcrumb pageTitle="Darslar" path={`/lessons/add`}/>
            <div className="space-y-6">
                <ComponentCard title="Darslar">
                    <div className={'grid grid-cols-2 gap-4'}>
                        <div>
                            <Label htmlFor="courseId">Kurslar</Label>
                            <Select options={getSelectOptions<Course>(courses)} placeholder={'Kurslar'}
                                    defaultValue={courseId} onChange={(value) => {
                                setCourseId(value)
                                setModuleId('')
                            }}/>
                        </div>
                        <div>
                            <Label htmlFor="moduleId">Modullar</Label>
                            <Select options={getSelectOptions<Module>(modules)} placeholder={'Modullar'}
                                    defaultValue={moduleId} onChange={(value) => setModuleId(value)}/>
                        </div>
                    </div>
                    {
                        courseId && moduleId ?
                            <CommonTable isError={isError} error={error} data={data} columns={columns}
                                         isPending={isPending}/>
                            : <p className={'text-center'}>Kurs va module tanlang!</p>
                    }
                </ComponentCard>
            </div>
        </>
    );
}
