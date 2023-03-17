import React, { useState, useEffect, useRef } from 'react'
import KpiCard from './KpiCard'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller } from 'swiper';
import Dropdown from './Dropdown';
import SingleDateRangeSelector from './SingleDateRangeSelector';

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const SubQuery = ({ query, leadSources, handleQueryUpdate, handleToggleQuery, handleRemoveQuery, handleOptionSelected, handleDateRangeChange }) => {

    return (
        <div className="w-auto mb-2">
            <div key={query.id} className="p-2 bg-white justify-items-start shadow-super-3 rounded-xl">
                <div className="flex justify-between px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 via-blue-800 to-blue-500 text-gray-50 shadow-super-3">
                    <button onClick={() => handleToggleQuery(query.id)}>
                        {query.isOpen ? "Hide" : "Show"}
                    </button>
                    <div className='flex justify-center gap-4 text-lg'>
                        {/* Handle Query Update using Lead Source selection and Date Range selection dropdowns */}
                        <label className='mr-2 text-gray-100'>
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
                        className="box-border px-4 text-blue-900 transition-colors duration-200 bg-gray-200 rounded-md ring-offset-4 ring-offset-teal-100 shadow-super-4 hover:bg-gray-100"
                    >
                        Update
                    </button>
                    <button
                        onClick={() => handleRemoveQuery(query.id)}
                        className="box-border px-4 text-blue-900 transition-colors duration-200 bg-gray-200 rounded-md ring-offset-4 ring-offset-teal-100 shadow-super-4 hover:bg-gray-100"
                    >
                        X
                    </button>
                </div>
                {query.isOpen && (
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