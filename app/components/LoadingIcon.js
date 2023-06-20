"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingIcon = ({ size = 'medium' }) => {
  let sizeClass;

  switch (size) {
    case 'small':
      sizeClass = 'text-xs';
      break;
    case 'large':
      sizeClass = 'text-8xl py-18';
      break;
    case 'medium':
    default:
      sizeClass = 'text-sm';
      break;
  }

  return (
    <div className="flex items-center justify-center">
      <FontAwesomeIcon
        icon={faSpinner}
        className={`text-blue-500 animate-spin ${sizeClass}`}
      />
    </div>
  );
};

export default LoadingIcon;
