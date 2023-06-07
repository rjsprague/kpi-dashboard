import { useState, useEffect, useRef } from "react";
import { Transition } from "react-transition-group";
import DropdownButton from './DropdownButton';


function CheckboxDropdown({ options, onOptionSelected, queryId, isSingleSelect }) {
    const [selectedOptions, setSelectedOptions] = useState(options || []);
    const [isOpen, setIsOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const dropdownRef = useRef(null); // New ref for dropdown
    const dropdownContentRef = useRef(null);

    //console.log("options", options)
    //console.log("Selected Options in CheckboxDropdown", selectedOptions)

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
        setSelectedOptions(newSelectedOptions);
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
        <div ref={dropdownRef} className="text-xs sm:text-sm dropdown">
            <DropdownButton onClick={toggleOpen} isOpen={isOpen}>
                {selectedOptions.length === 0
                    ? "No Filter"
                    : isSingleSelect
                        ? selectedOptions[0]
                        : selectedOptions.length === options.length
                            ? "All"
                            : `${selectedOptions.length} selected`}
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

export default CheckboxDropdown;