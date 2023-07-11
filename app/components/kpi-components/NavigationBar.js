"use client";

import React, { useState } from 'react';

export default function NavigationBar({ onQueryTypeChange }) {
  
  const [activeButton, setActiveButton] = useState('Acquisitions');

  const views = ['Acquisitions', 'Team', 'Financial', 'Leaderboard'];

  const handleQueryTypeClick = (type) => {
    setActiveButton(type);
    onQueryTypeChange(type);
  };

  const getButtonClasses = (type) => {
    return activeButton === type 
      ? "inline-block py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-sm text-white bg-blue-400 font-bold leading-6 rounded-lg ring-1 ring-inset ring-blue-100"
      : "inline-block py-1 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm text-white bg-blue-600 font-bold leading-6 hover:bg-blue-400 focus:bg-blue-400 focus:text-white rounded-lg"
  }

  return (
    <div className="flex flex-row flex-wrap justify-center bg-blue-600 lg:justify-normal lg:pl-2 shadow-super-4 ">
      <ul className="flex flex-wrap items-center gap-1 m-1 sm:m-2 sm:gap-4">        
        {views.map(view => (
          <li className="" key={view}>
            <button
              className={getButtonClasses(view)}
              onClick={() => handleQueryTypeClick(view)}
            >
              {view}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
