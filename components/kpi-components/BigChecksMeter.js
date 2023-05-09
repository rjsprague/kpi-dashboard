import React from 'react';

const BigChecksMeter = ({ title, value, unit, goal, redFlag }) => {
  const color = value >= goal ? 'bg-green-500' : value <= redFlag ? 'bg-red-500' : 'bg-yellow-500';

  return (
    <div className="mt-4">
      <h4 className="font-semibold">{title}</h4>
      <div className="relative w-4 h-full bg-gray-200 rounded">
        <div
          className={`absolute bottom-0 w-4 ${color} rounded`}
          style={{ height: `${Math.min((value / goal) * 100, 100)}%` }}
        ></div>
      </div>
      <p className="mt-1 text-right">
        {value}
        {unit}
      </p>
    </div>
  );
};

export default BigChecksMeter;
