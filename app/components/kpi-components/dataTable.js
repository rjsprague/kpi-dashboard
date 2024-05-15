"use client"

import React, { useMemo, useState, useEffect } from 'react';
import Tooltip from '@/components/data-table/Tooltips';

import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
    ColumnDef,
    flexRender,
    Table,
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
    closersLeadsConnected: "Date"
};

const generateColumns = (selectedTableKey, data, columnHelper, invertedLeadSources, teamMembersMap, clients, showTooltip, hideTooltip) => {
    // console.log(invertedLeadSources)
    // console.log('selectedTableKey', selectedTableKey)

    return Object.keys(data[0]).map(key => {
        if (key !== 'podio_item_id' && key !== 'seller_id') {
            const dateColumnKey = dateColumnKeys[selectedTableKey];

            // console.log(key)


            return columnHelper.accessor(key, {
                id: `column_${key}`,
                header: key,
                // style: { width: `${key}.getSize()px`},
                cell: info => {
                    const cellValue = info.getValue();
                    let displayValue;

                    // if (info.column.columnDef.header === 'AM STL Median') {
                    //     console.log(info.getValue())
                    // }

                    // Your logic for determining the displayValue
                    if (info.column.columnDef.header === 'Lead Source') {
                        if (cellValue && Array.isArray(cellValue)) {
                            displayValue = invertedLeadSources[cellValue[0]];
                        } else {
                            displayValue = cellValue;
                        }
                    } else if (['Team Member', 'Lead Manager', 'Closer', 'Setter'].includes(info.column.columnDef.header)) {
                        if (cellValue && Array.isArray(cellValue)) {
                            displayValue = teamMembersMap[cellValue[0]] ? teamMembersMap[cellValue[0]] : "Inactive";
                        } else {
                            displayValue = cellValue;
                        }
                    } else if (info.column.columnDef.header === 'Client') {
                        displayValue = cellValue && Array.isArray(cellValue) ? cellValue[0] : cellValue;
                    } else if (Array.isArray(cellValue)) {
                        displayValue = cellValue.join(', ');
                    } else {
                        displayValue = typeof cellValue === 'string' || typeof cellValue === 'number' ? cellValue : stringifyObject(cellValue);
                    }

                    // Wrap the display value with TruncatedText
                    return (
                        <Tooltip
                            text={String(displayValue)}
                            showTooltip={showTooltip}
                            hideTooltip={hideTooltip}
                        />
                    );
                },
                enableSorting: true,
                sortingFn: key === dateColumnKey ? 'datetime' : key === 'AM STL Median' || key === 'Amount' || key === 'LM STL Median' ? 'alphanumeric' : 'basic',
                sortDescFirst: true,
            });
        }
    }).filter(Boolean);
};


