import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faGear, faTimes } from '@fortawesome/free-solid-svg-icons';

const QueryPanel = ({ query, height, setHeight, handleToggleQuery, handleGearIconClick, handleRemoveQuery, children }) => (
  <div className="px-4 py-2 text-sm rounded-lg shadow-super-3 bg-gradient-to-r from-blue-600 via-blue-800 to-blue-500 text-gray-50">
    <div className='relative flex flex-row items-center gap-2 align-middle md:justify-center'>
      <button
        className="box-border absolute px-2 py-1 text-blue-900 transition-shadow duration-500 bg-white rounded-md left-0.5 shadow-super-4 hover:animate-pulse"
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
      <div className='flex items-center '>
        {children}
      </div>
      <button
        className="box-border px-2 py-1 text-blue-900 transition-shadow duration-500 bg-white rounded-md right-0.5 shadow-super-4 hover:animate-pulse"
        onClick={handleGearIconClick}
      >
        <FontAwesomeIcon
          icon={faGear}
          size="sm"
          className="text-blue-900 transform-gpu"
        />
      </button>
      {query.id !== 1 && (
        <button
          className="box-border absolute px-2 py-1 text-blue-900 transition-shadow duration-500 bg-white rounded-md right-0.5 shadow-super-4 hover:animate-pulse"
          onClick={handleRemoveQuery}
        >
          <FontAwesomeIcon
            icon={faTimes}
            size="sm"
            className="text-blue-900 transform-gpu"
          />
        </button>
      )}
    </div>
  </div>
);

export default QueryPanel;
