import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
// import getClosersPayments from '../../lib/closers-payments'
import QueryPanel from './QueryPanel';
import AnimateHeight from 'react-animate-height';
import SingleDateRangeSelector from './SingleDateRangeSelector';
import ServiceUnavailable from '../ServiceUnavailable';
import { useSelector } from 'react-redux';
import { selectSpaceId } from '../../../app/GlobalRedux/Features/client/clientSlice'
import UniversalDropdown from './UniversalDropdown';
import DropdownButton from './DropdownButton';
import RightSlideModal from '../RightSlideModal';
import KpiSwiper from './KpiSwiper';


export default function ClosersPayments({
    view,
    VIEW_KPIS,
    query,
    departments,
    kpiList,
    onDateRangeChange,
    onTeamMemberForClosersChange,
    onToggleQuery,
    onRemoveQuery,
    isLoadingData,
    isProfessional
}) {
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

    // const { data: paymentsData, error: paymentsError } = useSWR({ departments: departments, dateRange: dateRange }, getClosersPayments);

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

    const handleToggleQuery = () => {
        setHeight(height === 'auto' ? 0 : 'auto');
        onToggleQuery();
    }

    const handleGearIconClick = () => {
        setModalType('settings');
        setOpenModal(true);
    }

    const handleKpiCardClick = async (startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName) => {
        //console.log("handleKpiCardClick: ", startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName)
        setTableProps({ startDate, endDate, leadSource, kpiView, teamMembers, clientSpaceId, apiName });
        setModalType("table")
        setOpenModal(true)
    };

    const handleCardInfoClick = (result) => {
        setSelectedResult(result);
        setModalType("info");
        setOpenModal(true);
    };

    const handleRemoveQuery = () => {
        onRemoveQuery && onRemoveQuery(query.id)
    }

    const handleDateRangeChange = (startDate, endDate) => {
        onDateRangeChange(startDate, endDate, query.id);
    };

    const handleTeamMemberForClosersChange = (selectedTeamMembers) => {
        const selectedTeamMemberIds = selectedTeamMembers.map(option => reversedTeamMembersForClosers[option])
        setSelectedTeamMembersForClosers(selectedTeamMembers)
        onTeamMemberForClosersChange(selectedTeamMemberIds, query.id)
    };

    return (
        <>
            <QueryPanel query={query} height={height} setHeight={setHeight} handleToggleQuery={handleToggleQuery} handleRemoveQuery={handleRemoveQuery} handleGearIconClick={handleGearIconClick}>
                <div className='flex flex-col gap-2 xs:flex-row'>
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
                    <SingleDateRangeSelector queryId={query.id} onDateRangeChange={handleDateRangeChange} />
                </div>
            </QueryPanel>
            <AnimateHeight id={query.id} duration={500} height={height}>
                {query.isUnavailable ? <ServiceUnavailable /> :
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
                                    modalType={modalType}
                                    viewKpis={kpiList}
                                    VIEW_KPIS={VIEW_KPIS}
                                    selectedView={view}
                                    tableProps={tableProps}
                                    selectedKpis={selectedKpis}
                                    setSelectedKpis={setSelectedKpis}
                                    isProfessional={isProfessional}
                                    departments={departments}
                                />
                            }
                        </div>
                    </div>
                }
            </AnimateHeight>
        </>
    )
}