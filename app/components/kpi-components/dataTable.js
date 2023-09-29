"use client"

import React, { useMemo, useState, useEffect } from 'react';
import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table';

function stringifyObject(obj) {
    let output = '';

    for (let key in obj) {
        let value = obj[key];

        if (Array.isArray(value)) {
            output += key + ': ' + value.join(', ') + '\n';
        } else if (typeof value === 'object' && value !== null) {
            if (value.start) { // Special handling for date object
                output += key + ': ' + value.start + '\n';
            } else {
                output += key + ': ' + stringifyObject(value) + '\n';
            }
        } else {
            output += key + ': ' + value + '\n';
        }
    }

    return output;
}

function formatWords(str) {
    if (!str) return '';
    // Insert a space before all found uppercase letters and trim extra spaces.
    let result = str.replace(/([A-Z])/g, ' $1').trim();

    // Capitalize the first character of the sentence
    result = result.charAt(0).toUpperCase() + result.slice(1);

    return result;
}

const dateColumnKeys = {
    marketingExpenses: 'Week',
    leads: 'Date',
    leadConnections: 'Date Connected',
    triageCalls: 'Date SLS Submitted',
    qualifiedTriageCalls: 'Date SLS Submitted',
    triageApproval: 'Date SLS Submitted',
    dealAnalysis: 'Date DA Submitted',
    perfectPresentations: 'Date AS Submitted',
    contracts: 'Date Contracted',
    acquisitions: 'Date Acquired',
    deals: 'Date Deal Sold',
    projectedProfit: 'Date Acquired',
    pendingDeals: 'Date Acquired',
    profit: 'Date Deal Sold',
    lmStlMedian: "Date",
    amStlMedian: "Date",
    daStlMedian: "Date",
    bigChecks: "Date",
    closersAdSpend: "Week",
    closersLeadsCreated: "Date",
    closersPayments: "Date",
    closersLeadsSetPrequalified: "Date",
    closersBookings: "Date",
    closersAppointments: "Date",
    closersDcShowed: "Date Submitted",
    closersDcOffers: "Date Submitted",
    closersDcClosed: "Date Submitted",
};

const generateColumns = (selectedTableKey, data, columnHelper, invertedLeadSources, teamMembersMap) => {

    return Object.keys(data[0]).map(key => {
        if (key !== 'podio_item_id') {
            const dateColumnKey = dateColumnKeys[selectedTableKey];

            return columnHelper.accessor(key, {
                id: `column_${key}`,
                header: key,
                cell: info => {
                    const cellValue = info.getValue();
                    // If the cell is a leadSource cell, replace the cellValue with the corresponding name
                    if (info.column.columnDef.header === 'Lead Source') {
                        if (cellValue && Array.isArray(cellValue)) {
                            return invertedLeadSources[cellValue[0]];
                        } else {
                            return cellValue;
                        }
                    } else if (info.column.columnDef.header === 'Team Member' || info.column.columnDef.header === 'Lead Manager' || info.column.columnDef.header === 'Closer') {
                        if (cellValue && Array.isArray(cellValue)) {
                            return teamMembersMap[cellValue[0]];
                        } else {
                            return cellValue;
                        }
                    }

                    if (Array.isArray(cellValue)) {
                        return cellValue.join(', ');
                    } else if (typeof cellValue === 'string' || typeof cellValue === 'number') {
                        return cellValue;
                    } else {
                        return stringifyObject(cellValue);
                    }
                },
                enableSorting: true,
                sortingFn: key === dateColumnKey ? 'datetime' : 'alphanumeric',
                sortDescFirst: true,
            });
        }
    }).filter(Boolean);
}

const DataTable = ({ selectedTableKey, data, leadSources, departments, isProfessional }) => {

    console.log(isProfessional)

    console.log('data', data)
    console.log('leadSources', leadSources)
    console.log('departments', departments)
    console.log('selectedTableKey', selectedTableKey)

    const [tableTitle, setTableTitle] = useState('');
    const [columns, setColumns] = useState([]);
    const [sorting, setSorting] = useState([]);

    const invertedLeadSources = leadSources && Object.fromEntries(
        Object.entries(leadSources).map(([key, value]) => [value, key])
    );

    let teamMembersMap = departments ? Object.assign({}, ...Object.values(departments)) : null;
    const columnHelper = useMemo(() => createColumnHelper(), []);
    const newColumns = useMemo(() => columns, [columns]);

    if (data.length === 0 && isProfessional) {
        return (
            <div className="flex flex-col items-center justify-center w-1/3 m-4 h-1/4">
                <h1 className="text-xl font-bold text-center text-gray-100">{selectedTableKey && formatWords(selectedTableKey)}</h1>
                <div className="flex items-center justify-center w-full h-full py-40 mt-4 border">
                    <h2 className="text-lg font-semibold text-center text-gray-100">No Data</h2>
                </div>
            </div>
        )
    }

    useEffect(() => {
        if (data) {
            const newColumns = generateColumns(selectedTableKey, data, columnHelper, invertedLeadSources, teamMembersMap);
            setColumns(prevColumns => {
                // Only update columns if they have changed
                const prevColumnIds = new Set(prevColumns.map(column => column.id));
                const newColumnIds = new Set(newColumns.map(column => column.id));
                if (newColumns.length !== prevColumns.length || [...prevColumnIds].some(id => !newColumnIds.has(id))) {
                    return newColumns;
                }
                return prevColumns;
            });
        }
    }, [data]);

    useEffect(() => {
        if (selectedTableKey) {
            setTableTitle(formatWords(selectedTableKey));
        }
    }, [selectedTableKey]);

    const table = useReactTable({
        data: data,
        columns: newColumns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="flex flex-col items-center mt-4">
            <div className="flex h-auto px-2 py-4 overflow-auto max-h-screen9">
                <div className="table w-full h-auto overflow-y-scroll max-h-screen9">
                    <div className='flex justify-center mb-2 text-xl font-semibold'>{tableTitle} ({data.length})</div>
                    <div>
                        {table.getHeaderGroups().map((headerGroup, i) => (
                            <div key={i} className="uppercase bg-blue-700 border-l border-gray-200 tr">
                                {headerGroup.headers.map((header, j) => (
                                    <div
                                        key={j}
                                        className={header.column.getCanSort() ? "th cursor-pointer" : "th"}
                                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                    >
                                        {{
                                            asc: '🔼 ',
                                            desc: '🔽 ',
                                        }[header.column.getIsSorted()] ?? null}
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div>
                        {data && table.getRowModel().rows && table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row, i) => (
                                <a
                                    key={row.original.podio_item_id}
                                    href={`https://podio.com/x/y/item/${row.original.podio_item_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`tr border-l border-gray-200 tr ${i % 2 === 0 ? 'bg-blue-400' : 'bg-blue-500'}`}
                                >
                                    {row.getVisibleCells().map((cell, j) => (
                                        <div key={j} className="td">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </div>
                                    ))}
                                </a>
                            ))
                        ) : (
                            <p className='py-10 text-xl font-bold text-center'>No Data</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-2" />
            <div className="flex items-center gap-2">
                <button
                    className="p-1 border rounded"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="p-1 border rounded"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="p-1 border rounded"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="p-1 border rounded"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1 text-white">
                    | Go to page:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="w-16 p-1 text-black border rounded"
                    />
                </span>
                <select
                    className="text-black"
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div>{table.getRowModel().rows.length} Rows</div>
        </div>
    );
};

export default DataTable;