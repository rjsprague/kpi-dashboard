"use client";

import React, { useState, useEffect } from 'react';
import KpiSwiper from './KpiSwiper';
import SingleDateRangeSelector from './SingleDateRangeSelector';
import TeamComponent from './TeamComponent';
import QueryPanel from './QueryPanel';
import AnimateHeight from 'react-animate-height';
import RightSlideModal from '../RightSlideModal';
import ServiceUnavailable from '../ServiceUnavailable';
import LeadSourcesDropdown from './LeadSourcesDropdown';

const TeamKpiQuery = ({
    view,
    VIEW_KPIS,
    query,
    departments,
    kpiList,
    leadSources,
    onDateRangeChange,
    onLeadSourceChange,
    onToggleQuery,
    onRemoveQuery,
    onTeamChange,
    isLoadingData,
    isProfessional,
    isStarter,
}) => {
    const [height, setHeight] = useState('auto');
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("info");
    const [selectedResult, setSelectedResult] = useState(null);
    const [selectedKpis, setSelectedKpis] = useState(kpiList);
    const [teamKpiList, setTeamKpiList] = useState([]);
    const [department, setDepartment] = useState([]);
    const [tableProps, setTableProps] = useState(null);

    // console.log(leadSources)

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
        // console.log("handleKpiCardClick: ", startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName)
        // console.log(leadSource)
        setTableProps({ startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName, closers: [], setters: [] });
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
        <div className="w-full max-w-full ">
            {/* Main KPI Results */}
            {/* ... similar to AcquisitionsKpiQuery */}
            <QueryPanel query={query} height={height} setHeight={setHeight} handleToggleQuery={handleToggleQuery} handleGearIconClick={handleGearIconClick} handleRemoveQuery={handleRemoveQuery}>
                <div className='flex flex-col gap-2 sm:items-center sm:justify-between sm:flex-row sm:flex-wrap sm:gap-1'>
                    {/* Seat, Team Member and Date Range Selectors */}
                    <div className=''>
                        <TeamComponent
                            onTeamChange={onTeamChange}
                            query={query}
                            queryId={query.id}
                            onDepartmentChange={handleDepartmentChange}
                            departments={departments}
                            isLoadingData={isLoadingData}
                            isProfessional={isProfessional}
                            isStarter={isStarter}
                        />
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-1">
                        <LeadSourcesDropdown
                            onOptionSelected={onLeadSourceChange}
                            selectedLeadsources={query.leadSources}
                            queryId={query.id}
                            leadSources={leadSources}
                            isLoadingData={isLoadingData}
                            isUnavailable={query.isUnavailable}
                        />
                        <SingleDateRangeSelector queryId={query.id} onDateRangeChange={handleDateRangeChange} selectedDateRange={query.dateRange} />
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
                            {
                                !isLoadingData && openModal &&
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
                                    leadSources={leadSources}
                                    departments={departments}
                                    isProfessional={isProfessional}
                                />
                            }
                        </div>
                    </div>
                }
            </AnimateHeight>
        </div>
    );
};

export default TeamKpiQuery;
