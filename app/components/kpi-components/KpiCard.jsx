"use client";

import KpiMeter from './KpiMeter';
import SpeedToLeadMeter from './SpeedToLeadMeter';
import BigChecksMeter from './BigChecksMeter';
import { useState } from 'react';
import { FiInfo, FiList } from 'react-icons/fi';
import CountUp from 'react-countup';
import LoadingQuotes from '../LoadingQuotes';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { selectSpaceId } from '../../../app/GlobalRedux/Features/client/clientSlice'

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function removeWord(str, word) {
    const regex = new RegExp(`\\b${word}\\s*`, 'g')
    return str.replace(regex, '');
}

function formatTime(time) {
    if (time >= 3600) {
        return `${Math.round(time / 3600)} hour(s)`;
    } else if (time >= 60) {
        return `${Math.round(time / 60)} minute(s)`;
    } else {
        return `${time} second(s)`;
    }
}

function formatCurrent(current, unit) {
    if (unit === '$' && current !== Infinity) {
        return `$${current.toFixed(2)}`;
    } else if (unit === '%' && current !== Infinity) {
        return `${current}%`;
    } else if (current !== Infinity) {
        return `${current} ${unit}`;
    } else {
        return `${current.toFixed(1)}`;
    }
}

export default function KpiCard({ prop, handleCardInfoClick, handleKpiCardClick, dateRange, leadSource, kpiView, teamMembers }) {
    const [isLoading, setIsLoading] = useState(false);
    const startDate = dateRange.gte ? formatDate(new Date(dateRange.gte)) : null;
    const endDate = dateRange.lte ? formatDate(new Date(dateRange.lte)) : null;
    const clientSpaceId = useSelector(selectSpaceId);
    // console.log(prop)

    if (isLoading) {
        return ReactDOM.createPortal(
            <div className='absolute inset-0 flex items-center justify-center w-screen h-screen'>
                <LoadingQuotes mode={'light'} />
            </div>,
            document.getElementById('loading-portal')
        );
    }

    const renderMeter = () => {
        if (prop.kpiType === 'STL') {
            return (
                <SpeedToLeadMeter
                    value={prop.current}
                    unit={prop.unit}
                    target={prop.target}
                    redFlag={prop.redFlag}
                />
            );
        } else if (prop.kpiType === 'BigChecks') {
            return (
                <BigChecksMeter
                    value={prop.current}
                    unit={prop.unit}
                    target={prop.target}
                    redFlag={prop.redFlag}
                />
            );
        } else if (prop.kpiType === 'meter') {
            return (
                <KpiMeter
                    redFlag={prop.redFlag}
                    current={prop.current}
                    target={prop.target}
                    kpiName={prop.name}
                    unit={prop.unit}
                />
            );
        } else {
            return (<div className="flex justify-center text-3xl font-bold w-70">
                {
                    prop.unit === "$" && prop.current !== Infinity ? (
                        <span>{'$'}<CountUp delay={1} start={0} end={prop.current} /></span>
                    ) : prop.unit === "%" && prop.current !== Infinity ? (
                        <span><CountUp delay={1} start={0} end={prop.current} />{'%'}</span>
                    ) : prop.current !== Infinity && prop.unit !== "" ? (                        
                        <span><CountUp delay={1} start={0} end={prop.current} />{' '}{prop.unit}</span>
                    ) : prop.current !== Infinity && prop.unit === "" ? (
                        <span className={`${prop.current < prop.redFlag ? 'text-red-500' : prop.redFlag < prop.current < prop.target ? 'text-yellow-500' : prop.current > prop.target ? 'text-green-500' : 'text-black'}`}><CountUp delay={1} start={0} decimals={1} end={prop.current} /></span>
                    ) : (
                        <span>{prop.current}</span>
                    )
                }
            </div>)
        }
    };

    //console.log("KpiCard.jsx: handleKpiCardClick: ", startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, prop.name)


    return (
        <div>
            <div className="relative flex flex-col px-3 py-1 text-center text-black delay-500 rounded h-52 shadow-super-3 transform-gpu ">
                <h1 className="absolute flex self-center text-2xl font-semibold tracking-tighter text-center align-top">{prop.name.includes("Closers") ? removeWord(prop.name, "Closers") : prop.name}</h1>
                <div className="absolute flex self-center mt-1 font-medium top-10">
                    {
                        prop.data1 !== null && prop.data2 !== null && prop.data3 !== null ?
                            <div className="flex flex-row justify-center gap-2 px-1 text-xs">
                                <div className="">{prop.data1.length > 1 && prop.name === "Setter STL Median" ? formatTime(prop.current) : prop.data1.length > 1 ? prop.data1 : ""}</div>
                                <div>{prop.data2.length > 1 && prop.data2}</div>
                                <div>{prop.data3.length > 1 && prop.data3}</div>
                            </div>
                            :
                            prop.data1 !== null && prop.data2 !== null ? (
                                <div className="flex flex-row justify-center gap-4 text-xs">
                                    <div>{prop.data1.length > 1 && prop.data1}</div>
                                    <div>{prop.data2.length > 1 && prop.data2}</div>
                                </div>
                            ) : (
                                ''
                            )}
                </div>
                <div className="absolute flex justify-center bottom-16">{renderMeter()}</div>
                <button
                    onClick={() => {
                        handleCardInfoClick(prop);
                    }}
                    className="absolute info-icon right-2 bottom-2"
                >
                    <FiInfo />
                </button>
                <button
                    onClick={() => handleKpiCardClick(startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, prop.name)}
                    className="absolute info-icon left-2 bottom-2"
                >
                    <FiList />
                </button>
            </div>
        </div>
    );
}