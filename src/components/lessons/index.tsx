import Table from "../../ui/common/Table.tsx";
import {useAllCourse} from "../../api/course/useCourse.ts";

function Index() {

    const {data, isError, isPending} = useAllCourse()

    const columns = [{accessorKey: 'name', header: 'Name'}, {accessorKey: 'price', header: 'Price'}, {
        accessorKey: 'total',
        header: 'Total'
    },

        {
            accessorKey: 'total', header: '', cell: () => <i className="ti-trash remove-icon"></i>,
        }
    ]

    return (
        <div>
            <h2>Course</h2>
            {/*<Table data={data} columns={columns}/>*/}
        </div>
    );
}

export default Index;