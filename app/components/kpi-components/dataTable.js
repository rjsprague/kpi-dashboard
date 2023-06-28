import React, { useMemo } from 'react';
import { createColumnHelper, getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';

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

const DataTable = ({ data, columns }) => {
    const columnHelper = createColumnHelper();

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="text-2xl font-bold text-gray-500">No data</div>
            </div>
        );
    }

    const newColumns = useMemo(() => columns.length > 0 && columns.map(column => {
        return columnHelper.accessor(column.accessor, {
            header: column.Header,
            cell: info => typeof info.getValue() === 'string' || typeof info.getValue() === 'number' ? info.getValue() : stringifyObject(info.getValue())
        });
    }), [columns, columnHelper]);

    const table = useReactTable({
        data,
        columns: newColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="max-h-screen px-2 py-2 mt-6 overflow-auto">
            <div className="table w-full">
                <div>
                    {table.getHeaderGroups().map(headerGroup => (
                        <div className="uppercase bg-blue-700 border-l border-gray-200 tr">
                            {headerGroup.headers.map(header => (
                                <div className="th">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div>
                    {
                        table.getRowModel().rows.map((row, i) => (
                            <a
                                href={`https://podio.com/x/y/item/${row.original.podio_item_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`tr border-l border-gray-200 tr ${i % 2 === 0 ? 'bg-blue-400' : 'bg-blue-500'}`}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <div className="td">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                ))}
                            </a>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default DataTable;