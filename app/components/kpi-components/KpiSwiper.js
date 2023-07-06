"use client";

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Controller, Scrollbar, Mousewheel } from 'swiper/core';
import 'swiper/css/bundle';
import KpiCard from './KpiCard';
import LoadingQuotes from '../LoadingQuotes';

SwiperCore.use([Controller, Scrollbar, Mousewheel]);

const KpiSwiper = ({ query, view, selectedKpis, handleCardInfoClick, handleKpiCardClick }) => {
    const swiperRef = useRef(null);

    //console.log("query: ", query)

    const slides = query?.results?.length > 0 && query.isOpen
        && query.results
            .filter((result) => selectedKpis?.includes(result.name))
            .map((result) => (
                <SwiperSlide key={result.name}>
                    <div className='absolute w-72 top-2'>
                        <KpiCard
                            dateRange={query.dateRange}
                            leadSource={query.leadSource}
                            kpiView={view}
                            teamMembers={query.teamMembers}
                            prop={result}
                            handleCardInfoClick={() => handleCardInfoClick(result)}
                            handleKpiCardClick={handleKpiCardClick}
                        />
                    </div>
                </SwiperSlide>
            ));

    if (query.isLoading) {
        return <LoadingQuotes mode={'light'} />
    }

    return (
        <Swiper
            ref={swiperRef}   
            spaceBetween={10}
            speed={100}
            controller={false}
            scrollbar={{ draggable: true }}
            loop={false}
            freeMode={false}
            direction="horizontal"
            mousewheel={{ forceToAxis: true, releaseOnEdges: true, sensitivity: 6 }}
            breakpoints={{
                360: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                    slidesOffsetBefore: 15,
                    slidesOffsetAfter: 15,                
                },
                375: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    slidesOffsetBefore: 23,
                    slidesOffsetAfter: 23,
                },
                390: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    slidesOffsetBefore: 30,
                    slidesOffsetAfter: 30,
                },
                412: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    slidesOffsetBefore: 40,
                    slidesOffsetAfter: 40,
                },
                540: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    slidesOffsetBefore: 100,
                    slidesOffsetAfter: 100,
                },
                650: {
                    slidesPerView: 2,
                    spaceBetween: 5,
                    slidesOffsetBefore: 5,
                    slidesOffsetAfter: 5,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 5,
                    slidesOffsetBefore: 35,
                    slidesOffsetAfter: 35,
                },
                820: {
                    slidesPerView: 2,
                    spaceBetween: 5,
                    slidesOffsetBefore: 50,
                    slidesOffsetAfter: 50,
                },
                912: {
                    slidesPerView: 2,
                    spaceBetween: 5,
                    slidesOffsetBefore: 70,
                    slidesOffsetAfter: 70,
                },
                950: {
                    slidesPerView: 3,
                    spaceBetween: 5,
                    slidesOffsetBefore: 5,
                    slidesOffsetAfter: 5,
                },
                1250: {
                    slidesPerView: 3,
                    spaceBetween: 5,
                    slidesOffsetBefore: 10,
                    slidesOffsetAfter: 10,
                },
                1550: {
                    slidesPerView: 4,
                    spaceBetween: 5,
                    slidesOffsetBefore: 5,
                    slidesOffsetAfter: 5,
                },
                1900: {
                    slidesPerView: 5,
                    spaceBetween: 5,
                    slidesOffsetBefore: 10,
                    slidesOffsetAfter: 10,
                },
            }}
            className="flex items-center justify-center h-60"
        >
            {slides}
        </Swiper>
    );
};

export default KpiSwiper;
