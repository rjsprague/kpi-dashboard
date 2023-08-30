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

    let dollarFill;
    if (target > redFlag) {
        dollarFill = currentNum >= target ? "green" : currentNum >= redFlag ? "yellow" : "red";
    } else {
        dollarFill = currentNum <= target ? "green" : currentNum <= redFlag ? "yellow" : "red";
    }

    let percentFill;
    if (target > redFlag) {
        percentFill = currentNum >= target ? "green" : currentNum >= redFlag ? "yellow" : "red";
    } else {
        percentFill = currentNum <= target ? "green" : currentNum <= redFlag ? "yellow" : "red";
    }

    const { currentPosition, redFlagPosition, targetPosition } = calculatePositions(kpiName, current, redFlag, target, unit);

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


const calculatePositions = (kpiName, current, redFlag, target, unit) => {
    const svgWidth = 200;
    let currentPosition = 0;
    let redFlagPosition = 0;
    let targetPosition = 0;
  
    if (current === 0) {
      currentPosition = 0;
    }
  
    if (unit === '%') {
      const maxValue = Math.max(redFlag, target);
      const scale = maxValue > 100 ? 100 / (redFlag + target) : 1;
  
      redFlagPosition = (redFlag * scale / 100) * svgWidth;
      targetPosition = (target * scale / 100) * svgWidth;
      currentPosition = (current * scale / 100) * svgWidth;
    } else if (unit === '$') {
      const diff = Math.abs(redFlag - target);
      const spacing = (diff / (redFlag + target)) * svgWidth;
  
      if (redFlag < target) {
        redFlagPosition = (svgWidth - spacing) / 2;
        targetPosition = redFlagPosition + spacing;
      } else {
        targetPosition = (svgWidth - spacing) / 2;
        redFlagPosition = targetPosition + spacing;
      }
  
      const minValue = Math.min(redFlag, target);
      const maxValue = Math.max(redFlag, target);
      const range = maxValue - minValue;
      const normalizedCurrent = (current - minValue) / range;
  
      if (redFlag < target) {
        currentPosition = redFlagPosition + (normalizedCurrent * spacing);
      } else {
        if (current >= 0 && current <= target) {
          currentPosition = (targetPosition * current) / target;
        } else if (current > target && current <= redFlag) {
          currentPosition = targetPosition + ((redFlagPosition - targetPosition) * (current - target) / (redFlag - target));
        } else if (current > redFlag) {
          currentPosition = redFlagPosition + ((svgWidth - redFlagPosition) * (current - redFlag) / (redFlag));
        }
      }
    }
  
    // Ensure the positions are within SVG bounds
    currentPosition = Math.min(svgWidth, Math.max(0, currentPosition));
  
    return { currentPosition, redFlagPosition, targetPosition };
  };
  
  
  
  
  