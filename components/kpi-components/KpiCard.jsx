import KpiMeter from './KpiMeter'
import CountUp from 'react-countup'
import { useState } from 'react'

export default function CostPerAcquisition({ prop }) {

    const startValue = 0;
    const [isFlipped, setIsFlipped] = useState(false);

    function handleClick() {
        setIsFlipped(!isFlipped);
    }

    return (
        <div className="box-border flip-container" onClick={handleClick}>
            <div className={`box-border flipper ${isFlipped ? 'flipped' : ''}`}>
                <div className="box-border w-full py-4 overflow-hidden text-center transition-all bg-white shadow-gray-100 shadow-inner-sm hover:shadow-inner transform-gpu drop-shadow-xl rounded-xl h-60 front">
                    <h1 className="text-2xl font-semibold tracking-tighter text-black align-top">{prop.name}</h1>
                    <div className="mt-3 font-medium text-black text-md">
                        {prop.data1 !== null && prop.data2 !== null ? <div className='flex flex-row justify-around mx-2'><div>{prop.data1}</div><div>{prop.data2}</div> </div> : ""}
                    </div>
                    <div className=''>
                        <KpiMeter
                            redFlag={prop.redFlag}
                            current={prop.current}
                            target={prop.target}
                            kpiName={prop.name}
                        />
                    </div>
                </div>
                <div className="box-border w-full py-4 overflow-hidden text-center transition-all bg-white shadow-gray-100 shadow-inner-sm hover:shadow-inner transform-gpu drop-shadow-xl rounded-xl h-60 back">
                    <h1>Back of the Card</h1>
                </div>
            </div>
        </div>
    )
};

/* 
                        prop.name === "Marketing Spend" || prop.name === "Deals" || prop.name === "Profit" || prop.name === "Avg Profit Per Deal" ?
                            <div className="flex flex-row justify-center text-4xl font-bold text-center text-black my-14">
                                {prop.name == "Deals" ? <p></p> : <p>$</p>}
                                <CountUp
                                    className='text-4xl text-black counter'
                                    start={startValue}
                                    end={prop.current}
                                    duration={1.5}
                                />
                            </div>

: */