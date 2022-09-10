import { useTable, usePagination, useSortBy, useExpanded } from "react-table";
import {
    Table,
    NumberInput,
    ActionIcon,
    Group,
    Select,
    Text
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconSortDescending2, IconSortAscending2 } from "@tabler/icons";
import { useSearchParams } from "@remix-run/react";

const CustomTable = ({ columns, data, links }: any) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        state: { pageIndex, pageSize }
    } = useTable<any>({ columns, data, initialState: { pageIndex: 0, pageSize: 10 } }, useSortBy,
        usePagination)
    let [searchParams, setSearchParams] = useSearchParams();


    const nextPage = () => {
        setSearchParams({ page: links.currentPage + 1, limit: links.itemsPerPage })
    }

    const previousPage = () => {
        setSearchParams({ page: (+links.currentPage - 1).toString(), limit: links.itemsPerPage })
    }
    const gotoPage = (page: string) => {
        setSearchParams({ page: page, limit: links.itemsPerPage })
    }

    const setPageSize = (pageSize: string) => {
        setSearchParams({ page: links.currentPage, limit: pageSize })
    }

    const onSort = (col: string, direction: 'ASC' | 'DESC') => {
        setSearchParams({ sortCol: col, sortDirection: direction })
    }

    const handleSortClick = (column: any,) => {
        onSort(column.render("id") ?? 'id', searchParams.get('sortDirection') === 'ASC' ? 'DESC' : 'ASC')
    }

    const checkIsTableSorted = () => {
        const sortDirection = searchParams.get('sortDirection')
        return sortDirection === 'ASC' ? false : true
    }

    return (
        <div >
            <Table {...getTableProps()} highlightOnHover >
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()} style={{
                            backgroundColor: 'rgba(24, 100, 171, 0.85)',
                        }}>
                            {headerGroup.headers.map((column) => {
                                return (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="border border-[#373A40]"
                                        onClick={() => handleSortClick(column)}
                                    >
                                        <div className="inline-flex pt-3 pb-4">
                                            <span>{column.render("Header")}</span>
                                            <span
                                                style={{
                                                    marginBottom: "-.20em",
                                                    marginLeft: "8px",
                                                    marginTop: ".20em"
                                                }}
                                            >
                                                {(column.render("id") === searchParams.get('sortCol')) ? checkIsTableSorted() ? <IconSortDescending2 /> : <IconSortAscending2 /> : ''}
                                            </span>
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()} className='max-w-xs break-words pt-3 pb-4 border border-[#373A40]'>{cell.render("Cell")}</td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            {/* <Paper radius={0}> */}
            <Group className="mt-4">
                <ActionIcon
                    onClick={() => gotoPage('1')}
                    disabled={links.currentPage === 1}
                    variant="light"
                    color="blue"
                >
                    <IconChevronsLeft />

                </ActionIcon>
                <ActionIcon
                    onClick={() => previousPage()}
                    disabled={links.currentPage === 1}
                    variant="light"
                    color="blue"
                >
                    <IconChevronLeft />
                </ActionIcon>
                <ActionIcon
                    onClick={() => nextPage()}
                    disabled={links.currentPage >= links.totalPages}
                    variant="light"
                    color="blue"
                >
                    <IconChevronRight />
                </ActionIcon>
                <ActionIcon
                    onClick={() => gotoPage(links.totalPages)}
                    disabled={links.currentPage >= links.totalPages}
                    variant="light"
                    color="blue"
                >
                    <IconChevronsRight />
                </ActionIcon>
                <Text data-mantine-composable>
                    Page{" "}
                    <strong>
                        {links.currentPage} of {links.totalPages}
                    </strong>{" "}
                </Text>
                <Text data-mantine-composable>
                    | Go to page:{" "}
                    <NumberInput
                        defaultValue={pageIndex + 1}
                        onChange={(val) => {
                            const page = val ? Number(val) - 1 : 0;
                            gotoPage(page.toString());
                        }}
                        style={{ width: "100px", display: "inline-flex" }}
                    />
                </Text>
                <div data-mantine-composable>
                    <Select
                        value={links.itemsPerPage}
                        onChange={(value: string) => {
                            setPageSize(value);
                        }}
                        data={[5, 10].map((pageSize) => {
                            return { value: pageSize, label: "Show " + pageSize };
                        })}
                    />
                </div>
            </Group>
        </div >
    )

}

export default CustomTable