"use client";

import { useState, useEffect, useRef } from "react";
import { Transition } from "react-transition-group";
import DropdownButton from './DropdownButton';
import LoadingIcon from "../LoadingIcon";


function CheckboxDropdown({ options, onOptionSelected, selectedOptions, queryId, isSingleSelect, isLoadingData }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const dropdownRef = useRef(null);
    const dropdownContentRef = useRef(null);
    const searchInputRef = useRef(null);


    // console.log("selectedOptions", selectedOptions)
    // console.log("options ", options)

    useEffect(() => {
        if (isOpen) {
            const contentElement = dropdownContentRef.current;
            if (contentElement) {
                setContentHeight(contentElement.scrollHeight);
            }
            searchInputRef.current && searchInputRef.current.focus();
            contentElement.scrollTop = 0;
            setHighlightedIndex(-1);
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

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredOptions(options);
        } else {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            setFilteredOptions(options.filter(option => option.toLowerCase().includes(lowercasedSearchTerm)));
        }
    }, [options, searchTerm]);

    useEffect(() => {
        const optionElements = dropdownRef.current.querySelectorAll('li');
        if (optionElements[highlightedIndex]) {
            optionElements[highlightedIndex].scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleCheckboxChange = (option) => {
        let newSelectedOptions = [...selectedOptions];

        if (isSingleSelect) {
            newSelectedOptions = [option];
        } else if (option === 'All') {
            // When 'All' is selected, if all options are already selected, deselect all. Otherwise, select all.
            newSelectedOptions = newSelectedOptions.length === options.length ? [] : [...options];
        } else {
            const isSelected = selectedOptions.includes(option);

            if (newSelectedOptions.length === options.length) {
                // If all options are selected, and the user tries to select another option,
                // deselect all options and only select the new option
                newSelectedOptions = [option];
            } else if (isSelected) {
                // If the option is already selected, deselect it
                newSelectedOptions = newSelectedOptions.filter(selectedOption => selectedOption !== option);
            } else {
                // Otherwise, add the option to the selected options
                newSelectedOptions.push(option);
            }
        }

        onOptionSelected(newSelectedOptions, queryId);
    };



    const handleKeyDown = (event) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setHighlightedIndex(prevIndex => (prevIndex + 1) % filteredOptions.length);
                break;
            case 'ArrowUp':
                event.preventDefault();
                setHighlightedIndex(prevIndex => (prevIndex - 1 + filteredOptions.length) % filteredOptions.length);
                break;
            case 'Enter':
                event.preventDefault();
                if (highlightedIndex !== -1) {
                    handleCheckboxChange(filteredOptions[highlightedIndex]);
                }
                break;
            case 'Escape':
                event.preventDefault();
                setIsOpen(false);
                break;
            default:
                break;
        }
    };

    const duration = 250;
    const defaultStyle = {
        transition: `height ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
        height: 0,
        opacity: 0,
        overflow: "hidden",
    };

    const transitionStyles = {
        entering: { height: 0, opacity: 1 },
        entered: { height: contentHeight, opacity: 1 },
        exiting: { height: 0, opacity: 1 },
        exited: { height: 0, opacity: 0 },
    };

    console.log("filteredOptions", filteredOptions)

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
                        className="absolute z-50 p-1 text-white bg-blue-800 rounded-md shadow-lg sm:w-44 bg-opacity-80"
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
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="z-10 w-full px-3 py-1 text-blue-900 rounded-md"
                            placeholder="Search..."
                        />
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
                            {Array.isArray(filteredOptions) ? filteredOptions.map((option, index) => (
                                <li
                                    key={option}
                                    className={`px-3 py-1 text-white cursor-pointer hover:bg-blue-800 ${index === highlightedIndex ? 'bg-blue-800' : ''}`}
                                >
                                    <label
                                        className="inline-flex items-center"
                                        onClick={() => handleCheckboxChange(option)}
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-3 h-3 mr-2 text-blue-900 border-gray-300 rounded"
                                            checked={selectedOptions?.includes(option)}
                                            value={option}
                                            onClick={(e) => e.stopPropagation()} // Stop propagation of native click event
                                        />
                                        {option}
                                    </label>
                                </li>
                            )) : <LoadingIcon />}
                        </ul>
                    </div>
                )}
            </Transition>
        </div>
    );
}

export default CheckboxDropdown;