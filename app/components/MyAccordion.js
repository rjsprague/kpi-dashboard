"use client"
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Transition } from "react-transition-group";
import { useState, useEffect, useRef } from 'react';

export default function Accordion({ title, height, setHeight, children }) {
    const [open, setOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);

    const accordionRef = useRef(null);

    useEffect(() => {       
        
        if (open) {
            const contentElement = accordionRef.current;
            if (contentElement) {
            const scrollHeight = accordionRef.current.scrollHeight;
            setContentHeight(scrollHeight);
            }
        } else {
            setContentHeight(0);
        }
    }, [open]);

    const duration = 75;
    const defaultStyle = {
        transition: `height ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
        height: 0,
        opacity: 0,
        overflow: "visible",
    };

    const transitionStyles = {
        entering: { height: 0, opacity: 0 },
        entered: { height: contentHeight, opacity: 1},
        exiting: { height: 0, opacity: 1 },
        exited: { height: 0, opacity: 0, visibility: "hidden"},
    };

    return (
        <div className="py-2 text-sm md:text-md lg:text-lg">
            <button
                className={`${open ? "" : "rounded-b-lg"} duration-75 ease-linear flex justify-between w-full px-4 py-2 mt-2 font-medium text-left text-white bg-blue-700 rounded-t-lg hover:bg-blue-600`}
                onClick={() => {
                    setOpen(!open)
                    setHeight(height === 0 ? 'auto' : 0)
                    }}
            >
                <span className="text-xl">{title}</span>
                <ChevronUpDownIcon className={` size-8 ${open ? 'transform rotate-180' : ''}`} />
            </button>
            <Transition in={open} timeout={duration}>
                {(state) => (
                    <div
                        className="px-4 pt-2 bg-blue-500 rounded-b-lg shadow-lg text-gray-50"
                        ref={accordionRef}
                        style={{
                            ...defaultStyle,
                            ...transitionStyles[state]
                        }}
                    >
                        {children}
                    </div>
                )}
            </Transition>
        </div>
    );
}
