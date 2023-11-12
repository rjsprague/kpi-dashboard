"use client";

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSpaceId } from '../../app/GlobalRedux/Features/client/clientSlice'

export default function NavigationBar({ items, onItemChange, initialActiveItem }) {
    const spaceId = useSelector(selectSpaceId);
    const closersSpaceId = Number(process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID);
    const [activeItem, setActiveItem] = useState(initialActiveItem || items[0]);

    const handleItemClick = (item) => {
        // console.log(item)
        setActiveItem(item);
        onItemChange(item);
    };

    // console.log(items)

    const getButtonClasses = (item) => {
        return activeItem === item
            ? "inline-block py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-sm text-white bg-blue-400 font-bold leading-6 rounded-lg ring-1 ring-inset ring-blue-100"
            : "inline-block py-1 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm text-white bg-blue-600 font-bold leading-6 hover:bg-blue-400 focus:bg-blue-400 focus:text-white rounded-lg"
    }

    return (
        <div className="flex flex-row flex-wrap justify-center bg-blue-600 lg:justify-normal lg:pl-2 shadow-super-4 ">
            <ul className="flex flex-wrap items-center gap-1 m-1 sm:m-2 sm:gap-4">
                {items.map(item => (
                    spaceId !== closersSpaceId && item === "Payments" ? null :
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
