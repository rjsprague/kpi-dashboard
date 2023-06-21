"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from 'gsap';

const KpiMeter = ({ redFlag, current, target, kpiName, unit }) => {
    const currentNum = Math.floor(Number(current));
    const prettyCurNum = current > 999 ? currentNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : currentNum;


    const rectRef = useRef(null);
    const triRef = useRef(null);
    const labelRef = useRef(null);
    const valRef = useRef(null);

    let dollarFill = currentNum <= target ? "green" : currentNum <= redFlag ? "yellow" : "red";
    let percentFill = currentNum >= target ? "green" : currentNum >= redFlag ? "yellow" : "red";

    // Calculating maximum scale for the meter
    const maxValue = Math.max(redFlag, currentNum, target);
    const meterScale = maxValue * 1.2; // 1.2 is for giving some space at the end of the bar

    // Calculating positions in percentage
    const currentPosition = (currentNum / meterScale) * 250;
    const redFlagPosition = (redFlag / meterScale) * 250;
    const targetPosition = (target / meterScale) * 250;

    useEffect(() => {
        gsap.to(rectRef.current, {
            duration: 2,
            width: currentPosition,
            fill: unit === "$" ? dollarFill : percentFill
        });
        gsap.to(triRef.current, { x: currentPosition, duration: 2 });
        gsap.to(labelRef.current, { x: currentPosition, duration: 2 });
        gsap.to(valRef.current, { x: currentPosition, duration: 2 });
    }, [current, currentNum, dollarFill, percentFill]);

    return (
        <div className="absolute bottom-0 overflow-visible -right-1">
            <svg xmlns="http://www.w3.org/2000/svg" version="2" viewBox="0 0 300 150" width="280" height="130" className="flex overflow-visible">
                <defs>
                    <clipPath id="theClipPath">
                        <rect x="25" y="60" rx="12" ry="12" width="250" height="40" fill="gray" stroke="none" strokeWidth="0" />
                    </clipPath>
                </defs>
                <g clipPath="url(#theClipPath)">
                    <rect x="25" y="60" rx="0" ry="0" width="250" height="40" fill="#D9D9D9" stroke="none" strokeWidth="0" />
                    <rect ref={rectRef} rx="0" ry="0" x="25" y="60" width="0" height="40" />
                </g>
                {/*<path d={`M ${currentNum * 2 + 10} 40 L ${currentNum * 2 + 10} 70`} fill="none" stroke="black" strokeWidth="1" />
                <path d={`M ${redFlag * 2 + 10} 40 L ${redFlag * 2 + 10} 70 M ${target * 2 + 10} 40 L ${target * 2 + 10} 70`} fill="none" stroke="black" strokeWidth="1" />*/}
                <polygon ref={triRef} points="26,60 21,50 31,50" fill="black" />
                {
                    redFlag !== 0 && ( <polygon points={`${redFlagPosition + 25},100 ${redFlagPosition + 20},110 ${redFlagPosition + 30},110`} fill="red" /> )
                }
                {
                    target !== 0 && <polygon points={`${targetPosition + 25},100 ${targetPosition + 20},110 ${targetPosition + 30},110`} fill="green" />
                }


                <text ref={valRef} x="27" y="47" textAnchor="middle" fontSize="12" className="text-lg">
                    {
                        unit === "$" ?
                            "$" + prettyCurNum : prettyCurNum + "%"
                    }
                </text>
                
                
                <text x={`${targetPosition + 25}`} y="125" textAnchor="middle" fontSize="12" className="text-md">
                    {target === 0 ? "" : unit === "$" && target > 0 ? "$" + target : target + "%"}
                </text>
                
                <text x={`${redFlagPosition + 25}`} y="125" textAnchor="middle" fontSize="12" className="text-md">
                    {redFlag === 0 ? "" : unit === "$" && redFlag > 0 ? "$" + redFlag : redFlag + "%"}
                </text>
                
                
                <text ref={labelRef} x="25" y="30" textAnchor="middle" fontSize="12" className="text-xs ">Current</text>
                {/*<text x={`${redFlag * 2 + 12}`} y="97" transform={`rotate(-35, ${redFlag * 2 + 12}, 97)`} textAnchor="end" fontSize="10">Red Flag</text>
                <text x={`${target * 2 + 12}`} y="97" transform={`rotate(-35, ${target * 2 + 12}, 97)`} textAnchor="end" fontSize="10">Target</text>*/}
            </svg>
        </div>
    );
};

export default KpiMeter;

