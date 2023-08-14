"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from 'gsap';

const KpiMeter = ({ redFlag, current, target, kpiName, unit }) => {

    const currentNum = Math.floor(Number(current));
    const prettyCurNum = current > 999 && current !== Infinity ? currentNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : currentNum;

    const rectRef = useRef(null);
    const triRef = useRef(null);
    const labelRef = useRef(null);
    const valRef = useRef(null);

    let dollarFill = currentNum <= target ? "green" : currentNum <= redFlag ? "yellow" : "red";
    let percentFill = currentNum >= target ? "green" : currentNum >= redFlag ? "yellow" : "red";

    let currentPosition = 0;
    let redFlagPosition = 0;
    let targetPosition = 0;

    if (kpiName === "Cost Per Contract" || kpiName === "Cost Per Acquisition" || kpiName === "ROAS Total" || kpiName === "ROAS Total APR") {
        currentPosition = current === Infinity ? 100 : current > 1000 ? 200 : current/10;
        redFlagPosition = redFlag / 10 ;
        targetPosition = target / 10 ;
    } else {
        currentPosition = current === Infinity ? 100 : current > 100 ? 200 : (current) * 2;
        redFlagPosition = redFlag * 2;
        targetPosition = target * 2;
    }

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
        <div className="relative -right-3 -bottom-4">
            <svg xmlns="http://www.w3.org/2000/svg" version="2" viewBox="0 0 100 100" width="100" height="100" className="flex overflow-visible">
                <defs>
                    <clipPath id="theClipPath">
                        <rect x="25" y="60" rx="12" ry="12" width="200" height="30" fill="gray" stroke="none" strokeWidth="0" />
                    </clipPath>
                </defs>
                <g clipPath="url(#theClipPath)">
                    <rect x="25" y="60" rx="0" ry="0" width="200" height="30" fill="#D9D9D9" stroke="none" strokeWidth="0" />
                    <rect ref={rectRef} rx="0" ry="0" x="25" y="60" width="0" height="30" />
                </g>
                {/*<path d={`M ${currentNum * 2 + 10} 40 L ${currentNum * 2 + 10} 70`} fill="none" stroke="black" strokeWidth="1" />
                <path d={`M ${redFlag * 2 + 10} 40 L ${redFlag * 2 + 10} 70 M ${target * 2 + 10} 40 L ${target * 2 + 10} 70`} fill="none" stroke="black" strokeWidth="1" />*/}
                <polygon ref={triRef} points="26,60 21,50 31,50" fill="black" />
                {
                    redFlag !== 0 && <polygon points={`${redFlagPosition + 25},90 ${redFlagPosition + 20},100 ${redFlagPosition + 30},100`} fill="red" />
                }
                {
                    target !== 0 && <polygon points={`${targetPosition + 25},90 ${targetPosition + 20},100 ${targetPosition + 30},100`} fill="green" />
                }


                <text ref={valRef} x="27" y="47" textAnchor="middle" fontSize="12" className="text-lg">
                    {
                        current === Infinity ? prettyCurNum.toString().slice(0, 3).toUpperCase() :
                            unit === "$" ? "$" + prettyCurNum :
                                prettyCurNum + "%"
                    }
                </text>

                { redFlag < target ? (
                    <>
                        <text x={`${targetPosition + 30}`} y="115" textAnchor="middle" fontSize="12" className="text-md">
                            {target === 0 ? "" : unit === "$" && target > 0 ? "$" + target : target + "%"}
                        </text>

                        <text x={`${redFlagPosition + 20}`} y="115" textAnchor="middle" fontSize="12" className="text-md">
                            {redFlag === 0 ? "" : unit === "$" && redFlag > 0 ? "$" + redFlag : redFlag + "%"}
                        </text>
                    </>
                ) : (
                    <>
                        <text x={`${targetPosition + 20}`} y="115" textAnchor="middle" fontSize="12" className="text-md">
                            {target === 0 ? "" : unit === "$" && target > 0 ? "$" + target : target + "%"}
                        </text>

                        <text x={`${redFlagPosition + 30}`} y="115" textAnchor="middle" fontSize="12" className="text-md">
                            {redFlag === 0 ? "" : unit === "$" && redFlag > 0 ? "$" + redFlag : redFlag + "%"}
                        </text>
                    </>
                )}

                <text ref={labelRef} x="25" y="30" textAnchor="middle" fontSize="12" className="text-xs ">Current</text>
                {/*<text x={`${redFlag * 2 + 12}`} y="97" transform={`rotate(-35, ${redFlag * 2 + 12}, 97)`} textAnchor="end" fontSize="10">Red Flag</text>
                <text x={`${target * 2 + 12}`} y="97" transform={`rotate(-35, ${target * 2 + 12}, 97)`} textAnchor="end" fontSize="10">Target</text>*/}
            </svg>
        </div>
    );
};

export default KpiMeter;

