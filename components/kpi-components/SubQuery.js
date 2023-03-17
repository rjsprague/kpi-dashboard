import React, { useState, useEffect, useRef } from 'react'
import KpiCard from './KpiCard'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Scrollbar, Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller } from 'swiper';
import Dropdown from './Dropdown';
import SingleDateRangeSelector from './SingleDateRangeSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faPlus } from '@fortawesome/free-solid-svg-icons'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import BurgerMenu from '../BurgerMenu';

const SubQuery = ({ query, leadSources, handleQueryUpdate, handleToggleQuery, handleRemoveQuery, handleOptionSelected, handleDateRangeChange }) => {

    return (
        <div className="box-border w-screen mb-2 text-sm sm:w-auto">
            <div key={query.id} className="p-2 align-middle bg-white shadow-super-3 rounded-xl">
                <div className="flex-row justify-between hidden px-4 py-2 align-middle rounded-lg md:flex bg-gradient-to-r from-blue-600 via-blue-800 to-blue-500 text-gray-50 shadow-super-3">
                    <button
                        onClick={() => handleToggleQuery(query.id)}
                        className="box-border px-4 text-blue-900 transition-shadow duration-500 bg-white rounded-md shadow-super-4 hover:animate-pulse">
                        {query.isOpen ?
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                size="md"
                                className='text-blue-900 transition-transform duration-1000 -rotate-180 transform-gpu'
                            /> :
                            <FontAwesomeIcon
                                icon={faChevronUp}
                                size="md"
                                className='text-blue-900 transition-transform duration-1000 rotate-180 transform-gpu'
                            />
                        }
                    </button>
                    <div className='flex items-center justify-center gap-2 align-middle'>
                        {/* Handle Query Update using Lead Source selection and Date Range selection dropdowns */}
                        <label className='text-gray-50'>
                            Lead Source:
                        </label>
                        <Dropdown selectedOption={query.leadSource} onOptionSelected={handleOptionSelected} data={leadSources} queryId={query.id} />
                        <p>
                            Date Range: {
                                query.dateRange.gte instanceof Date ? query.dateRange.gte.toLocaleDateString() : ""
                            } to {
                                query.dateRange.lte instanceof Date ? query.dateRange.lte.toLocaleDateString() : ""
                            }
                        </p>
                        <SingleDateRangeSelector queryId={query.id} onDateRangeChange={handleDateRangeChange} />
                    </div>
                    <button
                        onClick={() => handleQueryUpdate(query.id, query.dateRange, query.leadSource)}
                        className="box-border flex px-4 py-2 text-blue-900 transition-colors duration-200 bg-white rounded-md shadow-super-4 hover:bg-blue-50"
                    >
                        Update KPIs
                    </button>
                    <button
                        onClick={() => handleRemoveQuery(query.id)}
                        className="box-border flex content-center px-4 py-2 font-bold text-blue-900 align-middle transition-colors duration-200 bg-white rounded-md shadow-super-4 hover:bg-blue-50"
                    >
                        X
                    </button>
                </div>
                <div className="flex flex-row justify-between px-4 py-2 align-middle rounded-lg md:hidden bg-gradient-to-r from-blue-600 via-blue-800 to-blue-500 text-gray-50 shadow-super-3">
                    <button
                        onClick={() => handleToggleQuery(query.id)}
                        className="box-border px-4 text-blue-900 transition-shadow duration-500 bg-white rounded-md shadow-super-4 hover:animate-pulse">
                        {query.isOpen ?
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                size="md"
                                className='text-blue-900 transition-transform duration-1000 -rotate-180 transform-gpu'
                            /> :
                            <FontAwesomeIcon
                                icon={faChevronUp}
                                size="md"
                                className='text-blue-900 transition-transform duration-1000 rotate-180 transform-gpu'
                            />
                        }
                    </button>
                    <BurgerMenu>
                        <div className='flex items-center justify-center gap-2 align-middle'>
                            {/* Handle Query Update using Lead Source selection and Date Range selection dropdowns */}
                            <label className='text-gray-50'>
                                Lead Source:
                            </label>
                            <Dropdown selectedOption={query.leadSource} onOptionSelected={handleOptionSelected} data={leadSources} queryId={query.id} />
                            <p>
                                Date Range: {
                                    query.dateRange.gte instanceof Date ? query.dateRange.gte.toLocaleDateString() : ""
                                } to {
                                    query.dateRange.lte instanceof Date ? query.dateRange.lte.toLocaleDateString() : ""
                                }
                            </p>
                            <SingleDateRangeSelector queryId={query.id} onDateRangeChange={handleDateRangeChange} />
                        </div>
                        <button
                            onClick={() => handleQueryUpdate(query.id, query.dateRange, query.leadSource)}
                            className="box-border flex px-4 py-2 text-blue-900 transition-colors duration-200 bg-white rounded-md shadow-super-4 hover:bg-blue-50"
                        >
                            Update KPIs
                        </button>
                        <button
                            onClick={() => handleRemoveQuery(query.id)}
                            className="box-border flex content-center px-4 py-2 font-bold text-blue-900 align-middle transition-colors duration-200 bg-white rounded-md shadow-super-4 hover:bg-blue-50"
                        >
                            X
                        </button>
                    </BurgerMenu>
                </div>
                {query.isOpen && (
                    <div className='relative px-4 min-h-70'>

                        {/* SWIPER FOR KPI CARDS */}
                        <Swiper
                            spaceBetween={10}
                            modules={[Scrollbar, Mousewheel]}
                            scrollbar={{
                                draggable: true,
                                snapOnRelease: false,
                            }}
                            mousewheel={{
                                sensitivity: 3,
                                thresholdDelta: 1,
                                thresholdTime: 50,
                            }}
                            loop={false}
                            slidesPerView={1}
                            direction={'horizontal'}
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

                            className="w-screen mx-auto mySwiper sm:w-full lg:max-w-8xl min-h-70"
                        >
                            <div className={`${query.isOpen && 'h-80'}`}>
                                {query.isOpen &&
                                    query.results.map(result => (
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
    )
}

export default SubQuery;