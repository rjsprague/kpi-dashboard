import { useState, useEffect } from "react";

function Dropdown({ onOptionSelected, queryId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [leadSources, setLeadSources] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectAll = () => {
        onOptionSelected(Object.values(leadSources), queryId); 
        setSelectedOptions(Object.values(leadSources));       
    };

    const handleSelectNone = () => {
        onOptionSelected([], queryId); 
        setSelectedOptions([]);       
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
        const fetchLeadSources = async () => {
            // pass in date range to get unique lead sources for that date range
            const res = await fetch(`/api/lead-sources`)
            const data = await res.json();
            setLeadSources(data);
        };
        fetchLeadSources();
        
    }, []);

    useEffect(() => {
        setSelectedOptions(Object.values(leadSources));
        onOptionSelected(selectedOptions, queryId); 
    }, [leadSources]);

    return (
        <div className="relative dropdown">
            <button
                className="h-8 px-2 overflow-hidden text-sm text-left text-white align-middle bg-blue-900 rounded-md cursor-pointer w-60 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-opacity-80"
                onClick={toggleOpen}
            >
                { selectedOptions.length === Object.keys(leadSources).length
                    ? "All"
                    : selectedOptions.length === 0
                        ? "None"
                        : selectedOptions.length === 1
                            ? Object.keys(leadSources).find(key => leadSources[key] === selectedOptions[0])
                            : `${selectedOptions.length} selected`}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-white pointer-events-none">
                    <svg
                        className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""
                            }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 14a.75.75 0 01-.53-.22l-3.5-3.5a.75.75 0 111.06-1.06L10 11.94l3.97-3.97a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-.53.22z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </span>
            </button>
            {isOpen && (
                <div className="absolute right-0 z-10 w-full overflow-y-auto text-white bg-blue-900 rounded-md shadow-lg bg-opacity-80 top-10 max-h-screen3">
                    <ul className="py-1">
                        <li
                            className="px-3 py-2 text-white cursor-pointer hover:bg-blue-800"
                        >
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 mr-2 text-blue-900 border-gray-300 rounded"
                                    checked={selectedOptions.length === Object.keys(leadSources).length}
                                    onChange={handleSelectAll}
                                />
                                All
                            </label>
                        </li>
                        <li
                            className="px-3 py-2 text-white cursor-pointer hover:bg-blue-800"
                        >
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 mr-2 text-blue-900 border-gray-300 rounded"
                                    checked={selectedOptions.length === 0}
                                    onChange={handleSelectNone}
                                />
                                None
                            </label>
                        </li>
                        {Object.entries(leadSources).map(([key, value]) => (
                            <li
                                key={value}
                                className="px-3 py-2 text-white cursor-pointer hover:bg-blue-800"
                            >
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 mr-2 text-blue-900 border-gray-300 rounded"
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
        </div>
    );
}

export default Dropdown;