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

    // console.log("query: ", query)
    // console.log("view: ", view)
    // console.log("selectedKpis: ", selectedKpis)

    const slides = query?.results?.length > 0 && query.isOpen
        && query.results
            .filter((result) => view === 'Team' && !selectedKpis ? []
            : view === 'Team' ? Object.values(selectedKpis)?.includes(result.name) :  selectedKpis?.includes(result.name))
            .map((result) => (
                <SwiperSlide key={result.name} style={{ width: '300px' }}>
                    <div className='absolute h-full mx-2 w-72 top-2' >
                        <KpiCard
                            dateRange={query.dateRange}
                            leadSource={query.leadSources}
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
            spaceBetween={5}
            speed={100}
            controller={false}
            scrollbar={{ draggable: true }}
            loop={false}
            freeMode={false}
            direction="horizontal"
            mousewheel={{ forceToAxis: true, releaseOnEdges: true, sensitivity: 6 }}
            slidesPerView="auto"
            className="flex items-center justify-center h-60"
        >
            {slides}
        </Swiper>
    );
};

export default KpiSwiper;
