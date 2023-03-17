import { useState } from "react";

function Dropdown({ selectedOption, onOptionSelected, data, queryId }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionSelected = (value) => {
        onOptionSelected(value, queryId);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                className="h-8 px-2 overflow-hidden text-sm text-left text-white align-middle bg-blue-900 rounded-md cursor-pointer w-60 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-opacity-80"
                onClick={toggleOpen}
            >
                {data[selectedOption] || "All"}
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
                            key="All"
                            className="px-3 py-2 text-white cursor-pointer hover:bg-blue-800"
                            onClick={() => {
                                handleOptionSelected("All");
                                setIsOpen(false);
                            }}
                        >
                            All
                        </li>
                        {Object.entries(data).map(([key, value]) => (
                            <li
                                key={key}
                                className="px-3 py-2 text-white cursor-pointer hover:bg-blue-800"
                                onClick={() => {
                                    handleOptionSelected(key, queryId);
                                    setIsOpen(false);
                                }}
                            >
                                {value}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Dropdown;
