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
    const [noSetter, setNoSetter] = useState(false);
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
        setNoSetter(false);
        let newSelectedOptions = [...selectedOptions];

        if (isSingleSelect) {
            newSelectedOptions = [option];
            setSelectedOption(option);
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

    // handle All / None button click
    const handleAllNoneClick = () => {
        setNoSetter(false);
        if (selectedOptions.length === options.length) {
            onOptionSelected([]);
        } else {
            onOptionSelected(options);
        }
    };

    // handle No Setter button click
    const handleNoSetter = () => {
        setNoSetter(true);
        onOptionSelected([], true);
    }


    // console.log(selectedOptions.length)
    // console.log(options.length)
    // console.log(onOptionSelected)
    // console.log(label)


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

    // console.log(isSingleSelect)

    return (
        <div ref={dropdownRef} className={`relative items-center text-xs dropdown sm:text-sm ${className}`}>
            <ButtonComponent onClick={toggleOpen} isOpen={isOpen}>
                <div className="truncate">
                    {isLoadingData ? <LoadingIcon /> :
                        selectedOption
                            ? selectedOption
                            : isSingleSelect && selectedOptions || selectedOptions?.length === 1
                                ? selectedOptions[0]
                                : noSetter ? "No Setter" :
                                    selectedOptions?.length === options.length ? (label ? "All " + label : "All") :
                                        selectedOptions?.length === 0 ? "No Filter" :
                                            `${selectedOptions?.length} selected`}
                </div>
            </ButtonComponent>

            <Transition in={isOpen} timeout={duration}>
                {(state) => (
                    <div
                        ref={dropdownContentRef}
                        className="absolute z-50 p-1 text-white bg-blue-800 rounded-b-lg shadow-lg bg-opacity-80"
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
                            className="z-10 w-full px-2 py-1 text-blue-900 rounded-md"
                            placeholder="Search..."
                        />
                        <ul className="">
                            {!isSingleSelect && (
                                <div className="py-1 text-white cursor-pointer hover:bg-blue-400 focus:bg-blue-400" onClick={() => handleAllNoneClick()}>
                                    <div className="inline-flex" >
                                        All / None
                                    </div>
                                </div>
                            )}
                            {
                                label && label.includes("Setters") && (
                                    <div className="text-white cursor-pointer hover:bg-blue-400 focus:bg-blue-400">
                                        <div className="inline-flex gap-2" onClick={() => handleNoSetter()}>
                                            { noSetter ? <FiCheckSquare size="20px" /> : !isSingleSelect && <FiSquare size="20px" /> }
                                            No Setter
                                        </div>
                                    </div>
                                )}
                            {Array.isArray(filteredOptions) ? filteredOptions.map((option, index) => (
                                <li
                                    key={option}
                                    onClick={() => handleCheckboxChange(option)}
                                    className={`w-full text-white cursor-pointer hover:bg-blue-400 focus:bg-blue-400 ${index === highlightedIndex ? 'bg-blue-400' : ''}`}
                                >
                                    <label className="inline-flex gap-2">
                                        {
                                            isSingleSelect && selectedOptions?.includes(option) ? <FiCheck size="20px" /> : isSingleSelect && <div className="w-5"></div>
                                        }
                                        {
                                            !isSingleSelect && selectedOptions?.includes(option) ? <FiCheckSquare size="20px" /> : !isSingleSelect && <FiSquare size="20px" />
                                        }
                                        <span className="truncate">{option}</span>
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
