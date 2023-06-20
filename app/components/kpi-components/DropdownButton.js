"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const DropdownButton = ({ onClick, children, isOpen }) => (
  <button
    className="justify-between text-xs sm:text-sm flex gap-2 items-center px-2 py-1.5 h-7 font-semibold text-blue-900 transition-colors duration-200 rounded-md bg-gray-50 whitespace-nowrap sm:w-42 shadow-super-4 hover:bg-blue-50"
    onClick={onClick}
  >
    {children}
    <FontAwesomeIcon
      icon={faChevronDown}
      size="sm"
      className={`text-blue-900 transition-transform duration-500 transform-gpu ${isOpen ? 'rotate-180' : ''}`}
    />
  </button>
);

export default DropdownButton;
