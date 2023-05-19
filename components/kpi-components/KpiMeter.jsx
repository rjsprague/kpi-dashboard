import React, { useRef, useEffect } from "react";
import { gsap } from 'gsap';

const KpiMeter = ({ redFlag, current, target, kpiName }) => {
    const currentNum = Math.floor(Number(current));

    const rectRef = useRef(null);
    const triRef = useRef(null);
    const labelRef = useRef(null);
    const valRef = useRef(null);

    let dollarFill = currentNum <= target ? "green" : currentNum <= redFlag ? "yellow" : "red";
    let percentFill = currentNum >= target ? "green" : currentNum >= redFlag ? "yellow" : "red";

    useEffect(() => {
        if (kpiName === "Cost Per Lead") {
            gsap.to(rectRef.current, {
                duration: 2,
                width: currentNum * 2.5,
                fill: dollarFill
            });
        } else {
            gsap.to(rectRef.current, {
                duration: 2,
                width: currentNum * 2.5,
                fill: percentFill
            });
        }
        if (currentNum * 2.5 > 250) {
            gsap.to(triRef.current, { x: 250, duration: 2 });
            gsap.to(labelRef.current, { x: 250, duration: 2 });
            gsap.to(valRef.current, { x: 250, duration: 2 });
        } else {
            gsap.to(triRef.current, { x: currentNum * 2.5, duration: 2 });
            gsap.to(labelRef.current, { x: currentNum * 2.5, duration: 2 });
            gsap.to(valRef.current, { x: currentNum * 2.5, duration: 2 });
        }
    }, [current, currentNum, dollarFill, percentFill]);

    return (
        <div className="flex items-center justify-center overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" version="2" viewBox="0 0 300 150" width="300" height="150" className="flex overflow-hidden">
                <defs>
                    <clipPath id="theClipPath">
                        <rect x="25" y="60" rx="12" ry="12" width="250" height="40" fill="gray" stroke="none" strokeWidth="0" />
                    </clipPath>
                </defs>
                <g clipPath="url(#theClipPath)">
                <rect x="25" y="60" rx="0" ry="0" width="250" height="40" fill="#D9D9D9" stroke="none" strokeWidth="0" />              
                <rect ref={rectRef}   rx="0" ry="0" x="25" y="60" width="0" height="40" />
                </g>
                {/*<path d={`M ${currentNum * 2 + 10} 40 L ${currentNum * 2 + 10} 70`} fill="none" stroke="black" strokeWidth="1" />
                <path d={`M ${redFlag * 2 + 10} 40 L ${redFlag * 2 + 10} 70 M ${target * 2 + 10} 40 L ${target * 2 + 10} 70`} fill="none" stroke="black" strokeWidth="1" />*/}
                <polygon ref={triRef} points="26,60 21,50 31,50" fill="black" />
                <polygon points={`${redFlag * 2.5 + 25},100 ${redFlag * 2.5 + 20},110 ${redFlag * 2.5 + 30},110`} fill="red" />
                <polygon points={`${target * 2.5 + 25},100 ${target * 2.5 + 20},110 ${target * 2.5 + 30},110`} fill="green" />
                <text ref={valRef} x="27" y="47" textAnchor="middle" fontSize="12" className="text-lg">
                    {
                        kpiName.startsWith("Cost Per") || kpiName === "Ad Spend" ? 
                            "$" + current : currentNum + "%"
                    }
                </text>
                <text x={`${target * 2.5 + 25}`} y="125" textAnchor="middle" fontSize="12" className="text-md">{kpiName === "Cost Per Lead" ? "$" + target : target + "%"}</text>
                <text x={`${redFlag * 2.5 + 25}`} y="125" textAnchor="middle" fontSize="12" className="text-md">{kpiName === "Cost Per Lead" ? "$" + redFlag : redFlag + "%"}</text>
                <text ref={labelRef} x="25" y="30" textAnchor="middle" fontSize="12" className="text-xs ">Current</text>
                {/*<text x={`${redFlag * 2 + 12}`} y="97" transform={`rotate(-35, ${redFlag * 2 + 12}, 97)`} textAnchor="end" fontSize="10">Red Flag</text>
                <text x={`${target * 2 + 12}`} y="97" transform={`rotate(-35, ${target * 2 + 12}, 97)`} textAnchor="end" fontSize="10">Target</text>*/}
            </svg>
        </div>
    );
};

export default KpiMeter;

