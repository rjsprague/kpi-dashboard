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
                width: currentNum * 2,
                fill: dollarFill
            });
        } else {
            gsap.to(rectRef.current, {
                duration: 2,
                width: currentNum * 2,
                fill: percentFill
            });
        }
        gsap.to(triRef.current, { x: currentNum * 2, duration: 2 });
        gsap.to(labelRef.current, { x: currentNum * 2, duration: 2 });
        gsap.to(valRef.current, { x: currentNum * 2, duration: 2 });
    }, [current, currentNum, dollarFill, percentFill]);

    return (
        <div className="flex pt-8 sm:pt-4 scale-150 sm:scale-100 sm:ml-0 sm:-mr-0 sm:px-0 overflow-hidden justify-around mx-1 px-14">
            <svg xmlns="http://www.w3.org/2000/svg" version="2" viewbox="0 0 240 130" className="flex overflow-hidden sm:overflow-auto">
                <rect x="10" y="40" rx="2" ry="2" width="200" height="30" fill="gray" stroke="black" stroke-width="1.5" />
                <rect ref={rectRef} rx="1" ry="1" x="11" y="41" width="0" height="28" />
                <path d={`M ${currentNum * 2 + 10} 40 L ${currentNum * 2 + 10} 70`} fill="black" stroke="black" stroke-width="1" />
                <path d={`M ${redFlag * 2 + 10} 40 L ${redFlag * 2 + 10} 70 M ${target * 2 + 10} 40 L ${target * 2 + 10} 70`} fill="black" stroke="black" stroke-width="1" />
                <polygon ref={triRef} points="10,40 5,30 15,30" fill="blue" />
                <polygon points={`${redFlag * 2 + 10},70 ${redFlag * 2 + 5},80 ${redFlag * 2 + 15},80`} fill="red" />
                <polygon points={`${target * 2 + 10},70 ${target * 2 + 5},80 ${target * 2 + 15},80`} fill="green" />
                <text ref={valRef} x="12" y="27" text-anchor="middle" font-size="12" className="text-lg">{kpiName === "Cost Per Lead" ? "$" + current : currentNum + "%"}</text>
                <text x={`${target * 2 + 12}`} y="90" text-anchor="middle" font-size="10">{kpiName === "Cost Per Lead" ? "$" + target : target + "%"}</text>
                <text x={`${redFlag * 2 + 12}`} y="90" text-anchor="middle" font-size="10">{kpiName === "Cost Per Lead" ? "$" + redFlag : redFlag + "%"}</text>
                <text ref={labelRef} x="10" y="9" text-anchor="middle" font-size="12" className=" text-xs">Current</text>
                <text x={`${redFlag * 2 + 12}`} y="97" transform={`rotate(-35, ${redFlag * 2 + 12}, 97)`} text-anchor="end" font-size="10">Red Flag</text>
                <text x={`${target * 2 + 12}`} y="97" transform={`rotate(-35, ${target * 2 + 12}, 97)`} text-anchor="end" font-size="10">Target</text>
            </svg>
        </div>
    );
};

export default KpiMeter;