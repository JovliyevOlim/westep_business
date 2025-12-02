import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CommonTable from "../../components/tables/CommonTable/CommonTable.tsx";
import {useGetCourses} from "../../api/courses/useCourse.ts";
import {ColumnDef} from "@tanstack/react-table";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import {Course} from "../../types/types.ts";
import {useGetModules} from "../../api/module/useModule.ts";
import {useState} from "react";
import Select from "../../components/form/Select.tsx";
import {getSelectOptions} from "../../utils/utils.ts";
import {useLocation} from "react-router";
import Label from "../../components/form/Label.tsx";

export default function Modules() {
    const location = useLocation();
    const {data: courses} = useGetCourses()

    const [courseId, setCourseId] = useState<string>(location?.state?.courseId);
    const {data, isPending, isError, error} = useGetModules(courseId)



    const columns: ColumnDef<Course>[] = [
        {accessorKey: 'name', header: 'Nomi'},
        {accessorKey: 'description', header: 'Tavsif'},
        {accessorKey: 'orderIndex', header: 'Navbat'},
        {
            id: 'actions',
            header: '',
        },
    ]


    return (
        <>
            <PageMeta
                title="Modullar"
                description="Modullar"
            />
            <PageBreadcrumb pageTitle="Modullar" path={'/modules/add'}/>
            <div className="space-y-6">
                <ComponentCard title="Modullar">
                    <div className={'grid grid-cols-1'}>
                        <Label htmlFor="course">Kurslar</Label>
                        <Select options={getSelectOptions<Course>(courses)} placeholder={'Kurslar'}
                                defaultValue={courseId}
                                onChange={(value) => setCourseId(value)}/>
                    </div>
                    {
                        courseId ?
                            <CommonTable isError={isError} error={error} data={data} columns={columns}
                                         isPending={isPending}/>
                            : <p className={'text-center'}>Kurs tanlang!</p>
                    }
                </ComponentCard>
            </div>
        </>
    );
}
