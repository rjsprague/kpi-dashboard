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
    kpiList,
    onKpiListChange,
    onDateRangeChange,
    onToggleQuery,
    onRemoveQuery,
    onTeamChange,
}) => {
    const [height, setHeight] = useState('auto');
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("info");
    const [selectedResult, setSelectedResult] = useState(null);
    const [selectedKpis, setSelectedKpis] = useState(kpiList);
    const [teamKpiList, setTeamKpiList] = useState([]);
    const [department, setDepartment] = useState("Lead Manager");

    console.log("view Team Member ", view)
    console.log("VIEW_KPIS  ", VIEW_KPIS[view])
    //console.log("query Team ", query)
    console.log("kpiList Team ", kpiList)

    useEffect(() => {
        if (department === "Lead Manager") {
            setTeamKpiList(kpiList[0]["Lead Manager"]);
            console.log("team kpi list", teamKpiList)
            setSelectedKpis(kpiList[0]["Lead Manager"]);
            console.log("selected kpi list", selectedKpis)
        } else if (department === "Acquisition Manager") {
            setTeamKpiList(kpiList[0]["Acquisition Manager"]);
            setSelectedKpis(kpiList[0]["Acquisition Manager"]);
        }
    }, [kpiList]);
   

    const handleDepartmentChange = (department) => {
        setDepartment(department);
        if (department === "Lead Manager") {
            setTeamKpiList(kpiList[0]["Lead Manager"]);
            console.log("team kpi list", teamKpiList)
            setSelectedKpis(kpiList[0]["Lead Manager"]);
            console.log("selected kpi list", selectedKpis)
        } else if (department === "Acquisition Manager") {
            setTeamKpiList(kpiList[0]["Acquisition Manager"]);
            setSelectedKpis(kpiList[0]["Acquisition Manager"]);
        }
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
                            queryId={query.id}
                            onDepartmentChange={handleDepartmentChange}
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
                                viewKpis={teamKpiList}
                                VIEW_KPIS={VIEW_KPIS}
                                selectedView={view}
                                onKpiListChange={onKpiListChange}
                                modalType={modalType}
                                selectedKpis={selectedKpis}
                                setSelectedKpis={setSelectedKpis}
                                selectedDepartment={department}
                            />
                        </div>
                    </div>
                }
            </AnimateHeight>
        </div>
    );
};

export default TeamKpiQuery;
