"use client";

import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Transition } from "react-transition-group";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faGear, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FiFilter } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectSpaceId } from '../../../app/GlobalRedux/Features/client/clientSlice'
import fetchClients from '../../lib/fetchClients';
import useAuth from '@/hooks/useAuth';
import useSWR from 'swr';

export default function QueryPanel({ query, height, setHeight, handleToggleQuery, handleGearIconClick, handleRemoveQuery, children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const filtersContentRef = useRef(null);
    const filtersButtonRef = useRef(null);
    const { user, loading, logout } = useAuth();
    const clientSpaceId = useSelector(selectSpaceId);
    let clientsMap = {};

    useEffect(() => {
        if (isOpen) {
            const contentElement = filtersContentRef.current;
            if (contentElement) {
                setContentHeight(200);
            }
        } else {
            setContentHeight(0);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filtersButtonRef.current && filtersButtonRef.current.contains(event.target)) {
                return;
            }
            if (filtersContentRef.current && !filtersContentRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!user && !loading) {
            logout();
        }
    }, [user, loading]);

    if (user && user.isAdmin === true) {
        const { data: clients, error: clientsError } = useSWR('/api/spaces', fetchClients);
        clientsMap = clients && Object.entries(clients).reduce((acc, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {});
    }

    const duration = 150;
    const defaultStyle = {
        transition: `height ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
        height: 0,
        opacity: 0,
        overflow: "visible",
    };

    const transitionStyles = {
        entering: { height: 0, opacity: 0 },
        entered: { height: contentHeight, opacity: 1 },
        exiting: { height: 0, opacity: 0 },
        exited: { height: 0, opacity: 0, visibility: "hidden" },
    };

    return (
        <div className="p-2 text-sm rounded-lg shadow-super-3 bg-gradient-to-r from-blue-600 via-blue-800 to-blue-500 text-gray-50">
            <div className='flex flex-row justify-between gap-2'>
                <button
                    className="flex h-7 items-center px-2 py-1 text-blue-900 transition-shadow duration-500 bg-white rounded-md left-0.5 shadow-super-4 hover:animate-pulse"
                    onClick={() => {
                        handleToggleQuery(query.id)
                        setHeight(height === 0 ? 'auto' : 0)
                    }}
                >
                    {query && query.isOpen ?
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

                <div className='flex flex-row items-center gap-2 overflow-visible'>
                    {user && user.isAdmin && clientsMap &&
                        <div className="p-1 font-semibold text-blue-900 rounded-md bg-gray-50">
                            Client: {clientsMap[clientSpaceId]}
                        </div>
                    }

                    <div className="flex-row hidden md:flex">
                        {children}
                    </div>

                    <div ref={filtersButtonRef} className="relative flex md:hidden">
                        <FiFilter

                            onClick={() => setIsOpen(!isOpen)}
                            className="text-xl text-gray-100" />

                        <Transition in={isOpen} timeout={duration}>
                            {(state) => (
                                <div
                                    ref={filtersContentRef}
                                    className={`flex flex-col px-3 inset-3 absolute top-6 w-72 -left-32 z-30 py-2 text-white bg-blue-800 rounded-lg shadow-lg bg-opacity-80 overflow-visible`}
                                    style={{
                                        ...defaultStyle,
                                        ...transitionStyles[state],
                                        maxHeight: "200px",
                                        overflowY: "visible",
                                    }}
                                >
                                    <span className="text-xl font-lg">Filters</span>
                                    <div className='transition-opacity'>{children}</div>
                                    <span className="absolute text-lg text-gray-100 cursor-pointer right-2 top-2">
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            size="md"
                                            className="font-semibold"
                                            onClick={() => setIsOpen(false)}
                                        />
                                    </span>
                                </div>
                            )}
                        </Transition>

                    </div>
                </div>
                <div className='flex flex-row justify-between gap-2'>
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