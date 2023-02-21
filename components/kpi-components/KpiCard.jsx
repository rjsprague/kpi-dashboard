import KpiMeter from './KpiMeter'
import CountUp from 'react-countup'

export default function CostPerAcquisition({ prop }) {
    
    const startValue = 0;
  

    return (
        <div className="flex flex-col bg-white border rounded-sm shadow hover:shadow-xl transition-all ease-in-out m-1 p-2 w-60 h-56 min-w-full sm:min-w-0 text-center mx-auto justify-center overflow-hidden">
            <h1 className="font-semibold text-xl text-black tracking-tighter mb-1">{prop.name}</h1>
            {/*<div className="mb-1 text-md font-medium text-black">
                {prop.data1 !== null && prop.data2 !== null ? prop.data1 + "/" + prop.data2 : ""}
            </div>*/}
            {
                prop.name==="Marketing Spend" || prop.name==="Deals" || prop.name==="Profit" || prop.name==="Avg Profit Per Deal" ?  
                    <div className="flex flex-row text-center justify-center text-4xl text-black font-bold my-14">
                    { prop.name=="Deals" ? <p></p> : <p>$</p> }
                    <CountUp 
                        className='text-4xl text-black counter'
                        start={startValue}
                        end={prop.current}
                        duration={1.5}
                    />
                    </div>
                
            :
                <div>
                    <KpiMeter
                        redFlag={prop.redFlag}
                        current={prop.current}
                        target={prop.target}
                        kpiName={prop.name}
                    />
                </div>
            }
        </div>
    )
};