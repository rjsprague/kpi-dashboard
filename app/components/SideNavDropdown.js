"use client";

import { useState, useEffect, useRef } from "react";
import { Transition } from "react-transition-group";
import SidenavDropdownButton from './SidenavDropdownButton';

function SideNavDropdown({ options, selectedOption, onOptionSelected, defaultValue, className }) {
    const [isOpen, setIsOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const dropdownContentRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            const contentElement = dropdownContentRef.current;
            if (contentElement) {
                setContentHeight(contentElement.scrollHeight);
            }
            searchInputRef.current && searchInputRef.current.focus();
            contentElement.scrollTop = 0;
        } else {
            setContentHeight(0);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Use dropdownRef to check if click was inside or outside
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false); // Close dropdown
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectChange = (option) => {
        onOptionSelected(option);
        setIsOpen(false);
    };

    // Filter the options based on the search term
    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const duration = 350;
    const defaultStyle = {
        transition: `height ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
        height: 0,
        opacity: 0,
        overflow: "hidden",
    };

    const transitionStyles = {
        entering: { height: "0", opacity: 1 },
        entered: { height: contentHeight, opacity: 1 },
        exiting: { height: 0, opacity: 1 },
        exited: { height: 0, opacity: 0 },
    };

    return (
        <div ref={dropdownRef} className="relative items-center text-xs dropdown sm:text-sm">
            <SidenavDropdownButton onClick={toggleOpen} isOpen={isOpen} className={className}>
                <span className="truncate">{selectedOption ? selectedOption : defaultValue}</span>
            </SidenavDropdownButton>
            <Transition in={isOpen} timeout={duration}>
                {(state) => (
                    <div
                        ref={dropdownContentRef}
                        className="absolute right-0 z-50 min-w-[70px] max-w-[200px] text-white bg-blue-900 rounded-md shadow-lg bg-opacity-80 border border-white"
                        style={{
                            ...defaultStyle,
                            ...transitionStyles[state],
                            maxHeight: "200px",
                            overflowY: "auto",
                        }}
                    >
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="relative top-0 w-full h-6 px-3 text-black"
                        />
                        <ul className="py-1">
                            {filteredOptions && filteredOptions.map((option) => (
                                <li
                                    key={option}
                                    className="px-3 py-1 overflow-hidden text-white cursor-pointer hover:bg-blue-50 hover:text-blue-900 whitespace-nowrap overflow-ellipsis"
                                    onClick={() => handleSelectChange(option)}
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Transition>
        </div>
    );
}

export default SideNavDropdown;