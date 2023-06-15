import React, { useState, useEffect, useRef } from 'react';
import KpiCard from './KpiCard';
import LoadingIcon from '../LoadingIcon';

const KpiSwiper = ({ query, selectedKpis, handleCardInfoClick }) => {
    const swiperRef = useRef(null);

    console.log("selected Kpis ", selectedKpis)

    const slides = query.results.length > 0 && query.isOpen
    && query.results
        .filter((result) => selectedKpis?.includes(result.name))
        .map((result) => (
            <swiper-slide key={result.name}>
                <div className='absolute top-2'>
                    <KpiCard
                        prop={result}
                        handleCardInfoClick={() => handleCardInfoClick(result)}
                    />
                </div>
            </swiper-slide>
        ))

    useEffect(() => {
        if (swiperRef.current) {
            //swiperRef.current.slidesPerView = 1;
            swiperRef.current.breakpoints = {
                300: {
                    slidesPerView: 1,
                    spaceBetween: 10,
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
            };
            swiperRef.current.initialize();
        }
    }, [swiperRef, slides]);

 
    
    if(query.isLoading) {
        return <LoadingIcon size="large" />
    }

    return (
        <swiper-container
            ref={swiperRef}
            init="false"
            slides-per-view="1"
            space-between="10"
            speed="100"
            controller="false"
            scrollbar-draggable="true"
            scrollbar-snap-on-release="false"
            loop="false"
            free-mode="false"
            direction="horizontal"
            mousewheel-force-to-axis="true"
            mousewheel-release-on-edges="true"
            mousewheel-sensitivity="6"
            class="lg:max-w-8xl h-60"
        >
            {slides}
        </swiper-container>
    );
};

export default KpiSwiper;