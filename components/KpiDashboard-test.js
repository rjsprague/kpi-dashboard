import React, { useState, useEffect, useRef } from 'react'
import KpiCard from '../components/kpi-components/KpiCard'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller } from 'swiper';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import SubQuery from './kpi-components/SubQuery'
import Dropdown from './kpi-components/Dropdown'
import SingleDateRangeSelector from './kpi-components/SingleDateRangeSelector'

export default function kpiDashboard() {

    const [dateRange, setDateRange] = useState({ gte: null, lte: null });
    const [isLoading, setIsLoading] = useState(true);
    const [leadSources, setLeadSources] = useState(["All"]);
    const [leadSource, setLeadSource] = useState("All");
    const [queries, setQueries] = useState([]);
    const [idCounter, setIdCounter] = useState(1);
    const [swiperControllers, setSwiperControllers] = useState([]);
    const swiperRef = useRef(null);

    // Main query state
    const [mainQueryDateRange, setMainQueryDateRange] = useState({ gte: null, lte: null });
    const [mainQueryLeadSource, setMainQueryLeadSource] = useState("All");
    const [mainQuery, setMainQuery] = useState({ id: 0, results: [], isOpen: true, dateRange: mainQueryDateRange, leadSource: mainQueryLeadSource });

    // Get the KPIs for the main query on page load
    useEffect(() => {
        const fetchMainKpis = async () => {
            const data = await fetch(`/api/get-kpis?leadSource=${mainQueryLeadSource}&gte=${mainQueryDateRange.gte}&lte=${mainQueryDateRange.lte}`);
            const queryResults = await data.json();
            setMainQuery(prevState => ({ ...prevState, results: queryResults }));
        };
        setIsLoading(true);
        fetchMainKpis();
        setIsLoading(false);
    }, [mainQueryLeadSource, mainQueryDateRange]);

    // Handle toggling the open/closed state of set of KPI cards
    const handleToggleQuery = queryId => {
        if (queryId === 0) {
            setMainQuery(prevQuery => {
                return { ...prevQuery, isOpen: !prevQuery.isOpen }
            });
        } else {
            setQueries(
                queries.map(query =>
                    query.id === queryId ? { ...query, isOpen: !query.isOpen } : query
                )
            );
        }
    };

    // Handle removing a list of KPI cards from the list
    const handleRemoveQuery = queryId => {
        setQueries(queries.filter(query => query.id !== queryId));
    };

    // Handle form submission to get KPIs
    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = await fetch(`/api/get-kpis?leadSourceJsonString=${leadSource}&dateRange=${dateRange}`);
        const queryResults = await data.json();
        const newQuery = { id: idCounter, results: queryResults, isOpen: true, dateRange: dateRange, leadSource: leadSource };

        setQueries([...queries, newQuery]);
        setIdCounter(idCounter + 1);


    };

    // Update the selected query's results when the date range or lead source is changed
    const handleQueryUpdate = async (id, dateRange, leadSource) => {
        console.log('updating query with id', id, 'to date range', dateRange, 'and lead source', leadSource);

        // Find the query with the specified ID
        const queryToUpdate = queries.find(query => query.id === id);

        // Update the query's dateRange and leadSource properties
        queryToUpdate.dateRange = dateRange;
        queryToUpdate.leadSource = leadSource;

        // Make an API call to fetch the updated KPI data for the query
        const data = await fetch(`/api/get-kpis?leadSourceJsonString=${queryToUpdate.leadSource}&gte=${queryToUpdate.dateRange.gte}&lte=${queryToUpdate.dateRange.lte}`);
        const updatedResults = await data.json();

        // Update the query's results property with the new KPI data
        queryToUpdate.results = updatedResults;

        // Update the queries state with the updated query
        setQueries([...queries]);
    };

    // Fetch lead sources on page load
    useEffect(() => {
        const fetchLeadSources = async () => {
            // pass in date range to get unique lead sources for that date range
            const res = await fetch(`/api/lead-sources`)
            const data = await res.json();
            console.log('lead sources', data);
            setLeadSources(data);
        };
        setIsLoading(true);
        fetchLeadSources();
        setIsLoading(false);
    }, []);

    // Handle leadSource dropdown selection changes, updating the state
    function handleOptionSelected(e, queryId) {
        const selectedLeadSource = e.target.value;

        if (queryId === mainQuery.id) {
            setMainQueryLeadSource(selectedLeadSource);
        } else {
            setQueries((prevQueries) => {
                return prevQueries.map((query) => {
                    if (query.id === queryId) {
                        return { ...query, leadSource: selectedLeadSource };
                    }
                    return query;
                });
            });
        }
    }

    // Handle date range selection changes, updating the state
    function handleDateRangeChange(startDate, endDate, queryId) {
        if (queryId === mainQuery.id) {
            setMainQueryDateRange({ gte: startDate, lte: endDate });
        } else {
            setQueries((prevQueries) => {
                return prevQueries.map((query) => {
                    if (query.id === queryId) {
                        return { ...query, dateRange: { gte: startDate, lte: endDate } };
                    }
                    return query;
                });
            });
        }
    }

    return (
        <>
            <div className="flex flex-col w-full min-h-screen">
                <section>
                    {/* Navigation bar */}
                    <div className="flex flex-row flex-wrap bg-blue-600 shadow-blue-300 shadow-super-2">
                        <div className="w-full pt-2 pr-2 shadow-super-2">
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row gap-4">
                                    <div className="px-4">
                                        {/* Title and subtitle */}
                                        <h4 className="mb-1 text-2xl font-bold leading-6 tracking-wide text-white xl:text-3xl lg:text-2xl">KPI Dashboard</h4>
                                        <p className="hidden text-xs leading-5 text-gray-300 sm:block">Track and analyze your KPIs to unlock your business's full potential and drive growth!</p>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className='flex flex-row flex-wrap items-center gap-4'>

                                            <button
                                                type="submit"

                                                className="box-border flex items-center justify-center w-20 h-10 px-4 py-0 font-bold text-center text-blue-100 transition-all transform border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-600 via-blue-800 to-blue-400 text-md hover:scale-110 ">Submit</button>

                                        </div>
                                    </form>
                                </div>
                                <div className="relative px-2">
                                    {/* KPIs Settings Menu */}
                                    <a className="inline-block text-gray-200 hover:text-gray-100" href="#">
                                        <svg width="4" height="18" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 4C2.39556 4 2.78224 3.8827 3.11114 3.66294C3.44004 3.44318 3.69639 3.13082 3.84776 2.76537C3.99914 2.39992 4.03874 1.99778 3.96157 1.60982C3.8844 1.22186 3.69392 0.865492 3.41421 0.585787C3.13451 0.306082 2.77814 0.115601 2.39018 0.0384303C2.00222 -0.0387401 1.60009 0.000866562 1.23463 0.152242C0.869182 0.303617 0.556825 0.559962 0.337062 0.88886C0.117299 1.21776 1.07779e-06 1.60444 1.07779e-06 2C1.07779e-06 2.53043 0.210715 3.03914 0.585788 3.41421C0.960861 3.78929 1.46957 4 2 4ZM2 14C1.60444 14 1.21776 14.1173 0.888861 14.3371C0.559963 14.5568 0.303617 14.8692 0.152242 15.2346C0.000866562 15.6001 -0.0387401 16.0022 0.0384303 16.3902C0.115601 16.7781 0.306083 17.1345 0.585788 17.4142C0.865493 17.6939 1.22186 17.8844 1.60982 17.9616C1.99778 18.0387 2.39992 17.9991 2.76537 17.8478C3.13082 17.6964 3.44318 17.44 3.66294 17.1111C3.8827 16.7822 4 16.3956 4 16C4 15.4696 3.78929 14.9609 3.41421 14.5858C3.03914 14.2107 2.53043 14 2 14ZM2 7C1.60444 7 1.21776 7.1173 0.888861 7.33706C0.559963 7.55682 0.303617 7.86918 0.152242 8.23463C0.000866562 8.60009 -0.0387401 9.00222 0.0384303 9.39018C0.115601 9.77814 0.306083 10.1345 0.585788 10.4142C0.865493 10.6939 1.22186 10.8844 1.60982 10.9616C1.99778 11.0387 2.39992 10.9991 2.76537 10.8478C3.13082 10.6964 3.44318 10.44 3.66294 10.1111C3.8827 9.78224 4 9.39556 4 9C4 8.46957 3.78929 7.96086 3.41421 7.58579C3.03914 7.21071 2.53043 7 2 7Z" fill="currentColor"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <ul className="flex flex-wrap items-center mt-5 lg:mt-4">
                                {/* KPIs by User Type */}
                                <li className=""><a className="inline-block py-1.5 px-4 text-sm text-white font-bold leading-6 focus:bg-blue-400 focus:text-blue-900 hover:bg-blue-400 rounded-lg" href="#">Business</a></li>
                                <li className=""><a className="inline-block py-1.5 px-4 text-sm text-white font-bold leading-6 focus:bg-blue-400 focus:text-blue-900 hover:bg-blue-400 rounded-lg" href="#">Team Members</a></li>
                                <li className=""><a className="inline-block py-1.5 px-4 text-sm text-white font-bold leading-6 focus:bg-blue-400 focus:text-blue-900 hover:bg-blue-400 rounded-lg" href="#">Leaderboard</a></li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col w-full h-full text-black">
                    {/* KPI Results Section */}
                    <div className="w-auto m-4 divide-y-2">
                        {/* Main KPI Results */}
                        <div key={mainQuery.id} className="p-2 bg-white justify-items-start shadow-super-3 rounded-xl">
                            <div className="flex justify-start px-4 py-2 text-sm rounded-lg sm:text-md xl:text-lg sm:font-bold bg-gradient-to-r from-blue-600 via-blue-800 to-blue-500 text-gray-50">
                                <button className="mr-40" onClick={() => handleToggleQuery(mainQuery.id)}>
                                    {mainQuery.isOpen ? "Hide" : "Show"}
                                </button>
                                <div className='flex justify-center text-lg font-semibold'>
                                    <div className='flex flex-row flex-wrap items-center gap-4'>
                                        {/* Lead Source and Date Range Selectors */}
                                        <div className='flex'>
                                            {/* Lead Source selector */}
                                            <label className='mr-2 text-gray-100'>
                                                Lead Source:
                                            </label>
                                            <Dropdown selectedOption={mainQueryLeadSource} onOptionSelected={handleOptionSelected} data={leadSources} queryId={mainQuery.id} />
                                        </div>
                                        <div className="flex mr-40 ">
                                            {/* Date range selector */}
                                            <label htmlFor="dateRange" className="mr-40 text-sm text-gray-100 w-60">
                                                Date range: {mainQueryDateRange && mainQueryDateRange.gte && mainQueryDateRange.lte ? 
                                                            mainQueryDateRange.gte.toLocaleDateString() + " - " + mainQueryDateRange.lte.toLocaleDateString() : ""}
                                            </label>

                                            <SingleDateRangeSelector queryId={mainQuery.id} onDateRangeChange={handleDateRangeChange} />
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {mainQuery.isOpen && (
                                <div className='relative px-4 min-h-70'>

                                    {/* SWIPER FOR KPI CARDS */}
                                    <Swiper

                                        spaceBetween={10}
                                        modules={[Scrollbar]}
                                        scrollbar={{
                                            draggable: true,
                                            snapOnRelease: false,
                                        }}
                                        loop={false}
                                        slidesPerView={1}
                                        direction={'horizontal'}
                                        breakpoints={{
                                            320: {
                                                slidesPerView: 1,
                                                slidesPerGroup: 1,
                                                spaceBetween: 20,
                                                slidesOffsetBefore: 0,
                                                slidesOffsetAfter: 0,
                                                centeredSlides: true,

                                            },
                                            375: {
                                                slidesPerView: 1,
                                                slidesPerGroup: 1,
                                                spaceBetween: 50,
                                                slidesOffsetBefore: 25,
                                                slidesOffsetAfter: 25,
                                                centeredSlides: true,
                                            },
                                            414: {
                                                slidesPerView: 1,
                                                slidesPerGroup: 1,
                                                spaceBetween: 50,
                                                slidesOffsetBefore: 50,
                                                slidesOffsetAfter: 50,
                                                centeredSlides: true,
                                                grabCursor: true,
                                            },
                                            768: {
                                                slidesPerView: 2,
                                                slidesPerGroup: 1,
                                                spaceBetween: 0,
                                                slidesOffsetBefore: 5,
                                                slidesOffsetAfter: 10,
                                                centeredSlides: false,
                                                centeredSlidesBounds: false,
                                            },
                                            1200: {
                                                slidesPerView: 3,
                                                slidesPerGroup: 1,
                                                spaceBetween: 10,
                                                slidesOffsetBefore: 25,
                                                slidesOffsetAfter: 20,
                                                centeredSlides: false,
                                                centeredSlidesBounds: false,
                                            },
                                            1400: {
                                                slidesPerView: 4,
                                                slidesPerGroup: 1,
                                                spaceBetween: 10,
                                                slidesOffsetBefore: 10,
                                                slidesOffsetAfter: 100,
                                                centeredSlides: false,
                                                centeredSlidesBounds: false,
                                            },
                                        }}
                                        onSlideChange={() => console.log('slide change')}
                                        onSwiper={swiper => console.log(swiper)}

                                        className="w-screen mx-auto mySwiper sm:w-full lg:max-w-8xl min-h-70"
                                    >
                                        <div className={`${mainQuery.isOpen && 'h-80'}`}>
                                            {mainQuery.isOpen &&
                                                mainQuery.results.map(result => (
                                                    <SwiperSlide key={result.id}>
                                                        <div key={result.id} className='my-3 h-60 w-80 backface'>
                                                            <KpiCard prop={result} />
                                                        </div>
                                                    </SwiperSlide>
                                                ))}
                                        </div>
                                    </Swiper>

                                </div>

                            )}
                        </div>
                    </div>
                    {/* END OF MAIN QUERY */}
                    {/* START OF SUBQUERIES */}

                    {queries.map(query => (
                        <SubQuery
                            key={query.id}
                            query={query}
                            leadSources={leadSources}
                            handleQueryUpdate={handleQueryUpdate}
                            handleToggleQuery={handleToggleQuery}
                            handleRemoveQuery={handleRemoveQuery}
                            handleOptionSelected={handleOptionSelected}
                            handleDateRangeChange={handleDateRangeChange}
                        />
                    ))}

                    {/* END OF SUBQUERIES */}


                </section>
            </div >
        </>
    )
}


