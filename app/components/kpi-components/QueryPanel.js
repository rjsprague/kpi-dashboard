"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faGear, faTimes } from '@fortawesome/free-solid-svg-icons';

const QueryPanel = ({ query, height, setHeight, handleToggleQuery, handleGearIconClick, handleRemoveQuery, children }) => (
  <div className="p-2 text-sm rounded-lg shadow-super-3 bg-gradient-to-r from-blue-600 via-blue-800 to-blue-500 text-gray-50">
    <div className='flex flex-row justify-between'>
      <button
        className="flex h-7 items-center px-2 py-1 text-blue-900 transition-shadow duration-500 bg-white rounded-md left-0.5 shadow-super-4 hover:animate-pulse"
        onClick={() => {
          handleToggleQuery(query.id)
          setHeight(height === 0 ? 'auto' : 0)
        }}
      >
        {query.isOpen ?
          <FontAwesomeIcon
            icon={faChevronDown}
            size="sm"
            className='text-blue-900 transition-transform duration-500 rotate-180 transform-gpu'
          /> :
          <FontAwesomeIcon
            icon={faChevronDown}
            size="sm"
            className='text-blue-900 transition-transform duration-500 transform-gpu'
          />
        }
      </button>
      <div className=''>
        {children}
      </div>
      <div className='flex flex-col justify-between gap-2 xs:flex-row'>
        <button
          className="flex h-7 items-center px-2 py-1 text-blue-900 transition-shadow duration-500 bg-white rounded-md right-0.5 shadow-super-4 hover:animate-pulse"
          onClick={handleGearIconClick}
        >
          <FontAwesomeIcon
            icon={faGear}
            size="sm"
            className="text-blue-900 transform-gpu"
          />
        </button>
        <button
          className="flex items-center px-2 py-1 text-blue-900 transition-shadow duration-500 bg-white rounded-md h-7 shadow-super-4 hover:animate-pulse"
          onClick={handleRemoveQuery}
        >
          <FontAwesomeIcon
            icon={faTimes}
            size="sm"
            className="text-blue-900 transform-gpu"
          />
        </button>
      </div>
    </div>
  </div>
);

export default QueryPanel;
