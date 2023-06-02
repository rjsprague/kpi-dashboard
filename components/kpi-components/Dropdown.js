import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Transition } from "react-transition-group";

function Dropdown({ options, onOptionSelected, queryId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [contentHeight, setContentHeight] = useState(0);
    const dropdownRef = useRef(null); // New ref for dropdown
    const dropdownContentRef = useRef(null);

    console.log("options", options) // this is an array of objects, each object has a name and an id
    // Check if options contains objects with 

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

        if (option === 'All') {
            // Toggle selection of all options
            newSelectedOptions = newSelectedOptions.length === options.length ? [] : [...options];
        } else {
            const isSelected = newSelectedOptions.includes(option);
            if (isSelected) {
                newSelectedOptions = newSelectedOptions.filter(selectedOption => selectedOption !== option);
            } else {
                newSelectedOptions.push(option);
            }
        }

        onOptionSelected(newSelectedOptions, queryId);
        setSelectedOptions(newSelectedOptions);
    };

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
        <div ref={dropdownRef} className="relative items-center dropdown">
            <button
                className="items-center w-40 h-8 min-w-0 px-2 overflow-hidden text-sm text-left text-white align-middle bg-blue-900 rounded-md cursor-pointer max-w-xxs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-opacity-80"
                onClick={() => {
                    toggleOpen();
                }}
            >
                {selectedOptions.length === 0
                    ? "No Filter"
                    : selectedOptions.length === Object.keys(options).length
                        ? "All"
                        : selectedOptions.length === 1
                            ? selectedOptions[0] // Display the name of the selected option
                            : `${selectedOptions.length} selected`}
                {isOpen ?
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        size="sm"
                        className='absolute text-white transition-transform duration-500 rotate-180 transform-gpu right-2 top-2'
                    /> :
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        size="sm"
                        className='absolute text-white transition-transform duration-500 transform-gpu right-2 top-2'
                    />
                }
            </button>
            <Transition in={isOpen} timeout={duration}>
                {(state) => (
                    <div
                        ref={dropdownContentRef}
                        className="absolute right-0 z-50 w-full text-white bg-blue-900 rounded-md shadow-lg bg-opacity-80 top-10"
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
                                        checked={selectedOptions.length === options.length}
                                        onChange={() => handleCheckboxChange('All')}
                                    />
                                    All
                                </label>
                            </li>
                            {options && options.map((option) => {
                                return (
                                    <li key={option} className="px-3 py-1 text-white cursor-pointer hover:bg-blue-800">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                className="w-3 h-3 mr-2 text-blue-900 border-gray-300 rounded"
                                                checked={selectedOptions.includes(option)}
                                                onChange={() => handleCheckboxChange(option)}
                                            />
                                            {option}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </Transition>
        </div>
    );
}

export default Dropdown;