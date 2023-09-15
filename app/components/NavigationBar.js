// NavigationBar.js
"use client";

import { ColumnSizing } from '@tanstack/react-table';
import React, { useState } from 'react';

export default function NavigationBar({ items, onItemChange, initialActiveItem }) {

    console.log(items)
    console.log(onItemChange)
    console.log(initialActiveItem)

    const [activeItem, setActiveItem] = useState(initialActiveItem || items[0]);

    const handleItemClick = (item) => {
        setActiveItem(item);
        onItemChange(item);
    };

    const getButtonClasses = (item) => {
        return activeItem === item
            ? "inline-block py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-sm text-white bg-blue-400 font-bold leading-6 rounded-lg ring-1 ring-inset ring-blue-100"
            : "inline-block py-1 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm text-white bg-blue-600 font-bold leading-6 hover:bg-blue-400 focus:bg-blue-400 focus:text-white rounded-lg"
    }

    return (
        <div className="flex flex-row flex-wrap justify-center bg-blue-600 lg:justify-normal lg:pl-2 shadow-super-4 ">
            <ul className="flex flex-wrap items-center gap-1 m-1 sm:m-2 sm:gap-4">
                {items.map(item => (
                    <li className="" key={item}>
                        <button
                            className={getButtonClasses(item)}
                            onClick={() => handleItemClick(item)}
                        >
                            {item}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
