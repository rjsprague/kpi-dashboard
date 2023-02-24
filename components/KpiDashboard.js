import React, { useState, useEffect } from 'react';
import KpiCard from '../components/kpi-components/KpiCard'

export default function kpiDashboard() {

    const [dateRange, setDateRange] = useState("lastWeek");
    const [isLoading, setIsLoading] = useState(true);

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
        //setIsLoading(false);
    }, []);

    useEffect(() => {
        const fetchProps = async () => {
            const response = await fetch(`/api/get-kpis?leadSource=${leadSource}&dateRange=${dateRange}`);
            const data = await response.json();
            setProps(data);
        };
        setIsLoading(true);
        fetchProps();
        setIsLoading(false);
    }, [leadSource, dateRange]);

    return (

        <div className="flex flex-col min-h-screen ">
            <section>
                <div className="flex flex-row flex-wrap bg-gradient-to-b from-blue-800 to-blue-600 ">
                    <div className="w-full pt-2 pr-2">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-4">
                                <div className="px-4">
                                    <h4 className="mb-1 text-2xl font-bold leading-6 tracking-wide text-white xl:text-3xl lg:text-2xl">KPI Dashboard</h4>
                                    <p className="hidden text-xs leading-5 text-gray-300 sm:block">Track and analyze your KPIs to unlock your business's full potential and drive growth!</p>
                                </div>
                                <div className='flex flex-row flex-wrap items-center gap-4'>
                                    <div className='flex'>
                                        <label className='mr-2 text-gray-100'>
                                            Lead Source:
                                        </label>
                                        <select id="leadSource" className="h-8 w-28 rounded-md text-blue-800 {isLoading && animate-pulse}" value={leadSource} onChange={e => setLeadSource(e.target.value)}>
                                            {isLoading && <option>Loading...</option>}
                                            <option value="all">All</option>
                                            {!isLoading && leadSources.map(value => (<option key={value} value={value}>{value}</option>))}
                                        </select>
                                    </div>
                                    <div className="flex">
                                        <label htmlFor="dateRange" className="mr-4 text-gray-100">
                                            Date range:
                                        </label>
                                        <select
                                            id="dateRange"
                                            className="h-8 text-blue-800 rounded-md w-28"
                                            value={dateRange}
                                            onChange={(e) => setDateRange(e.target.value)}
                                        >
                                            <option value="lastWeek">Last Week</option>
                                            <option value="lastMonth">Last Month</option>
                                            <option value="lastQuarter">Last Quarter</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="relative px-2">
                                <a className="inline-block text-gray-200 hover:text-gray-100" href="#">
                                    <svg width="4" height="18" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 4C2.39556 4 2.78224 3.8827 3.11114 3.66294C3.44004 3.44318 3.69639 3.13082 3.84776 2.76537C3.99914 2.39992 4.03874 1.99778 3.96157 1.60982C3.8844 1.22186 3.69392 0.865492 3.41421 0.585787C3.13451 0.306082 2.77814 0.115601 2.39018 0.0384303C2.00222 -0.0387401 1.60009 0.000866562 1.23463 0.152242C0.869182 0.303617 0.556825 0.559962 0.337062 0.88886C0.117299 1.21776 1.07779e-06 1.60444 1.07779e-06 2C1.07779e-06 2.53043 0.210715 3.03914 0.585788 3.41421C0.960861 3.78929 1.46957 4 2 4ZM2 14C1.60444 14 1.21776 14.1173 0.888861 14.3371C0.559963 14.5568 0.303617 14.8692 0.152242 15.2346C0.000866562 15.6001 -0.0387401 16.0022 0.0384303 16.3902C0.115601 16.7781 0.306083 17.1345 0.585788 17.4142C0.865493 17.6939 1.22186 17.8844 1.60982 17.9616C1.99778 18.0387 2.39992 17.9991 2.76537 17.8478C3.13082 17.6964 3.44318 17.44 3.66294 17.1111C3.8827 16.7822 4 16.3956 4 16C4 15.4696 3.78929 14.9609 3.41421 14.5858C3.03914 14.2107 2.53043 14 2 14ZM2 7C1.60444 7 1.21776 7.1173 0.888861 7.33706C0.559963 7.55682 0.303617 7.86918 0.152242 8.23463C0.000866562 8.60009 -0.0387401 9.00222 0.0384303 9.39018C0.115601 9.77814 0.306083 10.1345 0.585788 10.4142C0.865493 10.6939 1.22186 10.8844 1.60982 10.9616C1.99778 11.0387 2.39992 10.9991 2.76537 10.8478C3.13082 10.6964 3.44318 10.44 3.66294 10.1111C3.8827 9.78224 4 9.39556 4 9C4 8.46957 3.78929 7.96086 3.41421 7.58579C3.03914 7.21071 2.53043 7 2 7Z" fill="currentColor"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <ul className="flex flex-wrap items-center mt-5 lg:mt-4">
                            <li className=""><a className="inline-block py-1.5 px-4 text-sm text-white font-bold leading-6 focus:bg-blue-600 hover:bg-blue-400 rounded-tl-lg rounded-tr-lg" href="#">Business</a></li>
                            <li className=""><a className="inline-block py-1.5 px-4 text-sm text-white font-bold leading-6 focus:bg-blue-600 hover:bg-blue-500 rounded-tl-lg rounded-tr-lg" href="#">Lead Managers</a></li>
                            <li className=""><a className="inline-block py-1.5 px-4 text-sm text-white font-bold leading-6 focus:bg-blue-600 hover:bg-blue-500 rounded-tl-lg rounded-tr-lg" href="#">Deal Analyzers</a></li>
                            <li className=""><a className="inline-block py-1.5 px-4 text-sm text-white font-bold leading-6 focus:bg-blue-600 hover:bg-blue-500 rounded-tl-lg rounded-tr-lg" href="#">Acquisition Managers</a></li>
                            <li className=""><a className="inline-block py-1.5 px-4 text-sm text-white font-bold leading-6 focus:bg-blue-600 hover:bg-blue-500 rounded-tl-lg rounded-tr-lg" href="#">Etc</a></li>
                        </ul>
                    </div>
                </div>
            </section>
            {isLoading ?
                <section className="p-4">
                    <div className="container px-3 py-4 mx-auto animate-pulse">
                        <div className="grid grid-cols-1 gap-2 mt-2 xl:mt-2 xl:gap-2 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
                            <div className="w-full ">
                                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                            </div>
                            <div className="w-full ">
                                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                            </div>
                            <div className="w-full ">
                                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                            </div>
                            <div className="w-full ">
                                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                            </div>

                            <div className="w-full ">
                                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                            </div>

                            <div className="w-full ">
                                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                            </div>
                            <div className="w-full ">
                                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                            </div>
                            <div className="w-full ">
                                <div className="w-full h-64 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                            </div>
                        </div>
                    </div>
                </section>
                :
                <section className="min-h-screen px-3 py-1 text-gray-700 bg-white shadow-inner-lg shadow-blue-50 4xl:p-8">
                    <div className="grid grid-cols-1 gap-2 5xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 4xl:gap-4 justify-items-center">

                        {props.map(prop => (
                            <div className='w-88 h-60'>
                                <KpiCard className="" prop={prop} isLoading={isLoading}></KpiCard>
                            </div>
                        ))}

                    </div>
                    
                </section>}
        </div>

    )
}