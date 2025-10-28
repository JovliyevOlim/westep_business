import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CommonTable from "../../components/tables/CommonTable/CommonTable.tsx";
import {useDeleteCourse, useGetCourses} from "../../api/courses/useCourse.ts";
import {ColumnDef} from "@tanstack/react-table";
import Actions from "../../components/tables/Actions/Actions.tsx";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import {Course} from "../../types/types.ts";

export default function Courses() {
    const {data, isPending, isError, error} = useGetCourses()
    const {mutate, isPending: isDeletePending} = useDeleteCourse()

    const handleDelete = async (id: string) => {
        await mutate(id)
    }

    const columns: ColumnDef<Course>[] = [{accessorKey: 'name', header: 'Nomi'},
        {
            id: 'actions',
            header: '',
            cell: ({row}) => <Actions isPending={isDeletePending} key={row.original.id} deleteFunction={handleDelete}
                                      id={row.original.id}/>,
        },
    ]

    return (
        <>
            <PageMeta
                title="Kurslar"
                description="Kurslar"
            />
            <PageBreadcrumb pageTitle="Kurslar" path={'/courses/add'}/>
            <div className="space-y-6">
                <ComponentCard title="Kurslar">
                    <CommonTable isError={isError} error={error} data={data} columns={columns} isPending={isPending}/>
                </ComponentCard>
            </div>
        </>
    );
}
