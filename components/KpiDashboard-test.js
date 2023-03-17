import React, { useState, useEffect, useRef } from 'react'
import KpiCard from '../components/kpi-components/KpiCard'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Mousewheel, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller } from 'swiper';
import 'swiper/css'
import 'swiper/css/scrollbar'
import 'swiper/css/mousewheel'
import SubQuery from './kpi-components/SubQuery'
import Dropdown from './kpi-components/Dropdown'
import SingleDateRangeSelector from './kpi-components/SingleDateRangeSelector'
import { getStartOfLastWeek, getEndOfLastWeek, getStartOfLastMonth, getEndOfLastMonth, getStartOfLastQuarter, getEndOfLastQuarter } from '../lib/date-utils.js'


export default function kpiDashboard() {
    const startOfLastWeek = getStartOfLastWeek();
    const endOfLastWeek = getEndOfLastWeek();
    const startOfLastMonth = getStartOfLastMonth();
    const endOfLastMonth = getEndOfLastMonth();
    const startOfLastQuarter = getStartOfLastQuarter();
    const endOfLastQuarter = getEndOfLastQuarter();

    const [dateRange, setDateRange] = useState({ gte: startOfLastWeek, lte: endOfLastWeek });
    const [isLoading, setIsLoading] = useState(true);
    const [leadSources, setLeadSources] = useState(["All"]);
    const [leadSource, setLeadSource] = useState("All");
    const [queries, setQueries] = useState([]);
    const [idCounter, setIdCounter] = useState(1);
    const [swiperControllers, setSwiperControllers] = useState([]);
    const swiperRef = useRef(null);

    // Main query state
    const [mainQueryDateRange, setMainQueryDateRange] = useState({ gte: startOfLastWeek, lte: endOfLastWeek });
    const [mainQueryLeadSource, setMainQueryLeadSource] = useState("All");
    const [mainQuery, setMainQuery] = useState({ id: 0, results: [], isOpen: true, dateRange: mainQueryDateRange, leadSource: mainQueryLeadSource });

    // Get the KPIs for the main query on page load
    const fetchMainKpis = async () => {
        setIsLoading(true);
        fetch(`/api/get-kpis?leadSource=${mainQueryLeadSource}&gte=${mainQueryDateRange.gte}&lte=${mainQueryDateRange.lte}`)
            .then(response => response.json())
            .then(data => {
                setMainQuery(prevState => ({ ...prevState, results: data }));
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);
            }
            );
    };
    // Get the KPIs for the main query on page load
    //fetchMainKpis();

    const handleFormSubmit = (event) => {
        event.preventDefault();
        fetchMainKpis();
        console.log("Fetch Main KPIs was called");
    };

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

    // Update the selected query's results when the date range or lead source is changed
    const handleQueryUpdate = async (id, dateRange, leadSource) => {
        // Find the query with the specified ID
        const queryToUpdate = queries.find(query => query.id === id);
        // Update the query's dateRange and leadSource properties
        queryToUpdate.dateRange = dateRange;
        queryToUpdate.leadSource = leadSource;
        // Make an API call to fetch the updated KPI data for the query
        const data = await fetch(`/api/get-kpis?leadSource=${queryToUpdate.leadSource}&gte=${queryToUpdate.dateRange.gte}&lte=${queryToUpdate.dateRange.lte}`);
        const updatedResults = await data.json();
        // Update the query's results property with the new KPI data
        queryToUpdate.results = updatedResults;
        // Update the queries state with the updated query
        setQueries([...queries.filter(query => query.id !== id), queryToUpdate]);
    };

    // Fetch lead sources on page load
    useEffect(() => {
        const fetchLeadSources = async () => {
            // pass in date range to get unique lead sources for that date range
            const res = await fetch(`/api/lead-sources`)
            const data = await res.json();
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

    // Handle adding a new query
    const handleAddQuery = () => {
        const newQuery = {
            id: idCounter,
            results: [],
            isOpen: true,
            leadSource: 'All',
            dateRange: { gte: startOfLastWeek, lte: endOfLastWeek },
        };
        setIdCounter(idCounter + 1);
        setQueries([...queries, newQuery]);
    };

    useEffect(() => {
        // get the newly added query
        const newQuery = queries.find(query => query.id === idCounter - 1);
        if (newQuery) {
            handleQueryUpdate(newQuery.id, newQuery.dateRange, newQuery.leadSource);
        }
    }, [idCounter]);

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

                <section className="flex flex-col w-full h-full p-4">
                    {/* KPI Results Section */}
                    <div className="w-screen mb-2 divide-y-2 xl:w-full">
                        {/* Main KPI Results */}
                        <div key={mainQuery.id} className="p-2 bg-white shadow-super-3 rounded-xl">

                            <div className="flex justify-between px-4 py-2 text-sm rounded-lg shadow-super-3 sm:text-md xl:text-lg bg-gradient-to-r from-blue-600 via-blue-800 to-blue-500 text-gray-50">
                                <button className="" onClick={() => handleToggleQuery(mainQuery.id)}>
                                    {mainQuery.isOpen ? "Hide" : "Show"}
                                </button>
                                <div className=''>
                                    <div className='flex justify-between gap-4'>
                                        {/* Lead Source and Date Range Selectors */}
                                        <div className='flex justify-between gap-2'>
                                            {/* Lead Source selector */}
                                            <label className=''>
                                                Lead Source:
                                            </label>
                                            <Dropdown selectedOption={mainQueryLeadSource} onOptionSelected={handleOptionSelected} data={leadSources} queryId={mainQuery.id} />
                                        </div>
                                        <div className="flex justify-between gap-2">
                                            {/* Date range selector */}
                                            <label htmlFor="dateRange" className="">
                                                Date range: {mainQueryDateRange && mainQueryDateRange.gte && mainQueryDateRange.lte ?
                                                    mainQueryDateRange.gte.toLocaleDateString() + " - " + mainQueryDateRange.lte.toLocaleDateString() : ""}
                                            </label>
                                            <SingleDateRangeSelector queryId={mainQuery.id} onDateRangeChange={handleDateRangeChange} />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={(event) => handleFormSubmit(event)}
                                    className="box-border px-4 text-blue-900 transition-colors duration-200 bg-gray-200 rounded-md ring-offset-4 ring-offset-teal-100 shadow-super-4 hover:bg-gray-100"
                                >
                                    Get KPIs
                                </button>
                            </div>
                            {mainQuery.isOpen && (
                                <div className='relative px-4'>

                                    {/* SWIPER FOR KPI CARDS */}
                                    <Swiper

                                        spaceBetween={10}
                                        modules={[Scrollbar, Mousewheel]}
                                        scrollbar={{
                                            draggable: true,
                                            snapOnRelease: false,
                                        }}
                                        loop={false}
                                        slidesPerView={1}
                                        direction={'horizontal'}
                                        mousewheel={{
                                            sensitivity: 3,
                                            thresholdDelta: 1,
                                            thresholdTime: 50,
                                        }}

                                        breakpoints={{
                                            320: {
                                                slidesPerView: 1,

                                                spaceBetween: 20,
                                                slidesOffsetBefore: 0,
                                                slidesOffsetAfter: 0,
                                                centeredSlides: true,

                                            },
                                            375: {
                                                slidesPerView: 1,

                                                spaceBetween: 50,
                                                slidesOffsetBefore: 0,
                                                slidesOffsetAfter: 0,
                                                centeredSlides: true,
                                            },
                                            414: {
                                                slidesPerView: 1,

                                                spaceBetween: 50,
                                                slidesOffsetBefore: 15,
                                                slidesOffsetAfter: 0,
                                                centeredSlides: true,
                                            },
                                            768: {
                                                slidesPerView: 2,

                                                spaceBetween: 0,
                                                slidesOffsetBefore: 5,
                                                slidesOffsetAfter: 10,
                                                centeredSlides: false,
                                                centeredSlidesBounds: false,
                                            },
                                            1200: {
                                                slidesPerView: 3,

                                                spaceBetween: 10,
                                                slidesOffsetBefore: 25,
                                                slidesOffsetAfter: 20,
                                                centeredSlides: false,
                                                centeredSlidesBounds: false,
                                            },
                                            1400: {
                                                slidesPerView: 4,

                                                spaceBetween: 10,
                                                slidesOffsetBefore: 10,
                                                slidesOffsetAfter: 100,
                                                centeredSlides: false,
                                                centeredSlidesBounds: false,
                                            },
                                        }}
                                        onSlideChange={() => console.log('slide change')}
                                        onSwiper={swiper => console.log(swiper)}
                                        className="mx-auto mySwiper sm:w-full lg:max-w-8xl min-h-70"
                                    >
                                        <div className={`${mainQuery.isOpen && 'h-70'}`}>
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

                    {/* ADD NEW QUERY BUTTON */}
                    <div
                        id="add-query-btn"
                        className="flex items-center justify-center w-12 h-12 m-2 text-2xl text-white bg-blue-500 rounded-full cursor-pointer"
                        onClick={() => handleAddQuery()}
                    >
                        +
                    </div>

                </section>
            </div >
        </>
    )
}


