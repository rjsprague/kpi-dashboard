"use client";

import { useState, useEffect, useRef } from "react";
import { Transition } from "react-transition-group";
import LoadingIcon from "../LoadingIcon";
import { FiCheck, FiCheckSquare, FiSquare } from 'react-icons/fi';

function UniversalDropdown({ options, onOptionSelected, selectedOptions, queryId, isSingleSelect, isLoadingData, className, ButtonComponent, showButton, defaultValue, label }) {
    const [selectedOption, setSelectedOption] = useState(defaultValue || (isSingleSelect && selectedOptions[0]) || "");
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const dropdownRef = useRef(null);
    const dropdownContentRef = useRef(null);
    const searchInputRef = useRef(null);

    // console.log(options, selectedOptions)

    useEffect(() => {
        if (showButton) {
            setIsOpen(true);
        }
    }, [showButton]);

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
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
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
            setSelectedOption(option);
        } else if (option === 'All') {
            newSelectedOptions = newSelectedOptions.length === options.length ? [] : [...options];
        } else {
            const isSelected = selectedOptions.includes(option);

            if (newSelectedOptions.length === options.length) {
                newSelectedOptions = [option];
            } else if (isSelected) {
                newSelectedOptions = newSelectedOptions.filter(selectedOption => selectedOption !== option);
            } else {
                newSelectedOptions.push(option);
            }
        }

        onOptionSelected(newSelectedOptions);
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

    return (
        <div ref={dropdownRef} className={`relative items-center text-xs dropdown sm:text-sm ${className}`}>
            <ButtonComponent onClick={toggleOpen} isOpen={isOpen}>
                <div className="truncate">
                    {isLoadingData ? <LoadingIcon /> :
                        selectedOption
                            ? selectedOption
                            : isSingleSelect && selectedOptions || selectedOptions?.length === 1
                                ? selectedOptions[0]
                                : selectedOptions?.length === options.length
                                    ? (label ? label : "All")
                                    : `${selectedOptions?.length} selected`}
                </div>
            </ButtonComponent>

            <Transition in={isOpen} timeout={duration}>
                {(state) => (
                    <div
                        ref={dropdownContentRef}
                        className="absolute z-50 p-1 text-white bg-blue-800 rounded-b-lg shadow-lg sm:w-44 bg-opacity-80"
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
                            {!isSingleSelect && (
                                <li className="py-1 text-white cursor-pointer hover:bg-blue-400 focus:bg-blue-400">
                                    <label className="inline-flex items-center" onClick={() => handleCheckboxChange('All')}>
                                        {selectedOptions?.length === options.length && options.length > 0 ? <FiCheckSquare size="20px" /> : <FiSquare size="20px" />}
                                        <span className="ml-2">All</span>
                                    </label>
                                </li>
                            )}
                            {Array.isArray(filteredOptions) ? filteredOptions.map((option, index) => (
                                <li
                                    key={option}
                                    onClick={() => handleCheckboxChange(option)}
                                    className={`w-full py-1 text-white cursor-pointer hover:bg-blue-400 focus:bg-blue-400 ${index === highlightedIndex ? 'bg-blue-400' : ''}`}
                                >
                                    <label className="inline-flex items-center">
                                        {selectedOptions?.includes(option) ? isSingleSelect ? <FiCheck size="20px" /> : <FiCheckSquare size="20px" /> : !isSingleSelect && <FiSquare size="20px" />}
                                        <span className="ml-2 truncate w-34">{option}</span>
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

export default UniversalDropdown;
