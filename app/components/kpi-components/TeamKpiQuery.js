"use client";

import React, { useState, useEffect } from 'react';
import KpiSwiper from './KpiSwiper';
import SingleDateRangeSelector from './SingleDateRangeSelector';
import TeamComponent from './TeamComponent';
import QueryPanel from './QueryPanel';
import AnimateHeight from 'react-animate-height';
import RightSlideModal from '../RightSlideModal';
import ServiceUnavailable from '../ServiceUnavailable';

const TeamKpiQuery = ({
    view,
    VIEW_KPIS,
    query,
    departments,
    kpiList,
    onDateRangeChange,
    onToggleQuery,
    onRemoveQuery,
    onTeamChange,
    isLoadingData
}) => {
    const [height, setHeight] = useState('auto');
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("info");
    const [selectedResult, setSelectedResult] = useState(null);
    const [selectedKpis, setSelectedKpis] = useState(kpiList);
    const [teamKpiList, setTeamKpiList] = useState([]);
    const [department, setDepartment] = useState([]);
    const [tableProps, setTableProps] = useState(null);

    const updateKpiList = (department) => {
        setTeamKpiList(kpiList[department]);
        setSelectedKpis(kpiList[department]);
    };

    useEffect(() => {
        updateKpiList(query.departments);
    }, [kpiList]);

    const handleDepartmentChange = (department) => {
        setDepartment(department);
        updateKpiList(department);
    };

    const handleCardInfoClick = (result) => {
        setSelectedResult(result);
        setModalType("info");
        setOpenModal(true);
    };

    const handleGearIconClick = () => {
        setModalType("settings");
        setOpenModal(true);
    };

    const handleKpiCardClick = async (startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName) => {
        console.log("handleKpiCardClick: ", startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName)
        setTableProps({ startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName });
        setModalType("table")
        setOpenModal(true)
    };

    const handleDateRangeChange = (startDate, endDate) => {
        onDateRangeChange(startDate, endDate, query.id);
    };

    const handleToggleQuery = () => {
        onToggleQuery(query.id);
        setHeight(height === 0 ? 'auto' : 0);
    };

    const handleRemoveQuery = () => {
        onRemoveQuery && onRemoveQuery(query.id);
    };

    return (
        <div className="mb-2">
            {/* Main KPI Results */}
            {/* ... similar to AcquisitionsKpiQuery */}
            <QueryPanel query={query} height={height} setHeight={setHeight} handleToggleQuery={handleToggleQuery} handleGearIconClick={handleGearIconClick} handleRemoveQuery={handleRemoveQuery}>
                <div className='flex flex-col gap-2 sm:items-center sm:justify-between sm:flex-row sm:gap-4'>
                    {/* Seat, Team Member and Date Range Selectors */}
                    <div className=''>
                        <TeamComponent
                            onTeamChange={onTeamChange}
                            query={query}
                            queryId={query.id}
                            onDepartmentChange={handleDepartmentChange}
                            departments={departments}
                            isLoadingData={isLoadingData}
                        />
                    </div>
                    <div className="">
                        <SingleDateRangeSelector queryId={query.id} onDateRangeChange={handleDateRangeChange} />
                    </div>
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
                        <div className="relative">
                            <KpiSwiper
                                query={query}
                                view={view}
                                selectedKpis={selectedKpis}
                                handleCardInfoClick={handleCardInfoClick}
                                handleKpiCardClick={handleKpiCardClick}
                            />
                            <RightSlideModal
                                isOpen={openModal}
                                handleCloseModal={() => setOpenModal(false)}
                                prop={selectedResult}
                                viewKpis={teamKpiList}
                                VIEW_KPIS={VIEW_KPIS}
                                selectedView={view}
                                modalType={modalType}
                                selectedKpis={selectedKpis}
                                setSelectedKpis={setSelectedKpis}
                                selectedDepartment={query.departments}
                                tableProps={tableProps}
                                departments={departments}
                            />
                        </div>
                    </div>
                }
            </AnimateHeight>
        </div>
    );
};

export default TeamKpiQuery;
