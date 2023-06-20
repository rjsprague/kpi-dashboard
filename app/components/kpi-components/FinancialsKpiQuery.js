"use client";

import React, { useState, useEffect } from 'react';
import LeadSourcesDropdown from './LeadSourcesDropdown';
import SingleDateRangeSelector from './SingleDateRangeSelector';
import AnimateHeight from 'react-animate-height';
import RightSlideModal from '../RightSlideModal';
import KpiSwiper from './KpiSwiper';
import QueryPanel from './QueryPanel';
import ServiceUnavailable from '../ServiceUnavailable';

const FinancialsKpiQuery = ({
    view,
    VIEW_KPIS,
    query,
    kpiList,
    leadSources,
    onKpiListChange,
    onDateRangeChange,
    onLeadSourceChange,
    onToggleQuery,
    onRemoveQuery,
    isLoadingData
}) => {
    // console.log("view: ", view)
    // console.log("query: ", query)
    // console.log("kpiList: ", kpiList)     

    const [height, setHeight] = useState('auto');
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("info");
    const [selectedResult, setSelectedResult] = useState(null);
    const [selectedKpis, setSelectedKpis] = useState([]);

    useEffect(() => {
        setSelectedKpis(kpiList)
    }, [kpiList])

    const handleCardInfoClick = (result) => {
        setSelectedResult(result);
        setModalType("info");
        setOpenModal(true);
    };

    const handleGearIconClick = () => {
        setModalType("settings");
        setOpenModal(true);
    };

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
    //console.log("kpi list ", kpiList)
    //console.log("view ", view)

    return (
        <div className="mb-2">
            {/* Main KPI Results */}
            <QueryPanel query={query} height={height} setHeight={setHeight} handleToggleQuery={handleToggleQuery} handleGearIconClick={handleGearIconClick} handleRemoveQuery={handleRemoveQuery}>
                <div className='flex flex-col gap-1 xs:flex-row sm:gap-4'>
                    {/* Lead Source and Date Range Selectors */}
                    <LeadSourcesDropdown 
                        onOptionSelected={handleOptionSelected}
                        queryId={query.id}
                        leadSources={leadSources}
                        isLoadingData={isLoadingData}
                        isUnavailable={query.isUnavailable}
                    />
                    <SingleDateRangeSelector queryId={query.id} onDateRangeChange={handleDateRangeChange} />
                </div>
            </QueryPanel>

            <AnimateHeight
                id="query"
                duration={500}
                height={height}
            >
                {/* Service Unavailable */}
                {query.isUnavailable ? <ServiceUnavailable />
                    :
                    <div key={query.id} className={`relative p-2 bg-white shadow-super-3 rounded-lg`}>
                        <div className="relative px-4">
                            <KpiSwiper
                                query={query}
                                selectedKpis={selectedKpis}
                                handleCardInfoClick={handleCardInfoClick}
                            />
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

export default FinancialsKpiQuery;