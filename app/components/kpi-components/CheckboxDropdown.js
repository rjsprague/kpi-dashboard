"use client";

import { useState, useEffect, useRef } from "react";
import { Transition } from "react-transition-group";
import DropdownButton from './DropdownButton';
import LoadingIcon from "../LoadingIcon";


function CheckboxDropdown({ options, onOptionSelected, selectedOptions, queryId, isSingleSelect, isLoadingData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const dropdownRef = useRef(null);
    const dropdownContentRef = useRef(null);

    // console.log("selectedOptions", selectedOptions)
    // console.log("options ", options)

    useEffect(() => {
        if (isOpen) {
            const contentElement = dropdownContentRef.current;
            if (contentElement) {
                setContentHeight(contentElement.scrollHeight);
            }
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

    const handleCheckboxChange = (option) => {
        let newSelectedOptions = [...selectedOptions];

        if (isSingleSelect) {
            newSelectedOptions = [option];
        } else if (option === 'All') {
            newSelectedOptions = newSelectedOptions.length === options.length ? [] : [...options];
        } else {
            const isSelected = selectedOptions.includes(option);
            if (isSelected) {
                newSelectedOptions = newSelectedOptions.filter(selectedOption => selectedOption !== option);
            } else {
                newSelectedOptions.push(option);
            }
        }
        onOptionSelected(newSelectedOptions, queryId);
    };

    const duration = 250;
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
        <div ref={dropdownRef} className=" dropdown">
            <DropdownButton onClick={toggleOpen} isOpen={isOpen}>
                {isLoadingData ? <LoadingIcon /> :
                    selectedOptions?.length === 0
                        ? "No Filter"
                        : isSingleSelect && selectedOptions || selectedOptions?.length === 1
                            ? selectedOptions[0]
                            : selectedOptions?.length === options.length
                                ? "All"
                                : `${selectedOptions?.length} selected`}
            </DropdownButton>
            <Transition in={isOpen} timeout={duration}>
                {(state) => (
                    <div
                        ref={dropdownContentRef}
                        className="absolute z-50 text-white bg-blue-900 rounded-md shadow-lg sm:w-44 bg-opacity-80"
                        style={{
                            ...defaultStyle,
                            ...transitionStyles[state],
                            maxHeight: "200px",
                            overflowY: "auto",
                        }}
                    >
                        <ul className="py-1">
                            <li className="px-3 py-1 text-white cursor-pointer hover:bg-blue-800">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-3 h-3 mr-2 text-blue-900 border-gray-300 rounded"
                                        checked={selectedOptions?.length === options.length && options.length > 0}
                                        onChange={() => handleCheckboxChange('All')}
                                        value={'All'}
                                    />
                                    All
                                </label>
                            </li>
                            {Array.isArray(options) ? options.map((option) => {
                                return (
                                    <li key={option} className="px-3 py-1 text-white cursor-pointer hover:bg-blue-800">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                className="w-3 h-3 mr-2 text-blue-900 border-gray-300 rounded"
                                                checked={selectedOptions?.includes(option)}
                                                onChange={() => handleCheckboxChange(option)}
                                                value={option}
                                            />
                                            {option}
                                        </label>
                                    </li>
                                );
                            }) : <LoadingIcon />}
                        </ul>
                    </div>
                )}
            </Transition>
        </div>
    );
}

export default CheckboxDropdown;