const DataTable = ({ selectedTableKey, data, leadSources, departments, isProfessional, clients, apiName }) => {

    // console.log(isProfessional)

    // console.log('data', data)
    // console.log('leadSources', leadSources)
    // console.log('departments', departments)
    // console.log('selectedTableKey', selectedTableKey)
    // console.log('apiName', apiName)

    const [tableTitle, setTableTitle] = useState('');
    const [columns, setColumns] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [tooltipInfo, setTooltipInfo] = useState({
        show: false,
        text: '',
        top: 0,
        left: 0,
    });

    const showTooltip = (text, top, left) => {
        setTooltipInfo({
            show: true,
            text,
            top: top - 30,
            left: left - 30,
        });
    };

    const hideTooltip = () => {
        setTooltipInfo(prev => ({ ...prev, show: false }));
    };

    const invertedLeadSources = leadSources && Object.fromEntries(
        Object.entries(leadSources).map(([key, value]) => [value, key])
    );

    let teamMembersMap = departments ? Object.assign({}, ...Object.values(departments)) : null;
    const columnHelper = useMemo(() => createColumnHelper(), []);
    const newColumns = useMemo(() => columns, [columns]);



    useEffect(() => {
        if (data && data.length > 0) {
            const newColumns = generateColumns(selectedTableKey, data, columnHelper, invertedLeadSources, teamMembersMap, clients, showTooltip, hideTooltip);
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
    }, [data, showTooltip, hideTooltip]);

    useEffect(() => {
        if (apiName && selectedTableKey === "teamKpis") {
            setTableTitle(apiName);
        } else if (selectedTableKey) {
            setTableTitle(formatWords(selectedTableKey));
        }
    }, [selectedTableKey, apiName]);

    const table = useReactTable({
        data: data,
        columns: newColumns,
        defaultColumn: {
            size: 125, //starting column size
            minSize: 50, //enforced during column resizing
            maxSize: 500, //enforced during column resizing
        },
        state: { sorting },
        columnResizeMode: 'onChange',
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        // initialState: {
        //     sorting: [
        //       {
        //         id: 'name',
        //         desc: true,
        //       },
        //     ],
        //   },
    });

    // console.log(table.getState().sorting)

    if (data.length === 0 || isProfessional) {
        return (
            <div className="flex flex-col max-w-sm px-10 m-4 w-100 h-1/4">
                <h1 className="text-xl font-bold text-center text-gray-100">{selectedTableKey && formatWords(selectedTableKey)}</h1>
                <div className="flex items-center justify-center w-full h-full py-40 mt-4 border">
                    <h2 className="text-lg font-semibold text-center text-gray-100">No Data</h2>
                </div>
            </div>
        )
    }

    const columnSizeVars = React.useMemo(() => {
        const headers = table.getFlatHeaders()
        const colSizes = {}
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i]
            colSizes[`--header-${header.id}-size`] = header.getSize()
            colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
        }
        return colSizes
    }, [table.getState().columnSizingInfo])

    return (
        <div className="flex flex-col items-center mt-4">

            {tooltipInfo.show && (
                <div
                    className="fixed z-50 px-2 py-1 text-sm text-white bg-gray-700 rounded"
                    style={{ top: tooltipInfo.top + 'px', left: tooltipInfo.left + 'px' }}
                >
                    {tooltipInfo.text}
                </div>
            )}

            <div className="flex h-auto px-2 py-4 overflow-auto max-h-screen8">
                <div className="table w-full h-auto overflow-y-scroll max-h-screen8">
                    <div className='flex justify-center mb-2 text-xl font-semibold'>{tableTitle} ({data.length})</div>
                    {/* <pre style={{ minHeight: '10rem' }}>
                        {JSON.stringify(
                            {
                                columnSizing: table.getState().columnSizing,
                            },
                            null,
                            2
                        )}
                    </pre> */}
                    <div
                        {...{
                            className: 'divTable',
                            style: {
                                ...columnSizeVars, //Define column sizes on the <table> element
                                width: table.getTotalSize(),
                            },
                        }}
                    >
                        <div className="">
                            {table.getHeaderGroups().map((headerGroup, i) => (
                                <div key={i} className="uppercase bg-blue-700 border-l border-gray-200 tr">
                                    {headerGroup.headers.map((header, j) => (
                                        <>
                                            <div
                                                {...{
                                                    key: header.id,
                                                    className: 'th truncate cursor-pointer',
                                                    style: { width: `${header.getSize()}px` },
                                                }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    :

                                                    // flexRender(
                                                    //     header.column.columnDef.header,
                                                    //     header.getContext()
                                                    // )
                                                    <div
                                                        className={
                                                            header.column.getCanSort()
                                                                ? 'cursor-pointer select-none'
                                                                : ''
                                                        }
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        title={
                                                            header.column.getCanSort()
                                                                ? header.column.getNextSortingOrder() === 'asc'
                                                                    ? 'Sort ascending'
                                                                    : header.column.getNextSortingOrder() === 'desc'
                                                                        ? 'Sort descending'
                                                                        : 'Clear sort'
                                                                : undefined
                                                        }
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            asc: ' 🔼',
                                                            desc: ' 🔽',
                                                        }[header.column.getIsSorted()] ?? null}
                                                    </div>

                                                }
                                                <div
                                                    {...{
                                                        onDoubleClick: () => header.column.resetSize(),
                                                        onMouseDown: header.getResizeHandler(),
                                                        onTouchStart: header.getResizeHandler(),
                                                        className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''
                                                            }`,
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        {data && table.getRowModel().rows && table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row, i) => (
                                <div>
                                    <a
                                        key={row.original.podio_item_id}
                                        href={`https://podio.com/x/y/item/${row.original.podio_item_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`tr border-l border-gray-200 ${i % 2 === 0 ? 'bg-blue-400' : 'bg-blue-500'}`}
                                    >
                                        {row.getVisibleCells().map((cell, j) => (
                                            <div
                                                key={j}
                                                className="td"
                                                style={{ width: `${cell.column.getSize()}px` }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        ))}
                                    </a>
                                </div>
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
                        className="w-12 p-1 text-center text-black border rounded"
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
    )
};

export default DataTable;