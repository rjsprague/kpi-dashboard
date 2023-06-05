import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Scrollbar, Mousewheel, Controller } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import KpiCard from './KpiCard';

SwiperCore.use([Scrollbar, Mousewheel, Controller]);

const KpiSwiper = ({ query, selectedKpis, handleCardInfoClick }) => {

    //console.log('query.results:', query.results);
    //console.log('selectedKpis:', selectedKpis);


    const swiperRef = useRef(null); // Create a ref to store the Swiper instance

    const swiperProps = {
        spaceBetween: 10,
        modules: [Scrollbar, Mousewheel, Controller],
        controller: true,
        scrollbar: {
            draggable: true,
            snapOnRelease: false,
        },
        loop: false,
        freeMode: true,
        direction: 'horizontal',
        slidesPerView: 4,
        mousewheel: {
            forceToAxis: true,
            releaseOnEdges: true,
            sensitivity: 6,            
        },
        breakpoints: {
            breakpoints: {
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
            },
        },
        className: "mx-auto mySwiper sm:w-full lg:max-w-8xl min-h-70 ease-in-out duration-1000",
    };

    const slides = query.results.length > 0 && query.isOpen && !query.isLoading
        ? query.results
            .filter((result) => selectedKpis.includes(result.name))
            .map((result) => (
                <SwiperSlide key={result.name}>
                    <div className='my-3 h-70 backface'>
                        <KpiCard
                            prop={result}
                            handleCardInfoClick={() => handleCardInfoClick(result)}
                        />
                    </div>
                </SwiperSlide>
            ))
        : <div className="flex flex-row justify-center gap-10 mt-3">
            <div className='flex bg-gray-200 rounded-lg w-80 h-60 animate-pulse shadow-super-3'></div>
            <div className='hidden bg-gray-200 rounded-lg sm:flex w-80 h-60 animate-pulse shadow-super-3'></div>
            <div className='hidden bg-gray-200 rounded-lg xl:flex w-80 h-60 animate-pulse shadow-super-3'></div>
            <div className='hidden bg-gray-200 rounded-lg 5xl:flex w-80 h-60 animate-pulse shadow-super-3'></div>
        </div>;

    return (
        <Swiper
            ref={swiperRef} // Assign the ref to the Swiper instance
            {...swiperProps}
        >
            {slides}
        </Swiper>
    );
};

export default KpiSwiper;



