"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const SidenavDropdownButton = ({ onClick, children, isOpen, className }) => (
  <button
    className="relative flex items-center justify-between w-48 h-10 gap-2 px-3 py-2 overflow-hidden text-xs font-semibold text-gray-100 transition-colors duration-200 rounded-lg bg-gradient-to-l from-blue-800 via-blue-500 to-blue-800 sm:text-sm whitespace-nowrap shadow-super-3"
    onClick={onClick}
  >
    {children}
    <FontAwesomeIcon
      icon={faChevronDown}
      size="sm"
      className={`text-white transition-transform duration-500 transform-gpu ${isOpen ? 'rotate-180' : ''}`}
    />
  </button>
);

export default SidenavDropdownButton;
