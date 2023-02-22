import KpiMeter from './KpiMeter'
import CountUp from 'react-countup'

export default function CostPerAcquisition({ prop }) {
    
    const startValue = 0;
  

    return (
        <div className="flex flex-col bg-white rounded-sm shadow hover:shadow-xl transition-all ease-in-out m-1 p-2 w-80 h-80 min-w-full sm:min-w-0 text-center justify-center overflow-hidden">
            <h1 className="font-semibold text-2xl text-black tracking-tighter  align-top">{prop.name}</h1>
            <div className="my-6 text-lg font-medium text-black">
                {prop.data1 !== null && prop.data2 !== null ? <div className='mx-2 flex flex-row justify-around'><div>{prop.data1}</div><div>{prop.data2}</div> </div> : ""}
            </div>
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
                <div className=' align-middle justify-center w-full sm:mx-10'>
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