"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddQueryButton = ({ handleAddQuery }) => {
  return (
    <div
      id="add-query-btn"
      className="flex items-center justify-center w-12 h-12 m-2 text-2xl text-white ease-in-out delay-1000 bg-blue-500 rounded-full cursor-pointer shadow-super-3 animate-pulse"
      onClick={() => handleAddQuery()}
    >
      <FontAwesomeIcon icon={faPlus} />
    </div>
  );
};

export default AddQueryButton;
