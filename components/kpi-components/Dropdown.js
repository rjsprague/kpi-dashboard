import { useState, useEffect, useRef } from "react";
import fetchLeadSources from '../../lib/fetchLeadSources';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Transition } from "react-transition-group";


function Dropdown({ onOptionSelected, queryId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [leadSources, setLeadSources] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [contentHeight, setContentHeight] = useState(0);
    const dropdownContentRef = useRef(null);

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
        if (selectedOptions.length === Object.keys(leadSources).length) {
            onOptionSelected([], queryId);
            setSelectedOptions([]);
        } else {
            onOptionSelected(Object.values(leadSources), queryId);
            setSelectedOptions(Object.values(leadSources));
        }
    };

    const handleCheckboxChange = (value) => {
        const isSelected = selectedOptions.includes(value);
        if (isSelected) {
            const index = selectedOptions.indexOf(value);
            const newSelectedOptions = [
                ...selectedOptions.slice(0, index),
                ...selectedOptions.slice(index + 1),
            ];
            onOptionSelected(newSelectedOptions, queryId);
            setSelectedOptions(newSelectedOptions);
        } else {
            onOptionSelected([...selectedOptions, value], queryId);
            setSelectedOptions([...selectedOptions, value]);
        }
    };

    useEffect(() => {
        const handleClickOutsideDropdown = (event) => {
            if (!event.target.closest(".dropdown")) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutsideDropdown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideDropdown);
        };
    }, []);

    useEffect(() => {
        const fetchSources = async () => {
            const sources = await fetchLeadSources();
            setLeadSources(sources);
        };
        fetchSources();
    }, []);

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
                    : selectedOptions.length === Object.keys(leadSources).length
                        ? "All"
                        : selectedOptions.length === 1
                            ? Object.keys(leadSources).find(key => leadSources[key] === selectedOptions[0])
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
                            maxHeight: "200px", // Limit the height of the dropdown
                            overflowY: "auto", // Enable scrolling if the content is too long
                        }}
                    >
                        <ul className="py-1">
                            <li
                                className="px-3 py-0 text-white cursor-pointer hover:bg-blue-800"
                            >
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-3 h-3 mr-2 text-blue-900 border-gray-300 rounded"
                                        checked={selectedOptions.length === Object.keys(leadSources).length}
                                        onChange={handleSelectAll}
                                    />
                                    All
                                </label>
                            </li>
                            {Object.entries(leadSources).map(([key, value]) => (
                                <li
                                    key={value}
                                    className="px-3 py-0 text-white cursor-pointer hover:bg-blue-800"
                                >
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            className="w-3 h-3 mr-2 text-blue-900 border-gray-300 rounded"
                                            checked={selectedOptions.includes(value)}
                                            onChange={() => handleCheckboxChange(value)}
                                        />
                                        {key}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Transition>
        </div>
    );
}

export default Dropdown;