"use client";

import { useState, useEffect } from 'react';
import KpiQueryContainer from './kpi-components/KpiQueryContainer';
import NavigationBar from './NavigationBar';
import { KPI_VIEWS, VIEW_KPIS } from './kpi-components/constants';
import { getDatePresets } from '../lib/date-utils'
import fetchLeadSources from '../lib/fetchLeadSources';
import fetchActiveTeamMembers from '../lib/fetchActiveTeamMembers';
import LoadingQuotes from './LoadingQuotes';
import { useSelector } from 'react-redux';
import { selectSpaceId } from '../../app/GlobalRedux/Features/client/clientSlice'

export default function KpiDashboard({ user }) {
    // console.log(user)

    const [isAdmin, setIsAdmin] = useState(user ? user.isAdmin : false);
    const [isProfessional, setIsProfessional] = useState(user ? user.isProfessional : false);
    const [isScaling, setIsScaling] = useState(user ? user.isScaling : false);
    const [isStarter, setIsStarter] = useState(user ? user.isStarter : false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [queryType, setQueryType] = useState();
    const [leadSources, setLeadSources] = useState({});
    const [teamMembers, setTeamMembers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [kpiList, setKpiList] = useState();
    const datePresets = getDatePresets();
    const [idCounter, setIdCounter] = useState(0);
    const [queries, setQueries] = useState([]);
    const closersSpaceId = Number(process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID);
    const clientSpaceId = useSelector(selectSpaceId);
    
    const professionalQuery = { id: idCounter + 1, results: [], isOpen: true, isLoading: false, isUnavailable: false, leadSource: {}, dateRange: { gte: datePresets['Previous Week'].startDate, lte: datePresets['Previous Week'].endDate }, departments: ["Lead Manager"], teamMembers: [{"Lead Manager":"Bob"}, {"Acquisition Manager":"Bob"}, {"Deal Analyst": "Bob"}] }

    const createInitialQueries = (leadSourcesObject, departmentsDataObject, datePresets, newQueryId, kpiView) => {
        const firstDepartment = Object?.keys(departmentsDataObject)[0]
        const firstDeptTeamMembers = Object?.keys(departmentsDataObject[firstDepartment])

        const initialQuery = [
            {
                id: newQueryId ? 1 + newQueryId : 1,
                results: [],
                isOpen: true,
                isLoading: true,
                isUnavailable: false,
                leadSource: leadSourcesObject,
                dateRange: { gte: datePresets['Previous Week'].startDate, lte: datePresets['Previous Week'].endDate },
                departments: [firstDepartment],
                teamMembers: firstDeptTeamMembers,
            },
        ];
        return initialQuery;
    };

    // Fetch lead sources and departmentData on component mount, create initial queries
    useEffect(() => {

        if (!user) {
            return;
        }

        setIsAdmin(user.isAdmin);
        setIsProfessional(user.isProfessional);
        setIsScaling(user.isScaling);
        setIsStarter(user.isStarter);

        async function getSetData() {
            if (!clientSpaceId) {
                return;
            }
            // console.log(clientSpaceId)
            setIsLoadingData(true);
            try {
                const leadSourcesData = await fetchLeadSources(clientSpaceId);
                setLeadSources(leadSourcesData);
                const leadSourcesObject = leadSourcesData;
                const departmentsData = await fetchActiveTeamMembers(clientSpaceId);
                setDepartments(departmentsData)
                setTeamMembers(departmentsData)
                const departmentsDataObject = departmentsData;
                setQueryType(KPI_VIEWS.Acquisitions);
                if (clientSpaceId === closersSpaceId) {
                    setKpiList(VIEW_KPIS["Acquisitions"]["Closers"]);
                } else {
                    setKpiList(VIEW_KPIS["Acquisitions"]["Clients"]);
                }
                setQueries(createInitialQueries(leadSourcesObject, departmentsDataObject, datePresets));
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingData(false);
            }
        }

        if (clientSpaceId !== closersSpaceId && isProfessional) {
            // console.log("professional query")
            setLeadSources({});
            setDepartments([]);
            setTeamMembers([]);
            setQueryType(KPI_VIEWS.Acquisitions);
            setKpiList(VIEW_KPIS["Acquisitions"]["Clients"]);
            setQueries([professionalQuery]);
            setIsLoadingData(false);
            return;
        } else if (clientSpaceId !== closersSpaceId && isScaling) {
            // console.log("scaling query")
            getSetData();
        } else if (clientSpaceId === closersSpaceId || isAdmin) {
            // console.log("closers query")
            getSetData();
        } else {
            console.log("no query")
            setLeadSources({});
            setDepartments([]);
            setTeamMembers([]);
            setQueryType(KPI_VIEWS.Acquisitions);
            setKpiList(VIEW_KPIS["Acquisitions"]["Clients"]);
            setQueries([professionalQuery]);
            setIsLoadingData(false);
        }
        
    }, [clientSpaceId, isProfessional, isScaling, user]);

    if (isLoadingData) {
        return (
            <div className='absolute inset-0 flex items-center justify-center w-screen h-screen'>
                <LoadingQuotes mode={'dark'} />
            </div>
        )
    }

    const handleSetLoading = (queryId, isLoading) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId ? { ...query, isLoading: isLoading } : query
            )
        );
    };

    const handleSetUnavailable = (queryId, isUnavailable) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId ? { ...query, isUnavailable: isUnavailable } : query
            )
        );
    };

    const handleFetchedKpiData = (queryId, data) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId ? { ...query, results: data } : query
            )
        );
    };

    const handleDateRangeChange = (startDate, endDate, queryId) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId
                    ? {
                        ...query,
                        dateRange: {
                            gte: startDate,
                            lte: endDate,
                        },
                    }
                    : query
            )
        );
    };

    const handleLeadSourceChange = (values, queryId) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId
                    ? {
                        ...query,
                        leadSource: values,
                    }
                    : query
            )
        );
    };

    const handleTeamChange = (department, teamMembers, queryId) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId
                    ? {
                        ...query,
                        departments: department,
                        teamMembers: teamMembers,
                    }
                    : query
            )
        );
    };

    const handleToggleQuery = (queryId) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId
                    ? {
                        ...query,
                        isOpen: !query.isOpen,
                    }
                    : query
            )
        );
    };

    const handleRemoveQuery = (queryId) => {
        setQueries((prevQueries) => prevQueries.filter((query) => query.id !== queryId));
    };

    const handleAddQuery = () => {
        setIdCounter(idCounter + 1);
        if (user.isProfessional && clientSpaceId !== closersSpaceId) {
            setQueries([...queries, professionalQuery]);
            return;
        }
        setQueries([...queries, ...createInitialQueries(leadSources, departments, datePresets, idCounter + 1)]);
    };

    const createClonedLeaderboardQuery = (queryId, dayStart, dayEnd, weekStart, weekEnd, monthStart, monthEnd) => {
        const clonedQuery = [{
            id: queryId + 1,
            results: { "dayStart":dayStart, "dayEnd":dayEnd, "weekStart":weekStart, "weekEnd":weekEnd, "monthStart":monthStart, "monthEnd":monthEnd },
            isOpen: true,
            isLoading: true,
            isUnavailable: false,
        }];
        return clonedQuery;
    }

    const handleCloneLeaderboard = (dayStart, dayEnd, weekStart, weekEnd, monthStart, monthEnd) => {
        setIdCounter(idCounter + 1);
        setQueries([...queries, ...createClonedLeaderboardQuery(idCounter + 1, dayStart, dayEnd, weekStart, weekEnd, monthStart, monthEnd)]);
    }

    const handleQueryTypeChange = (type) => {
        setQueryType(type);
        if (clientSpaceId === closersSpaceId) {
            setKpiList(VIEW_KPIS[type]["Closers"]);
        } else {
            setKpiList(VIEW_KPIS[type]["Clients"]);
        }
        setIdCounter(idCounter + 1);
        if (user.isProfessional && clientSpaceId !== closersSpaceId) {
            setQueries([professionalQuery]);
            return;
        }
        setQueries(createInitialQueries(leadSources, departments, datePresets, idCounter + 1, type));
    };

    const handleTeamMemberForClosersChange = (teamMember, queryId) => {
        // console.log("team member ", teamMember)
        setQueries((prevQueries) => {
            return prevQueries.map((query) => {
                if (query.id === queryId) {
                    return {
                        ...query,
                        teamMembers: teamMember,
                    };
                } else {
                    return query;
                }
            });
        });
    };

    const renderKpiResultsSection = () => {
        return <KpiQueryContainer
            isProfessional={isProfessional}
            view={queryType}
            kpiList={kpiList}
            leadSources={leadSources}
            departments={departments}
            queries={queries}
            setQueries={setQueries}
            datePresets={datePresets}
            handleSetLoading={handleSetLoading}
            handleSetUnavailable={handleSetUnavailable}
            handleFetchedKpiData={handleFetchedKpiData}
            handleDateRangeChange={handleDateRangeChange}
            handleLeadSourceChange={handleLeadSourceChange}
            handleTeamMemberForClosersChange={handleTeamMemberForClosersChange}
            handleTeamChange={handleTeamChange}
            handleToggleQuery={handleToggleQuery}
            handleRemoveQuery={handleRemoveQuery}
            handleAddQuery={handleAddQuery}
            handleCloneLeaderboard={handleCloneLeaderboard}
            isLoadingData={isLoadingData}
        />;
    };

    return (
        <div className="absolute left-0 right-0 flex flex-col h-full pb-20 top-20 max-w-screen lg:left-20">
            <NavigationBar items={Object.values(KPI_VIEWS)} onItemChange={handleQueryTypeChange} initialActiveItem={Object.values(KPI_VIEWS)[0]} />
            <div className="flex flex-col h-full px-3 pt-2 pb-24 overflow-y-auto">
                {renderKpiResultsSection()}
            </div>
        </div>
    );
}
