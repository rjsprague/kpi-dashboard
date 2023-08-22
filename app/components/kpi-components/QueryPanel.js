"use client";

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faGear, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectSpaceId } from '../../../app/GlobalRedux/Features/client/clientSlice'
import fetchClients from '../../lib/fetchClients';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function QueryPanel({ query, height, setHeight, handleToggleQuery, handleGearIconClick, handleRemoveQuery, children }) {

    const clientSpaceId = useSelector(selectSpaceId);

    const { data: user, error: userError } = useSWR('/auth/getUser', fetcher);
    // console.log(user)

    let clientsMap = {};

    if (user && user.IsAdmin === true) {
        const { data: clients, error: clientsError } = useSWR('/api/spaces', fetchClients);
        clientsMap = clients && Object.entries(clients).reduce((acc, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {});
    }

    return (
        <div className="p-2 text-sm rounded-lg shadow-super-3 bg-gradient-to-r from-blue-600 via-blue-800 to-blue-500 text-gray-50">
            <div className='flex flex-row justify-between'>
                <button
                    className="flex h-7 items-center px-2 py-1 text-blue-900 transition-shadow duration-500 bg-white rounded-md left-0.5 shadow-super-4 hover:animate-pulse"
                    onClick={() => {
                        handleToggleQuery(query.id)
                        setHeight(height === 0 ? 'auto' : 0)
                    }}
                >
                    {query.isOpen ?
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            size="sm"
                            className='text-blue-900 transition-transform duration-500 rotate-180 transform-gpu'
                        /> :
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            size="sm"
                            className='text-blue-900 transition-transform duration-500 transform-gpu'
                        />
                    }
                </button>

                <div className='flex flex-col items-center gap-2 sm:flex-row'>
                    {user && user.IsAdmin && clientsMap && clientsMap[clientSpaceId]}
                    {children}
                </div>
                <div className='flex flex-col justify-between gap-2 xs:flex-row'>
                    <button
                        className="flex h-7 items-center px-2 py-1 text-blue-900 transition-shadow duration-500 bg-white rounded-md right-0.5 shadow-super-4 hover:animate-pulse"
                        onClick={handleGearIconClick}
                    >
                        <FontAwesomeIcon
                            icon={faGear}
                            size="sm"
                            className="text-blue-900 transform-gpu"
                        />
                    </button>
                    <button
                        className="flex items-center px-2 py-1 text-blue-900 transition-shadow duration-500 bg-white rounded-md h-7 shadow-super-4 hover:animate-pulse"
                        onClick={handleRemoveQuery}
                    >
                        <FontAwesomeIcon
                            icon={faTimes}
                            size="sm"
                            className="text-blue-900 transform-gpu"
                        />
                    </button>
                </div>
            </div>
        </div>
    )
};