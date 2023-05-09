import React from 'react';

const SpeedToLeadMeter = ({ value, unit, goal, redFlag }) => {
  const color = value <= goal ? 'bg-green-500' : value >= redFlag ? 'bg-red-500' : 'bg-yellow-500';

  return (
    <div className="px-4 mt-4">
      <div className="relative w-full h-4 bg-gray-200 rounded">
        <div
          className={`absolute top-0 h-4 ${color} rounded`}
          style={{ width: `${Math.min((value / redFlag) * 100, 100)}%` }}
        ></div>
      </div>
      <p className="mt-1 text-right">
        {value}
        {unit}
      </p>
    </div>
  );
};

export default SpeedToLeadMeter;
