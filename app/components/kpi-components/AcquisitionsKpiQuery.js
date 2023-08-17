"use client";

import React, { useState, useEffect } from 'react';
import KpiSwiper from './KpiSwiper';
import LeadSourcesDropdown from './LeadSourcesDropdown';
import SingleDateRangeSelector from './SingleDateRangeSelector';
import AnimateHeight from 'react-animate-height';
import RightSlideModal from '../RightSlideModal';
import QueryPanel from './QueryPanel';
import ServiceUnavailable from '../ServiceUnavailable';
import { useSelector } from 'react-redux';
import { selectSpaceId } from '../../../app/GlobalRedux/Features/client/clientSlice'
import UniversalDropdown from './UniversalDropdown';
import DropdownButton from './DropdownButton';

const AcquisitionsKpiQuery = ({
    view,
    VIEW_KPIS,
    query,
    departments,
    kpiList,
    leadSources,
    onDateRangeChange,
    onLeadSourceChange,
    onTeamMemberForClosersChange,
    onToggleQuery,
    onRemoveQuery,
    isLoadingData
}) => {
    // console.log("view: ", view)
    // console.log("VIEW_KPIS: ", VIEW_KPIS)
    // console.log("query: ", query)
    // console.log("kpiList: ", kpiList)
    const [height, setHeight] = useState('auto');
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("info");
    const [selectedResult, setSelectedResult] = useState(null);
    const [selectedKpis, setSelectedKpis] = useState(kpiList);
    const [tableProps, setTableProps] = useState(null);
    const [teamMembersForClosers, setTeamMembersForClosers] = useState([]);
    const [selectedTeamMembersForClosers, setSelectedTeamMembersForClosers] = useState([]);
    const [reversedTeamMembersForClosers, setReversedTeamMembersForClosers] = useState([]);
    const [teamMembersForClosersOpen, setTeamMembersForClosersOpen] = useState(false);
    const clientSpaceId = useSelector(selectSpaceId);

    useEffect(() => {
        const teamMembersObj = {};
        Object.entries(departments).forEach(([department, members]) => {
            Object.entries(members).forEach(([id, name]) => {
                if (!teamMembersObj[id]) {
                    teamMembersObj[id] = name + " (" + department + ")";
                }
            });
        });
        setTeamMembersForClosers(teamMembersObj);
        setSelectedTeamMembersForClosers(Object.values(teamMembersObj));
        onTeamMemberForClosersChange(Object.keys(teamMembersObj), query.id)
        let reversedTeamMembersObj = {};
        Object.entries(teamMembersObj).forEach(([id, name]) => {
            reversedTeamMembersObj[name] = id;
        });
        setReversedTeamMembersForClosers(reversedTeamMembersObj);
    }, [departments])

    


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
        //console.log("handleKpiCardClick: ", startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName)
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

    const handleTeamMemberForClosersChange = (selectedTeamMembers) => {
        const selectedTeamMemberIds = selectedTeamMembers.map(option => reversedTeamMembersForClosers[option])
        setSelectedTeamMembersForClosers(selectedTeamMembers)
        onTeamMemberForClosersChange(selectedTeamMemberIds, query.id)
    };

    const handleRemoveQuery = () => {
        onRemoveQuery && onRemoveQuery(query.id);
    };

    if (query.results === Error) {
        return <ServiceUnavailable />
    }

    return (
        <div className="mb-2">
            {/* Main KPI Results */}
            <QueryPanel query={query} height={height} setHeight={setHeight} handleToggleQuery={handleToggleQuery} handleGearIconClick={handleGearIconClick} handleRemoveQuery={handleRemoveQuery}>
                <div className='flex flex-col gap-2 xs:flex-row'>
                    {clientSpaceId == process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID && teamMembersForClosers &&
                        <UniversalDropdown
                            options={Object.values(teamMembersForClosers)}
                            onOptionSelected={handleTeamMemberForClosersChange}
                            selectedOptions={selectedTeamMembersForClosers}
                            queryId={query.id}
                            isSingleSelect={false}
                            isLoadingData={isLoadingData}
                            className={""}
                            ButtonComponent={DropdownButton}
                            showButton={teamMembersForClosersOpen}
                        />
                    }
                    {/* Lead Source and Date Range Selectors */}
                    <LeadSourcesDropdown
                        onOptionSelected={onLeadSourceChange}
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
                                    viewKpis={kpiList}
                                    VIEW_KPIS={VIEW_KPIS}
                                    selectedView={view}
                                    modalType={modalType}
                                    selectedKpis={selectedKpis}
                                    setSelectedKpis={setSelectedKpis}
                                    tableProps={tableProps}
                                    leadSources={leadSources}
                                    departments={departments}
                                />
                            }

                        </div>
                    </div>
                }
            </AnimateHeight>
        </div>
    );
};

export default AcquisitionsKpiQuery;