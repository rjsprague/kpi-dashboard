import React, { useState, useEffect } from 'react';
import fetchKpiData from '../../lib/fetch-kpis';
import KpiCard from './KpiCard';
import Dropdown from './Dropdown';
import SingleDateRangeSelector from './SingleDateRangeSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faTimes, faExclamationTriangle, faGear } from '@fortawesome/free-solid-svg-icons';
import AnimateHeight from 'react-animate-height';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Scrollbar, Mousewheel, Controller } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import RightSlideModal from '../RightSlideModal';

SwiperCore.use([Scrollbar, Mousewheel, Controller]);

const KpiQuery = ({
  view,
  VIEW_KPIS,
  query,
  kpiList,
  onKpiListChange,
  onDateRangeChange,
  onLeadSourceChange,
  onToggleQuery,
  onRemoveQuery,
  onFetchedKpiData,
  onSetLoading
}) => {

  const [height, setHeight] = useState('auto');
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedKpis, setSelectedKpis] = useState(kpiList);


  const handleCardInfoClick = (result) => {
    setSelectedResult(result);
    setModalType("info");
    setOpenModal(true);
  };

  const handleGearIconClick = () => {
    setModalType("settings");
    setOpenModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      onSetLoading(query.id, true);

      const leadSource = query.leadSource || [];
      const gte = query.dateRange?.gte || '';
      const lte = query.dateRange?.lte || '';
      const data = await fetchKpiData(view, kpiList, leadSource, gte, lte);

      onFetchedKpiData(query.id, data);
      onSetLoading(query.id, false);
    };

    if (query.leadSource && query.dateRange) {
      fetchData();
    }
  }, [query.leadSource, query.dateRange, kpiList]);

  const handleDateRangeChange = (startDate, endDate) => {
    onDateRangeChange(startDate, endDate, query.id);
  };

  const handleOptionSelected = (values) => {
    onLeadSourceChange(values, query.id);
  };

  const handleToggleQuery = () => {
    onToggleQuery(query.id);
    setHeight(height === 0 ? 'auto' : 0);
  };

  const handleRemoveQuery = () => {
    onRemoveQuery && onRemoveQuery(query.id);
  };

  //console.log("query result ", query.results)
  //console.log("selected kpis ", selectedKpis)

  return (
    <div className="mb-2">
      {/* Main KPI Results */}
      <div className="px-4 py-2 text-sm rounded-lg shadow-super-3 bg-gradient-to-r from-blue-600 via-blue-800 to-blue-500 text-gray-50">
        <div className='relative flex flex-row items-center gap-2 align-middle md:justify-center'>
          <button
            className="box-border absolute px-2 py-1 text-blue-900 transition-shadow duration-500 bg-white rounded-md left-0.5 shadow-super-4 hover:animate-pulse"
            onClick={() => {
              handleToggleQuery(query.id)
              setHeight(height === 0 ? 'auto' : 0)
            }}
          >
            {query.isOpen ?
              <FontAwesomeIcon
                icon={faChevronDown}
                size="sm"
                className='text-blue-900 transition-transform duration-500 rotate-180 transform-gpu'
              /> :
              <FontAwesomeIcon
                icon={faChevronDown}
                size="sm"
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
                  queryId={query.id}
                />
              </div>
              <div className="flex justify-between gap-2">
                <SingleDateRangeSelector queryId={query.id} onDateRangeChange={handleDateRangeChange} />
              </div>
            </div>
          </div>
          <button
            className="box-border px-2 py-1 text-blue-900 transition-shadow duration-500 bg-white rounded-md right-0.5 shadow-super-4 hover:animate-pulse"
            onClick={handleGearIconClick}
          >
            <FontAwesomeIcon
              icon={faGear}
              size="sm"
              className="text-blue-900 transform-gpu"
            />
          </button>
          {query.id !== 1 && (
            <button
              className="box-border absolute px-2 py-1 text-blue-900 transition-shadow duration-500 bg-white rounded-md right-0.5 shadow-super-4 hover:animate-pulse"
              onClick={handleRemoveQuery}
            >
              <FontAwesomeIcon
                icon={faTimes}
                size="sm"
                className="text-blue-900 transform-gpu"
              />
            </button>
          )}

        </div>
      </div>
      <AnimateHeight
        id="query"
        duration={500}
        height={height}
      >
        {/* Service Unavailable */}
        {query.isUnavailable ?
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
          <div key={query.id} className={`relative p-2 bg-white shadow-super-3 rounded-lg`}>
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
                className="mx-auto mySwiper sm:w-full lg:max-w-8xl min-h-70"
              >
                <div className={``}>
                  {query.results.length > 0 && query.isOpen && !query.isLoading ?
                    query.results
                    .filter((result) => selectedKpis.includes(result.name))
                    .map((result, index) => (
                      <SwiperSlide key={index}>
                        <div className='my-3 h-70 backface'>
                          <KpiCard
                            prop={result}
                            handleCardInfoClick={() => handleCardInfoClick(result)}
                          />
                        </div>
                      </SwiperSlide>
                    ))
                    :
                    <div className="flex flex-row justify-center gap-10 mt-3">
                      <div className='flex bg-gray-200 rounded-lg w-80 h-60 animate-pulse shadow-super-3 '></div>
                      <div className='hidden bg-gray-200 rounded-lg sm:flex w-80 h-60 animate-pulse shadow-super-3'></div>
                      <div className='hidden bg-gray-200 rounded-lg xl:flex w-80 h-60 animate-pulse shadow-super-3'></div>
                      <div className='hidden bg-gray-200 rounded-lg 5xl:flex w-80 h-60 animate-pulse shadow-super-3'></div>
                    </div>
                  }
                </div>
              </Swiper>
              {/* END OF SWIPER FOR KPI CARDS */}
              <RightSlideModal
                isOpen={openModal}
                handleCloseModal={() => setOpenModal(false)}
                prop={selectedResult}
                viewKpis={kpiList}
                VIEW_KPIS={VIEW_KPIS}
                selectedView={view}
                onKpiListChange={onKpiListChange}
                modalType={modalType}
                selectedKpis={selectedKpis}
                setSelectedKpis={setSelectedKpis}
              />
            </div>
          </div>
        }
      </AnimateHeight>
    </div>
  );
};

export default KpiQuery;