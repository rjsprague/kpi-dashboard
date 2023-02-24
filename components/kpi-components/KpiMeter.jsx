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
        gsap.to(triRef.current, { x: currentNum * 2.5, duration: 2 });
        gsap.to(labelRef.current, { x: currentNum * 2.5, duration: 2 });
        gsap.to(valRef.current, { x: currentNum * 2.5, duration: 2 });
    }, [current, currentNum, dollarFill, percentFill]);

    return (
        <div className="flex items-center justify-center overflow-hidden">
            <svg xmlns="http://www.w3.org/2000/svg" version="2" viewbox="0 0 220 100" className="flex overflow-hidden">
                <rect x="25" y="60" rx="2" ry="2" width="250" height="40" fill="gray" stroke="black" strokeWidth="1.5" />
                <rect ref={rectRef} rx="1" ry="1" x="26" y="61" width="0" height="38" />
                {/*<path d={`M ${currentNum * 2 + 10} 40 L ${currentNum * 2 + 10} 70`} fill="none" stroke="black" strokeWidth="1" />
                <path d={`M ${redFlag * 2 + 10} 40 L ${redFlag * 2 + 10} 70 M ${target * 2 + 10} 40 L ${target * 2 + 10} 70`} fill="none" stroke="black" strokeWidth="1" />*/}
                <polygon ref={triRef} points="26,60 21,50 31,50" fill="black" />
                <polygon points={`${redFlag * 2.5 + 10},100 ${redFlag * 2.5 + 5},110 ${redFlag * 2.5 + 15},110`} fill="red" />
                <polygon points={`${target * 2.5 + 10},100 ${target * 2.5 + 5},110 ${target * 2.5 + 15},110`} fill="green" />
                <text ref={valRef} x="27" y="47" text-anchor="middle" font-size="12" className="text-lg">{kpiName === "Cost Per Lead" ? "$" + current : currentNum + "%"}</text>
                <text x={`${target * 2.5 + 12}`} y="125" text-anchor="middle" font-size="12" className="text-md">{kpiName === "Cost Per Lead" ? "$" + target : target + "%"}</text>
                <text x={`${redFlag * 2.5 + 12}`} y="125" text-anchor="middle" font-size="12" className="text-md">{kpiName === "Cost Per Lead" ? "$" + redFlag : redFlag + "%"}</text>
                <text ref={labelRef} x="25" y="30" text-anchor="middle" font-size="12" className="text-xs ">Current</text>
                {/*<text x={`${redFlag * 2 + 12}`} y="97" transform={`rotate(-35, ${redFlag * 2 + 12}, 97)`} text-anchor="end" font-size="10">Red Flag</text>
                <text x={`${target * 2 + 12}`} y="97" transform={`rotate(-35, ${target * 2 + 12}, 97)`} text-anchor="end" font-size="10">Target</text>*/}
            </svg>
        </div>
    );
};

export default KpiMeter;

