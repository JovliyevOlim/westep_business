import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CommonTable from "../../components/tables/CommonTable/CommonTable.tsx";
import {ColumnDef} from "@tanstack/react-table";
import Actions from "../../components/tables/Actions/Actions.tsx";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import {Course} from "../../types/types.ts";
import {useDeleteModule} from "../../api/module/useModule.ts";
import {useGetUsers} from "../../api/businessUser/useBusinessUser.ts";
import {useUser} from "../../api/auth/useAuth.ts";

export default function Users() {
    const {mutate, isPending: isDeletePending} = useDeleteModule()
    const {data: user} = useUser()
    const {data, isPending, isError, error} = useGetUsers(user.businessId)


    const handleDelete = async (id: string) => {
        await mutate({id})
    }

    const columns: ColumnDef<Course>[] = [
        {accessorKey: 'name', header: 'Nomi'},
        {accessorKey: 'description', header: 'Tavsif'},
        {accessorKey: 'orderIndex', header: 'Navbat'},
        {
            id: 'actions',
            header: '',
            cell: ({row}) => <Actions path={'/modules/update/'} isPending={isDeletePending} key={row.original.id}
                                      deleteFunction={handleDelete}
                                      id={row.original.id}/>,
        },
    ]


    return (
        <>
            <PageMeta
                title="Xodimlar"
                description="Xodimlar"
            />
            <PageBreadcrumb pageTitle="Xodimlar" path={'/users/add'}/>
            <div className="space-y-6">
                <ComponentCard title="Xodimlar">
                    <CommonTable isError={isError} error={error} data={data} columns={columns}
                                 isPending={isPending}/>

                </ComponentCard>
            </div>
        </>
    );
}
