import KpiMeter from './KpiMeter';
import SpeedToLeadMeter from './SpeedToLeadMeter';
import BigChecksMeter from './BigChecksMeter';
import { useState } from 'react';
import { FiInfo } from 'react-icons/fi';

export default function KpiCard({ prop, handleCardInfoClick }) {
  console.log('KpiCard: ', prop);
  const [isFlipped, setIsFlipped] = useState(false);

  const renderMeter = () => {
    if (prop.kpiType === 'STL') {
      return (
        <SpeedToLeadMeter
          value={prop.current}
          unit="min"
          goal={prop.target}
          redFlag={prop.redFlag}
        />
      );
    } else if (prop.kpiType === 'BigChecks') {
      return (
        <BigChecksMeter
          value={prop.current}
          unit=" per week"
          goal={prop.target}
          redFlag={prop.redFlag}
        />
      );
    } else {
      return (
        <KpiMeter
          redFlag={prop.redFlag}
          current={prop.current}
          target={prop.target}
          kpiName={prop.name}
        />
      );
    }
  };

  return (
    <div className="box-border flip-container">
      <div className={`box-border flipper ${isFlipped ? 'flipped' : ''}`}>
        <div className="box-border py-1 text-center text-black delay-500 rounded w-68 xs:w-76 sm:w-80 h-60 shadow-super-3 transform-gpu front">
          <h1 className="text-2xl font-semibold tracking-tighter align-top">{prop.name}</h1>
          <div className="mt-2 font-medium text-md">
            {prop.data1 !== null && prop.data2 !== null ? (
              <div className="flex flex-row justify-around mx-2">
                <div>{prop.data1}</div>
                <div>{prop.data2}</div>
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="">{renderMeter()}</div>
          <button
            onClick={() => {
              handleCardInfoClick(prop);
            }}
            className="absolute info-icon right-2 bottom-2"
          >
            <FiInfo />
          </button>
        </div>
        <div className="box-border py-2 ml-8 overflow-hidden transition-all delay-500 bg-white rounded w-68 xs:w-76 sm:w-80 transform-gpu h-60 back shadow-super-3">
          {prop.kpiFactors
            ? prop.kpiFactors.map((factor) => {
                return (
                  <li
                    key={factor.id}
                    className="flex flex-row justify-between px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200"
                  >
                    <div className="flex flex-row items-center">
                      <div className="flex-shrink-0 w-2 h-2 mr-2 bg-green-400 rounded-full"></div>
                      <div>{factor.desc}</div>
                    </div>
                    <div className="flex flex-row items-center">
                      <div className="flex-shrink-0 w-2 h-2 mr-2 bg-green-400 rounded-full"></div>
                      <div>
                        <a href={factor.link} target="_blank">
                        {factor.linkName}
                        </a>
                      </div>
                    </div>
                  </li>
                );
              })
            : 'TBD'}
        </div>
      </div>
    </div>
  );
}