"use client"
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Transition } from "react-transition-group";
import { useState, useEffect, useRef } from 'react';

export default function Accordion({ title, children }) {
    const [height, setHeight] = useState("0px");
    const [open, setOpen] = useState(false);
    const accordionRef = useRef(null);

    useEffect(() => {
        
        
        if (open) {
            const contentElement = accordionRef.current;
            if (contentElement) {
            // const scrollHeight = accordionRef.current.scrollHeight;
            setHeight(200);
            }
        }
    }, [open]);

    const duration = 250;
    const defaultStyle = {
        transition: `height ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
        height: 0,
        opacity: 0,
        overflow: "visible",
    };

    const transitionStyles = {
        entering: { height: 0, opacity: 1 },
        entered: { height: height, opacity: 1 },
        exiting: { height: 0, opacity: 1 },
        exited: { height: 0, opacity: 0 },
    };

    return (
        <div>
            <button
                className="flex justify-between w-full px-4 py-2 mt-2 text-sm font-medium text-left text-white bg-blue-700 rounded-t-lg hover:bg-blue-500 focus:outline-none focus-visible:ring focus-visible:ring-blue-500/75"
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
                        className="px-4 pt-4 pb-2 mb-2 text-sm bg-blue-500 rounded-b-lg shadow-lg text-gray-50"
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
