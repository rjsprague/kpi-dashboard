"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const SidenavDropdownButton = ({ onClick, children, isOpen, className }) => (
    <div className='truncate'>
        <button
            className="flex items-center justify-between h-10 gap-2 px-3 py-2 text-xs font-semibold text-gray-100 transition-colors duration-200 rounded-t-lg w-44 bg-gradient-to-l from-blue-800 via-blue-500 to-blue-800 sm:text-sm"
            onClick={onClick}
        >
            {children}
            <FontAwesomeIcon
                icon={faChevronDown}
                size="sm"
                className={`text-white transition-transform duration-500 transform-gpu ${isOpen ? 'rotate-180' : ''}`}
            />
        </button>
    </div>
);

export default SidenavDropdownButton;
