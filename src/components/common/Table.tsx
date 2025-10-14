import {useReactTable, getCoreRowModel, flexRender, getPaginationRowModel} from '@tanstack/react-table'
import {useState} from "react";

const data = [
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada10', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada20', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada', price: '$80', total: '$220'},
    {id: 1, name: 'Ada30', price: '$80', total: '$220'},
]
const columns = [{accessorKey: 'name', header: 'Name'}, {accessorKey: 'price', header: 'Price'}, {
    accessorKey: 'total',
    header: 'Total'
},

    {
        accessorKey: 'total', header: '', cell: () => <i className="ti-trash remove-icon"></i>,
    }
]

function Table() {


    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 10, //default page size
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination
        }
    })


    console.log(pagination)

    const {getPageOptions, getState, setPageIndex, getCanPreviousPage, getCanNextPage, nextPage, previousPage} = table

    const currentPage = getState().pagination.pageIndex + 1

    console.log(currentPage,'currentPage',currentPage)

    return (
        <>
            <div className="shopping-cart">
                <div className="row">
                    <div className="col-12 wow fadeIn table-responsive">
                        <table className="table shopping-summery responsive-table woocommerce-cart-form">
                            <thead>
                            {table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id} className="main-hading">
                                    {hg.headers.map((header) => (
                                        <th key={header.id}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-12 text-center">
                        <div className="post_pagination">
                            <ul>
                                <li><a onClick={() => getCanPreviousPage() && previousPage()}
                                       className={!getCanPreviousPage() ? "disabled" : ""}
                                ><i className="fa-solid fa-arrow-left-long"></i></a></li>
                                {getPageOptions().map((item: any, key: number) => (
                                    <li key={key}  className={getState().pagination.pageIndex === item ? "active" : ""}>
                                        <a href="#"

                                           onClick={() => setPageIndex(item)}
                                        >{item + 1}</a>
                                    </li>
                                ))}
                                <li><a href="#"
                                       onClick={() => getCanNextPage() && nextPage()}
                                       className={!getCanNextPage() ? "disabled" : ""}><
                                    i className="fa-solid fa-arrow-right-long"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Table;