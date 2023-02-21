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
            console.log("This is the data fetched from get-kpis",data);
            setProps(data);
        };
        setIsLoading(true);
        fetchProps();
        setIsLoading(false);
    }, [leadSource, dateRange]);

    console.log("These are the props: ", props);

    return (
        <div className=''>
            <div className="flex flex-col mx-auto py-10 px-5">
                <h1 className="text-3xl text-center mb-10">KPI Dashboard</h1>
                <div className="flex flex-row justify-end mb-10 w-3/4 mx-auto">
                    <div>
                        <label className='mr-2'>
                            Lead Source:
                        </label>
                        <select id="leadSource" className="p-2 border rounded text-blue-800" value={leadSource} onChange={e => setLeadSource(e.target.value)}>
                            <option value="all">All</option>
                            {isLoading ? "...Loading" : leadSources.map(value => (<option key={value} value={value}>{value}</option>))}
                        </select>
                    </div>
                    <div className="mx-10">
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
                <section className="flex flex-row content-center justify-center bg-white rounded-lg w-3/4 mx-auto">
                    <div className='flex flex-wrap'>
                        {isLoading ? <div>"Loading..."</div> :
                            props.map(prop => (
                                <KpiCard prop={prop} isLoading={isLoading}></KpiCard>
                            ))}
                    </div>
                </section>
            </div>
        </div>
    )
}