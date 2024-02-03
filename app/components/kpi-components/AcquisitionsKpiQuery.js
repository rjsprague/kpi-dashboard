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
    onClosersChange,
    onSettersChange,
    onToggleQuery,
    onRemoveQuery,
    isLoadingData,
    isProfessional,
    isStarter
}) => {
    const [height, setHeight] = useState('auto');
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("info");
    const [selectedResult, setSelectedResult] = useState(null);
    const [selectedKpis, setSelectedKpis] = useState(kpiList);
    const [tableProps, setTableProps] = useState(null);

    const [closers, setClosers] = useState([]);
    const [selectedClosers, setSelectedClosers] = useState([]);
    const [reversedClosers, setReversedClosers] = useState([]);
    const [closersOpen, setClosersOpen] = useState(false);

    const [setters, setSetters] = useState([]);
    const [selectedSetters, setSelectedSetters] = useState([]);
    const [reversedSetters, setReversedSetters] = useState([]);
    const [settersOpen, setSettersOpen] = useState(false);

    const clientSpaceId = useSelector(selectSpaceId);
    const closersSpaceId = Number(process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID)


    useEffect(() => {
        // put all of the closers in an object
        if (clientSpaceId === closersSpaceId) {
            const closersObj = {};
            Object.entries(departments).forEach(([department, members]) => {
                if (department === "Closer") {
                    Object.entries(members).forEach(([id, name]) => {
                        if (!closersObj[id]) {
                            closersObj[id] = name;
                        }
                    });
                }
            });
            setClosers(closersObj);
            let reversedClosersObj = {};
            Object.entries(closersObj).forEach(([id, name]) => {
                reversedClosersObj[name] = id;
            });
            setReversedClosers(reversedClosersObj);
        }
    }, [departments])


    useEffect(() => {
        // put all of the setters in an object
        if (clientSpaceId === closersSpaceId) {
            const settersObj = {};
            Object.entries(departments).forEach(([department, members]) => {
                if (department === "Setter") {
                    Object.entries(members).forEach(([id, name]) => {
                        if (!settersObj[id]) {
                            settersObj[id] = name;
                        }
                    });
                }
            });
            setSetters(settersObj);
            let reversedSettersObj = {};
            Object.entries(settersObj).forEach(([id, name]) => {
                reversedSettersObj[name] = id;
            });
            setReversedSetters(reversedSettersObj);
        }
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
        setTableProps({ startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName, closers: query.closers, setters: query.setters });
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

    const handleClosersChange = (selectedClosers) => {
        let selectedCloserIds = [];
        if (selectedClosers.length === 0) {
            selectedCloserIds = [];
        } else {
            selectedCloserIds = selectedClosers.map(option => reversedClosers[option])
        }
        onClosersChange(selectedCloserIds, query.id)
    };

    useEffect(() => {
        if (clientSpaceId === closersSpaceId) {
            setSelectedClosers(query.closers.map(id => closers[id]))
        }
    }, [query, query.closers])

    // console.log(selectedClosers)

    const handleSettersChange = (selectedSetters, noSetter=false) => {
        let selectedSetterIds = [];
        if (selectedSetters.length === 0) {
            selectedSetterIds = [];
        } else {
            selectedSetterIds = selectedSetters.map(option => reversedSetters[option])
        }    
        onSettersChange(selectedSetterIds, query.id, noSetter)
    };

    useEffect(() => {
        if (clientSpaceId === closersSpaceId) {
            setSelectedSetters(query.setters.map(id => setters[id]))
        }
    }, [query, query.setters])

    // console.log(selectedSetters)

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
                    {clientSpaceId === closersSpaceId && closers && setters &&
                        <>
                            <UniversalDropdown
                                options={Object.values(setters)}
                                onOptionSelected={handleSettersChange}
                                selectedOptions={selectedSetters}
                                queryId={query.id}
                                isSingleSelect={false}
                                isLoadingData={isLoadingData}
                                className={""}
                                ButtonComponent={DropdownButton}
                                showButton={settersOpen}
                                label={"Setters"}
                            />
                            <UniversalDropdown
                                options={Object.values(closers)}
                                onOptionSelected={handleClosersChange}
                                selectedOptions={selectedClosers}
                                queryId={query.id}
                                isSingleSelect={false}
                                isLoadingData={isLoadingData}
                                className={""}
                                ButtonComponent={DropdownButton}
                                showButton={closersOpen}
                                label={"Closers"}
                            />
                        </>
                    }
                    {/* Lead Source and Date Range Selectors */}
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
                                    isProfessional={isProfessional}
                                    noSetter={query.noSetter}
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