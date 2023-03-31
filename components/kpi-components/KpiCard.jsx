import KpiMeter from './KpiMeter'
//import CountUp from 'react-countup'
import { useState } from 'react'

export default function CostPerAcquisition({ prop }) {

    //const startValue = 0;
    const [isFlipped, setIsFlipped] = useState(false);

    function handleClick() {
        setIsFlipped(!isFlipped);
    }

    return (
        <div className="box-border flip-container" onClick={handleClick}>
            <div className={`box-border flipper ${isFlipped ? 'flipped' : ''}`}>
                <div className="box-border py-4 text-center text-black delay-500 rounded w-68 xs:w-76 sm:w-80 h-60 shadow-super-3 transform-gpu front">
                    <h1 className="text-2xl font-semibold tracking-tighter align-top">{prop.name}</h1>
                    <div className="mt-3 font-medium text-md">
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
                <div className="box-border py-4 ml-8 overflow-hidden transition-all delay-500 bg-white rounded w-68 xs:w-76 sm:w-80 transform-gpu h-60 back shadow-super-3">
                    {prop.kpiFactors ? prop.kpiFactors.map((factor) => {
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
                                        <div><a href={factor.link} target="_blank">{factor.linkName}</a></div>
                                    </div>
                                </li>                            
                        )
                    }
                    ) : "TBD"}
                </div>
            </div>
        </div>
    )
};