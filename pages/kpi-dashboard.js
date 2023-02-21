import React, { useState, useEffect } from 'react';
import KpiCard from '../components/kpi-components/KpiCard'

export default function kpiDashboard() {

    const [dateRange, setDateRange] = useState("lastWeek");
    const [isLoading, setIsLoading] = useState(false);

    const [leadSources, setLeadSources] = useState(["all"]);
    const [leadSource, setLeadSource] = useState("all");

    const [props, setProps] = useState([]);

    useEffect(() => {

        const fetchLeadSources = async () => {
            const response = await fetch('/api/lead-sources');
            const data = await response.json();
            setLeadSources(data);
        };
        setIsLoading(true);
        fetchLeadSources();
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const fetchProps = async () => {
            const response = await fetch("/api/get-kpis", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ leadSource: leadSource, dateRange: dateRange }),
            });
            const data = await response.json();
            setProps(data);
        };
        setIsLoading(true);
        fetchProps();
        setIsLoading(false);
    }, [leadSource, dateRange]);

    return (
        
            <div className="py-10 px-5 w-3/4 mx-auto">
                <section className="flex-col flex-wrap gap-4 mb-8 justify-center bg-white rounded-lg p-3">
                    <h1 className="xl:text-3xl lg:text-2xl text-2xl flex-1 flex-row text-center text-blue-900 font-bold">KPI Dashboard</h1>
                    <div className='flex flex-row gap-2 md:justify-end'>
                        <div className='flex'>
                            <label className='mr-2'>
                                Lead Source:
                            </label>
                            <select id="leadSource" className="p-2 border rounded text-blue-800" value={leadSource} onChange={e => setLeadSource(e.target.value)}>
                                <option value="all">All</option>
                                {isLoading ? "...Loading" : leadSources.map(value => (<option key={value} value={value}>{value}</option>))}
                            </select>
                        </div>
                        <div className="flex">
                            <label htmlFor="dateRange" className="mr-2">
                                Date range:
                            </label>
                            <select
                                id="dateRange"
                                className="p-2 border rounded text-blue-800"
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                            >
                                <option value="lastWeek">Last Week</option>
                                <option value="lastMonth">Last Month</option>
                                <option value="lastQuarter">Last Quarter</option>
                            </select>
                        </div>
                    </div>
                </section>
                <section className="bg-white rounded-lg py-4">
                    <div className="container px-4 mx-auto md:flex md:flex-row flex-wrap justify-center">
                    {isLoading ? <div>"Loading..."</div> :
                        props.map(prop => (
                            <KpiCard prop={prop} isLoading={isLoading}></KpiCard>
                        ))}
                    </div>
                </section>
            </div>
        
    )
}