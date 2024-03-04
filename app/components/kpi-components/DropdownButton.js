"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const DropdownButton = ({ onClick, children, isOpen, className }) => (
  <button
    className=" justify-between text-xs sm:text-sm flex gap-2 items-center px-2 py-1.5 h-7 font-semibold text-blue-900 transition-colors duration-200 rounded-md bg-gray-50 whitespace-nowrap w-24 xl:w-28 2xl:w-32 3xl:w-40 shadow-super-4 hover:bg-blue-50"
    onClick={onClick}
    type="button"
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
