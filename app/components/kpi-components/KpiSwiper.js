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

    // console.log("query: ", query.departments[0])
    // console.log("view: ", view)
    // console.log("selectedKpis: ", selectedKpis)
    
    if (query.isLoading || !Array.isArray(selectedKpis) || selectedKpis.length === 0) {
        return <LoadingQuotes mode={'light'} />
    }

    const slides = query?.results?.length > 0 && query.isOpen && query.results
            .filter((result) => view === 'Team' && !selectedKpis ? [] : view === 'Team' ? selectedKpis.includes(result.name) : selectedKpis.includes(result.name))
            .map((result) => (
                <>
                    {/* { console.log("result: ", result) } */}
                    <SwiperSlide key={result.name} style={{ width: '300px' }}>
                        <div className='absolute h-full mx-2 w-68 top-2' >
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
                </>
            ));

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
