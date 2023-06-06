import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Transition } from "react-transition-group";

function SelectDropdown({ options, onOptionSelected, defaultValue  }) {
    const [selectedOption, setSelectedOption] = useState(defaultValue );
    const [isOpen, setIsOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const dropdownRef = useRef(null);
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
        setSelectedOption(option);
        onOptionSelected(option);
        setIsOpen(false);
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
                className="items-center w-40 h-8 min-w-0 px-2 mx-2 overflow-hidden text-sm text-left text-white align-middle bg-blue-900 rounded-md cursor-pointer shadow-super-4 max-w-xxs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-opacity-80"
                onClick={toggleOpen}
            >
                {selectedOption ? selectedOption : "Select..."}
                <FontAwesomeIcon
                    icon={faChevronDown}
                    size="sm"
                    className={`absolute text-white transition-transform duration-500 transform-gpu right-4 top-2 ${isOpen ? 'rotate-180' : ''}`}
                />
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
                        <ul className="py-2">
                            {options && options.map((option) => (
                                <li
                                    key={option}
                                    className="px-3 py-1 text-white cursor-pointer hover:bg-blue-800"
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

export default SelectDropdown;