import React, { useState, useEffect, useRef } from 'react'
import KpiCard from '../components/kpi-components/KpiCard'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Mousewheel, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Controller } from 'swiper/core';
import 'swiper/css'
import 'swiper/css/scrollbar'
import 'swiper/css/mousewheel'

SwiperCore.use([Controller]);
import SubQuery from './kpi-components/SubQuery'
import Dropdown from './kpi-components/Dropdown'
import SingleDateRangeSelector from './kpi-components/SingleDateRangeSelector'
import { getStartOfLastWeek, getEndOfLastWeek, getStartOfLastMonth, getEndOfLastMonth, getStartOfLastQuarter, getEndOfLastQuarter } from '../lib/date-utils.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faPlus, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import BurgerMenu from './BurgerMenu'
import AnimateHeight from 'react-animate-height';

export default function kpiDashboard() {
    const startOfLastWeek = getStartOfLastWeek();
    const endOfLastWeek = getEndOfLastWeek();
    const startOfLastMonth = getStartOfLastMonth();
    const endOfLastMonth = getEndOfLastMonth();
    const startOfLastQuarter = getStartOfLastQuarter();
    const endOfLastQuarter = getEndOfLastQuarter();

    const [height, setHeight] = useState('auto');
    const [leadSources, setLeadSources] = useState([]);
    const [queries, setQueries] = useState([]);
    const [idCounter, setIdCounter] = useState(1);
    const [isLoading, setIsLoading] = useState({});

    // Swiper state
    const [swiperMain, setSwiperMain] = useState(null);
    const swiperSubs = useRef([]);

    // Main query state
    const [mainQueryDateRange, setMainQueryDateRange] = useState({ gte: startOfLastWeek, lte: endOfLastWeek });
    const [mainQueryLeadSource, setMainQueryLeadSource] = useState([]);
    const [mainQuery, setMainQuery] = useState({ id: 0, results: [], isOpen: true, isLoading: true, isUnavailable: false, dateRange: mainQueryDateRange, leadSource: mainQueryLeadSource });

    // Fetch lead sources on page load
    useEffect(() => {
        const fetchLeadSources = async () => {
            const res = await fetch(`/api/lead-sources`)
            const data = await res.json();
            setLeadSources(data);
            const fetchedLeadSources = Object.values(data);
            setMainQueryLeadSource(fetchedLeadSources);
        };
        fetchLeadSources();
    }, []);

    // Get the KPIs for the main query on page load
    const fetchMainKpis = async (leadSourcesToFetch) => {
        setMainQuery(prevState => ({ ...prevState, isLoading: true }));
        fetch(`/api/get-kpis?leadSourceParam=${leadSourcesToFetch || mainQueryLeadSource}&gte=${mainQueryDateRange.gte}&lte=${mainQueryDateRange.lte}`)
            .then(response => {
                if (response.status !== 200) {
                    setMainQuery(prevState => ({ ...prevState, isUnavailable: true }));
                    throw new Error('Service unavailable');
                } else {
                    setMainQuery(prevState => ({ ...prevState, isUnavailable: false }));
                }
                return response.json();
            })
            .then(data => {
                setMainQuery(prevState => ({ ...prevState, results: data }));
                setMainQuery(prevState => ({ ...prevState, isLoading: false }));
            })
            .catch(error => {
                console.log(error);
                setMainQuery(prevState => ({ ...prevState, isUnavailable: true }));
                setMainQuery(prevState => ({ ...prevState, isLoading: false }));
            });

    };

    useEffect(() => {
        if (mainQueryDateRange && mainQueryLeadSource && mainQueryLeadSource.length > 0) {
            fetchMainKpis();
        }
    }, [mainQueryDateRange, mainQueryLeadSource]);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        fetchMainKpis();
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

    // Handle updating the date range and lead source for a query
    const handleQueryUpdate = async (id, dateRange, leadSource) => {

        setIsLoading((prevState) => ({
            ...prevState,
            [id]: true,
        }));
        // Find the query with the specified ID
        const queryToUpdate = queries.find(query => query.id === id);
        // Update the query's dateRange and leadSource properties
        queryToUpdate.isLoading = true;
        queryToUpdate.dateRange = dateRange;
        queryToUpdate.leadSource = leadSource;
        // Make an API call to fetch the updated KPI data for the query
        fetch(`/api/get-kpis?leadSourceParam=${queryToUpdate.leadSource}&gte=${queryToUpdate.dateRange.gte}&lte=${queryToUpdate.dateRange.lte}`)
            .then(response => {
                if (response.status !== 200) {
                    // Update only the isUnavailable property for the query with the specified ID
                    queryToUpdate.isUnavailable = true;
                    setQueries([...queries.filter(query => query.id !== id), queryToUpdate]);
                    setIsLoading((prevState) => ({...prevState, [id]: false }));                
                    throw new Error('Service unavailable');                    
                } else {
                    // Reset the isUnavailable property for the query with the specified ID
                    queryToUpdate.isUnavailable = false;
                    setQueries([...queries.filter(query => query.id !== id), queryToUpdate]);
                    setIsLoading((prevState) => ({...prevState, [id]: false }));                
                }
                return response.json();
            })
            .then(data => {
                // Update the query's results property with the new KPI data
                queryToUpdate.results = data;
                // Update the queries state with the updated query
                setQueries([...queries.filter(query => query.id !== id), queryToUpdate]);
                setIsLoading((prevState) => ({...prevState, [id]: false }));                
            })
            .catch(error => {
                console.log(error);
                queryToUpdate.isUnavailable = true;
                setQueries([...queries.filter(query => query.id !== id), queryToUpdate]);
                setIsLoading((prevState) => ({...prevState, [id]: false }));                
            });
    };

    // Handle leadSource dropdown selection changes, updating the state
    const handleOptionSelected = (values, queryId) => {

        if (queryId === mainQuery.id) {
            setMainQueryLeadSource(values);
        } else {
            setQueries((prevQueries) => {
                return prevQueries.map((query) => {
                    if (query.id === queryId) {
                        return { ...query, leadSource: values };
                    }
                    return query;
                });
            });
        }
    };

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
            isLoading: true,
            isUnavailable: false,
            leadSource: Object.values(leadSources),
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

    // Update the controller when the main swiper or sub swipers are updated
    useEffect(() => {
        if (swiperMain && swiperSubs.length > 0) {
            swiperMain.controller.control = swiperSubs;
            swiperSubs.forEach((sub) => {
                sub.controller.control = swiperMain;
            });
        }
    }, [swiperMain, swiperSubs.current]);

    // Handle the sub swiper controller array
    const handleSwiperSub = (swiper) => {
        swiperSubs.current = [...swiperSubs.current, swiper];
    };

    return (
        <>
            <div className="flex flex-col min-h-screen">

                <section>
                    {/* Navigation bar */}
                    <div className="flex flex-row flex-wrap bg-blue-600">
                        <div className="w-full pt-2 pr-2 shadow-super-2">
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row gap-4">
                                    <div className="px-4">
                                        {/* Title and subtitle */}
                                        <h4 className="mb-1 text-2xl font-bold leading-6 tracking-wide text-white xl:text-3xl lg:text-2xl">KPI Dashboard</h4>
                                        <p className="hidden text-xs leading-5 text-gray-100 sm:block">Track and analyze your KPIs to unlock your business's full potential and drive growth!</p>
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

                <section className="flex flex-col h-full px-4 py-2">
                    {/* KPI Results Section */}
                    <div className="mb-2">
                        {/* Main KPI Results */}
                        <div className="px-4 py-2 text-sm rounded-lg shadow-super-3 bg-gradient-to-r from-blue-600 via-blue-800 to-blue-500 text-gray-50">
                            <div className='relative flex-row items-center hidden gap-2 align-middle md:justify-center md:flex'>
                                <button
                                    className="box-border absolute px-2 py-1 text-blue-900 transition-shadow duration-500 bg-white rounded-md left-0.5 shadow-super-4 hover:animate-pulse"
                                    onClick={() => {
                                        handleToggleQuery(mainQuery.id)
                                        setHeight(height === 0 ? 'auto' : 0)
                                    }}
                                >
                                    {mainQuery.isOpen ?
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            size="md"
                                            className='text-blue-900 transition-transform duration-500 rotate-180 transform-gpu'
                                        /> :
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            size="md"
                                            className='text-blue-900 transition-transform duration-500 transform-gpu'
                                        />
                                    }
                                </button>
                                <div className='flex items-center '>
                                    <div className='flex items-center justify-between gap-4 align-middle'>
                                        {/* Lead Source and Date Range Selectors */}
                                        <div className='flex items-center justify-between gap-2 align-middle'>
                                            {/* Lead Source selector */}
                                            <label className=''>
                                                Lead Source:
                                            </label>
                                            <Dropdown
                                                onOptionSelected={handleOptionSelected}
                                                data={leadSources}
                                                queryId={mainQuery.id}
                                            />
                                        </div>
                                        <div className="flex justify-between gap-2">
                                            {/* Date range selector */}
                                            <SingleDateRangeSelector queryId={mainQuery.id} onDateRangeChange={handleDateRangeChange} />
                                        </div>
                                        {/* <button
                                            type="button"
                                            onClick={(event) => handleFormSubmit(event)}
                                            className="box-border px-2 py-1 text-blue-900 transition-colors duration-200 bg-white rounded-md shadow-super-4 hover:bg-blue-50"
                                        >
                                            Get KPIs
                                </button> */}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between md:hidden">
                                <button
                                    className="box-border block px-4 text-blue-900 transition-shadow duration-500 bg-white rounded-md md:hidden shadow-super-4 hover:animate-pulse"
                                    onClick={() => {
                                        handleToggleQuery(mainQuery.id)
                                        setHeight(height === 0 ? 'auto' : 0)
                                    }}
                                >
                                    {mainQuery.isOpen ?
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            size="lg"
                                            className='text-blue-900 transition-transform duration-500 rotate-180 transform-gpu'
                                        /> :
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            size="lg"
                                            className='text-blue-900 transition-transform duration-500 transform-gpu'
                                        />}
                                </button>
                                <BurgerMenu >
                                    <div className='flex-col flex-wrap gap-4'>
                                        <div className='flex flex-col'>
                                            {/* Lead Source and Date Range Selectors */}
                                            <div className='flex flex-col gap-2'>
                                                {/* Lead Source selector */}
                                                <label className='flex'>
                                                    Lead Source:
                                                </label>
                                                <Dropdown
                                                    onOptionSelected={handleOptionSelected}
                                                    data={leadSources}
                                                    queryId={mainQuery.id}
                                                    limit={10}
                                                />
                                            </div>
                                            <div className="flex flex-col flex-wrap gap-2 mt-4">
                                                {/* Date range selector */}
                                                <label htmlFor="dateRange" className="flex">
                                                    Date range: {mainQueryDateRange && mainQueryDateRange.gte && mainQueryDateRange.lte ?
                                                        mainQueryDateRange.gte.toLocaleDateString() + " - " + mainQueryDateRange.lte.toLocaleDateString() : ""}
                                                </label>
                                                <SingleDateRangeSelector queryId={mainQuery.id} onDateRangeChange={handleDateRangeChange} />
                                            </div>
                                        </div>
                                    </div>
                                    {/*<button
                                        type="button"
                                        onClick={(event) => handleFormSubmit(event)}
                                        className="box-border px-4 py-2 text-blue-900 transition-colors duration-200 bg-white rounded-md shadow-super-4 hover:bg-gray-100"
                                    >
                                        Get KPIs
                                                    </button>*/}
                                </BurgerMenu>
                            </div>
                        </div>
                        <AnimateHeight
                            id="mainQuery"
                            duration={500}
                            height={height}
                        >
                            {/* Service Unavailable */}
                            {mainQuery.isUnavailable ?
                                <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center bg-white rounded-lg shadow-super-3">
                                    <FontAwesomeIcon
                                        icon={faExclamationTriangle}
                                        size="3x"
                                        className='text-red-500'
                                    />
                                    <h1 className="text-2xl font-bold text-gray-700">
                                        Service Unavailable
                                    </h1>
                                    <p className="text-gray-500">
                                        Please try again later.
                                    </p>
                                </div>
                                :
                                <div key={mainQuery.id} className={`relative p-2 bg-white shadow-super-3 rounded-lg`}>
                                    <div className="relative px-4">
                                        {/* SWIPER FOR KPI CARDS */}
                                        <Swiper
                                            spaceBetween={10}
                                            modules={[Scrollbar, Mousewheel, Controller]}
                                            controller
                                            scrollbar={{
                                                draggable: true,
                                                snapOnRelease: false,
                                            }}
                                            loop={false}
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
                                                },
                                                374: {
                                                    slidesPerView: 1,
                                                    spaceBetween: 20,
                                                    slidesOffsetBefore: 10,
                                                    slidesOffsetAfter: 10,
                                                },
                                                424: {
                                                    slidesPerView: 1,
                                                    spaceBetween: 20,
                                                    slidesOffsetBefore: 20,
                                                    slidesOffsetAfter: 20,
                                                },
                                                768: {
                                                    slidesPerView: 2,
                                                    spaceBetween: 0,
                                                    slidesOffsetBefore: 10,
                                                    slidesOffsetAfter: 10,
                                                },
                                                1023: {
                                                    slidesPerView: 2,
                                                    spaceBetween: 0,
                                                    slidesOffsetBefore: 5,
                                                    slidesOffsetAfter: 5,

                                                },
                                                1400: {
                                                    slidesPerView: 3,
                                                    spaceBetween: 10,
                                                    slidesOffsetBefore: 10,
                                                    slidesOffsetAfter: 10,
                                                },
                                                1750: {
                                                    slidesPerView: 4,
                                                    spaceBetween: 10,
                                                    slidesOffsetBefore: 20,
                                                    slidesOffsetAfter: 20,
                                                },
                                            }}
                                            onSwiper={setSwiperMain}
                                            className="mx-auto mySwiper sm:w-full lg:max-w-8xl min-h-70"
                                        >
                                            <div className={``}>
                                                {mainQuery.isOpen && !mainQuery.isLoading ?
                                                    mainQuery.results.map(result => (
                                                        <SwiperSlide key={result.id}>
                                                            <div key={result.id} className='my-3 h-70 backface'>
                                                                <KpiCard prop={result} />
                                                            </div>
                                                        </SwiperSlide>
                                                    ))
                                                    :
                                                    <div className="flex flex-row justify-center gap-10">
                                                        <div className='flex bg-gray-200 rounded-lg w-80 h-60 animate-pulse shadow-super-3 '></div>
                                                        <div className='hidden bg-gray-200 rounded-lg sm:flex w-80 h-60 animate-pulse shadow-super-3'></div>
                                                        <div className='hidden bg-gray-200 rounded-lg xl:flex w-80 h-60 animate-pulse shadow-super-3'></div>
                                                        <div className='hidden bg-gray-200 rounded-lg 5xl:flex w-80 h-60 animate-pulse shadow-super-3'></div>
                                                    </div>
                                                }
                                            </div>
                                        </Swiper>
                                    </div>
                                </div>
                            }
                        </AnimateHeight>
                    </div>
                    {/* END OF MAIN QUERY */}
                    {/* START OF SUBQUERIES */}

                    {queries.map(query => (
                        <SubQuery
                            query={query}
                            isLoading={isLoading[query.id]}
                            setIsLoading={setIsLoading}
                            leadSource={query.leadSource}
                            dateRange={query.dateRange}
                            triggerUpdate={`${query.id}-${JSON.stringify(query.leadSource)}-${JSON.stringify(query.dateRange)}`}
                            handleQueryUpdate={handleQueryUpdate}
                            handleToggleQuery={handleToggleQuery}
                            handleRemoveQuery={handleRemoveQuery}
                            handleOptionSelected={handleOptionSelected}
                            handleDateRangeChange={handleDateRangeChange}
                            handleSwiperSub={handleSwiperSub}
                        />
                    ))}

                    {/* END OF SUBQUERIES */}

                    {/* ADD NEW QUERY BUTTON */}
                    <div
                        id="add-query-btn"
                        className="flex items-center justify-center w-12 h-12 m-2 text-2xl text-white ease-in-out delay-1000 bg-blue-500 rounded-full cursor-pointer shadow-super-3 animate-pulse"
                        onClick={() => handleAddQuery()}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </div>

                </section>

            </div >
        </>
    )
}


