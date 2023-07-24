import React, { useMemo, Fragment, useState, useEffect } from 'react';
import { createColumnHelper, getCoreRowModel, useReactTable, flexRender, getSortedRowModel } from '@tanstack/react-table';
import { Listbox, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';


function stringifyObject(obj) {
    let output = '';

    for (let key in obj) {
        let value = obj[key];

        if (Array.isArray(value)) {
            output += key + ': ' + value.join(', ') + '\n';
        } else if (typeof value === 'object' && value !== null) {
            if (value.start_utc) { // Special handling for date object
                output += key + ': ' + value.start_utc + '\n';
            } else {
                output += key + ': ' + stringifyObject(value) + '\n';
            }
        } else {
            output += key + ': ' + value + '\n';
        }
    }

    return output;
}

function CheckIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function formatWords(str) {
    // Insert a space before all found uppercase letters and trim extra spaces.
    let result = str.replace(/([A-Z])/g, ' $1').trim();

    // Capitalize the first character of the sentence
    result = result.charAt(0).toUpperCase() + result.slice(1);

    return result;
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

const DataTable = ({ data, leadSources }) => {

    const [selectedTableKey, setSelectedTableKey] = useState(Object.keys(data)[0]);
    const [columns, setColumns] = useState([]);
    const [sorting, setSorting] = useState([]);

    const invertedLeadSources = leadSources && Object.fromEntries(
        Object.entries(leadSources).map(([key, value]) => [value, key])
      );

    useEffect(() => {
        const selectedTable = data[selectedTableKey];

        if (selectedTable && selectedTable.length > 0) {
            const newColumns = Object.keys(selectedTable[0]).map(key => {
                if (key !== 'podio_item_id') {
                    return {
                        Header: key,
                        accessor: key
                    };
                }
            }).filter(Boolean);

            setColumns(newColumns);
        }

    }, [data, selectedTableKey]);

    useEffect(() => {
        handleTableSelect(selectedTableKey)
    }, [])

    const handleTableSelect = (key) => {
        setSelectedTableKey(key);
        const selectedTable = data[key];

        if (selectedTable && selectedTable.length > 0) {
            const newColumns = Object.keys(selectedTable[0]).map(key => {
                if (key !== 'podio_item_id') {
                    return {
                        Header: key,
                        accessor: key
                    };
                }
            }).filter(Boolean); // This filters out any undefined values that may have been introduced by the filter on podio_item_id
            setColumns(newColumns);
        }
    }

    const columnHelper = createColumnHelper();

    const newColumns = useMemo(() => columns.length > 0 ? columns.map((column, index) => {
        return columnHelper.accessor(column.accessor, {
            id: `column_${index}`,
            header: column.Header,
            cell: info => {
                const cellValue = info.getValue();
                // If the cell is a leadSource cell, replace the cellValue with the corresponding name
                if (info.column.columnDef.header === 'leadSource') {
                    return invertedLeadSources[cellValue[0]];
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
            sortingFn: 'basic',
        });
    }) : [], [columns, columnHelper]);



    const table = useReactTable({
        data: data[selectedTableKey],
        columns: newColumns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });


    return (
        <div className="flex flex-col items-center mt-4">
            <Listbox value={selectedTableKey} onChange={handleTableSelect}>
                <div>
                    <Listbox.Button className="flex flex-row items-center gap-4 px-4 py-2 border border-white rounded-md btn btn-primary ">
                        {
                            selectedTableKey ? `${formatWords(selectedTableKey)} Table` :
                                `Select table...`
                        }
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            size="sm"
                            className={`text-white transition-transform duration-500 transform ui-open:rotate-180`}
                        />
                    </Listbox.Button>
                    <Transition
                        as="div"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {Object.keys(data).map((key, index) => (
                                <Listbox.Option
                                    key={index}
                                    className="relative py-2 pl-10 pr-4 cursor-pointer select-none ui-active:bg-white ui-active:text-black ui-not-active:bg-gray-200 ui-not-active:text-gray-800"
                                    value={key}
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                                {formatWords(key)} Table
                                            </span>
                                            {selected ? (
                                                <span className={`${active ? 'text-gray-600' : 'text-gray-600'} absolute inset-y-0 left-0 flex items-center pl-3`}>
                                                    <CheckIcon className="hidden w-5 h-5 ui-selected:block" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>



            <div className="flex h-auto px-2 py-4 overflow-auto max-h-screen9">
                <div className="table w-full h-auto overflow-y-scroll max-h-screen9">
                    <div>
                        {table.getHeaderGroups().map((headerGroup, i) => (
                            <div key={i} className="uppercase bg-blue-700 border-l border-gray-200 tr">
                                {headerGroup.headers.map((header, j) => (
                                    <div
                                        key={j}
                                        className={header.column.getCanSort() ? "th cursor-pointer" : "th"}
                                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{
                                            asc: ' 🔼',
                                            desc: ' 🔽',
                                        }[header.column.getIsSorted()] ?? null}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div>
                        {data[selectedTableKey]  && table.getRowModel().rows && table.getRowModel().rows.length > 0 ? (
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
        </div>
    );
};

export default DataTable;