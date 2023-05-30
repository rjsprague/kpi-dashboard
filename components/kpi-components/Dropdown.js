import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Transition } from "react-transition-group";

function getKeyByValue(object, value, props) {
    if (object === null || value === null) return null;
    return Object.keys(object).find(key => object[key] === value);
}

function Dropdown({ options, onOptionSelected, queryId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [contentHeight, setContentHeight] = useState(0);
    const dropdownContentRef = useRef(null);

    const allSelected = options
        ? selectedOptions.length === Object.keys(options).length
        : false;

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

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectAll = () => {
        if (selectedOptions.length === Object.keys(options).length) {
            onOptionSelected([], queryId);
            setSelectedOptions([]);
        } else {
            onOptionSelected(Object.values(options), queryId);
            setSelectedOptions(Object.values(options));
        }
    };

    const handleCheckboxChange = (department, member) => {
        let selectedValues = member ? [`${department}-${member}`] : Object.keys(options[department]).map(member => `${department}-${member}`);
        let newSelectedOptions = [...selectedOptions];

        for (let val of selectedValues) {
            const isSelected = newSelectedOptions.includes(val);
            if (isSelected) {
                const index = newSelectedOptions.indexOf(val);
                newSelectedOptions = [
                    ...newSelectedOptions.slice(0, index),
                    ...newSelectedOptions.slice(index + 1),
                ];
            } else {
                newSelectedOptions.push(val);
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
        <div className="relative items-center dropdown">
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
                            ? getKeyByValue(options, selectedOptions[0])
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
                            {options && Object.entries(options).map(([department, members]) => {
                                return (
                                    <li key={department} className="px-3 py-0 text-white cursor-pointer hover:bg-blue-800">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                className="w-3 h-3 mr-2 text-blue-900 border-gray-300 rounded"
                                                checked={Object.keys(members).every(member => selectedOptions.includes(`${department}-${member}`))}
                                                onChange={() => handleCheckboxChange(department)}
                                            />
                                            {department}
                                        </label>
                                        <ul className="pl-6">
                                            {Object.entries(members).map(([id, name]) => {
                                                return (
                                                    <li key={id} className="px-3 py-1 text-white cursor-pointer hover:bg-blue-800">
                                                        <label className="inline-flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                className="w-3 h-3 mr-2 text-blue-900 border-gray-300 rounded"
                                                                checked={selectedOptions.includes(`${department}-${id}`)}
                                                                onChange={() => handleCheckboxChange(department, id)}
                                                            />
                                                            {name}
                                                        </label>
                                                    </li>
                                                );
                                            })}
                                        </ul>
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