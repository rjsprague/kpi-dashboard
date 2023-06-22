"use client";

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';


const SpeedToLeadMeter = ({ value, unit, target, redFlag }) => {
  const max = redFlag * 1.5;

  return (
    <div className="relative px-4 mt-4" style={{ height: '250px' }}>
      <Dial width={250} height={250} target={target} redFlag={redFlag} max={max} value={value} />
    </div>
  );
};

// Helper function to create SVG lines for each tick
const drawTicks = (numberOfTicks, tickLength, tickColor) => {
  const ticks = [];
  const maxAngle = 180; // as it's a semi-circle
  const angleStep = maxAngle / (numberOfTicks - 1);
  
  for(let i = 0; i < numberOfTicks; i++) {
    const angle = i * angleStep;
    const innerRadius = 125; // The radius of the semi-circle
    let outerRadius = innerRadius + (i % 5 === 0 ? tickLength : tickLength / 2);

    // Extend the first and the last ticks
    if (i === 0 || i === numberOfTicks - 1) {
      outerRadius = innerRadius + 50;
    }

    const startX = 225 + innerRadius * Math.cos(Math.PI * angle / 180);
    const startY = 200 - innerRadius * Math.sin(Math.PI * angle / 180);
    const endX = 225 + outerRadius * Math.cos(Math.PI * angle / 180);
    const endY = 200 - outerRadius * Math.sin(Math.PI * angle / 180);

    ticks.push(
      <line
        key={i}
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={tickColor}
        strokeWidth="2"
      />
    );
  }
  
  return ticks;
};


const Dial = ({ target, redFlag, max, value }) => {

  const needleRef = useRef(null);
  const colorRingRef = useRef(null);

  const targetPosition = (target / max) * 180;
  const redFlagPosition = (redFlag / max) * 180;
  const valuePosition = Math.min((value / max) * 180, 180);

  const redFlagTriangle = [
    { x: 225 + 195 * Math.cos((Math.PI / 180) * (180 - redFlagPosition)), y: 200 - 200 * Math.sin((Math.PI / 180) * (180 - redFlagPosition)) },
    { x: 225 + 180 * Math.cos((Math.PI / 180) * (180 - redFlagPosition)), y: 200 - 170 * Math.sin((Math.PI / 180) * (180 - redFlagPosition)) },
    { x: 225 + 195 * Math.cos((Math.PI / 180) * (180 - redFlagPosition - 4)), y: 200 - 200 * Math.sin((Math.PI / 180) * (180 - redFlagPosition - 4)) },
  ];

  const targetTriangle = [
    { x: 225 + 195 * Math.cos((Math.PI / 180) * (180 - targetPosition)), y: 200 - 200 * Math.sin((Math.PI / 180) * (180 - targetPosition)) },
    { x: 225 + 180 * Math.cos((Math.PI / 180) * (180 - targetPosition)), y: 200 - 170 * Math.sin((Math.PI / 180) * (180 - targetPosition)) },
    { x: 225 + 195 * Math.cos((Math.PI / 180) * (180 - targetPosition + 4)), y: 200 - 200 * Math.sin((Math.PI / 180) * (180 - targetPosition + 4)) },
  ];


  const fillColor = value <= target ? 'green' : value >= redFlag ? 'red' : 'yellow';

  useEffect(() => {
    const angle = Math.min((value / max) * 180, 180) >= 180 ? 180 : Math.min((value / max) * 180, 180);

    const totalLength = 2 * Math.PI * 150;
    const valueLength = totalLength * (valuePosition / 360);
    const initialOffset = totalLength * 0.5;

    // Set the initial rotation and strokeDashoffset
    gsap.set(needleRef.current, {
      rotation: 0,
      svgOrigin: "225 200"
    });

    gsap.set(colorRingRef.current, {
      strokeDashoffset: initialOffset,
      stroke: fillColor
    });

    // Animate from the initial values to the final values
    gsap.fromTo(
      needleRef.current,
      {
        rotation: 0
      },
      {
        rotation: angle,
        duration: 3,
        ease: "power3.out",
        svgOrigin: "225 200"
      }
    );

    gsap.fromTo(
      colorRingRef.current,
      {
        strokeDashoffset: initialOffset
      },
      {
        strokeDashoffset: initialOffset - valueLength,
        stroke: fillColor,
        duration: 3,
        ease: "power3.out"
      }
    );
  }, [value, max, fillColor, valuePosition]);

  return (
    <svg id="Meter" className='relative m-auto bottom-10 w-60 h-60' xmlns="http://www.w3.org/2000/svg" width="450" height="250" viewBox="0 0 450 250">
      <defs>
        <mask id="meterMask" maskUnits="userSpaceOnUse">
          <path id="maskRing" d="M75,200c0-82.29,67.71-150,150-150s150,67.71,150,150" fill="none" stroke="#fff" strokeMiterlimit="10" strokeWidth="56" />
        </mask>
      </defs>
      <rect id="background" width="450" height="250" fill="none" />
      <path id="baseRingDark" d="M75,200c0-82.29,67.71-150,150-150s150,67.71,150,150" fill="none" stroke="#444" strokeMiterlimit="10" strokeWidth="54" />
      <path id="baseRing" d="M75,200c0-82.29,67.71-150,150-150s150,67.71,150,150" fill="none" stroke="#888" strokeMiterlimit="10" strokeWidth="50" />
      <g mask="url(#meterMask)">
        <path
          ref={colorRingRef}
          id="colorRing"
          d="M75,200c0-82.29,67.71-150,150-150s150,67.71,150,150"
          fill="none"
          stroke="#5cceee"
          strokeMiterlimit="10"
          strokeWidth="50"
          strokeDasharray="471.24"
          strokeDashoffset="235.62"
        />
      </g>
      <polygon id="redFlagTriangle" points={`${redFlagTriangle[0].x},${redFlagTriangle[0].y} ${redFlagTriangle[1].x},${redFlagTriangle[1].y} ${redFlagTriangle[2].x},${redFlagTriangle[2].y}`} fill="black" />
      <polygon id="targetTriangle" points={`${targetTriangle[0].x},${targetTriangle[0].y} ${targetTriangle[1].x},${targetTriangle[1].y} ${targetTriangle[2].x},${targetTriangle[2].y}`} fill="black" />
      <path ref={needleRef} id="needle" d="M209.44,191,67,200l142.44,9a18,18,0,1,0,0-18Z" />
      <circle r="4" fill="white" cx="225" cy="200" />
      {drawTicks(36, 30, "black")}
    </svg>
  );
};

export default SpeedToLeadMeter;
