"use client";

import { useState, useEffect } from 'react';
import KpiQueryContainer from './kpi-components/KpiQueryContainer';
import NavigationBar from './NavigationBar';
import { KPI_VIEWS, VIEW_KPIS } from './kpi-components/constants';
import { getDatePresets } from '../lib/date-utils'
import fetchLeadSources from '../lib/fetchLeadSources';
import fetchActiveTeamMembers from '../lib/fetchActiveTeamMembers';
import LoadingQuotes from './LoadingQuotes';
import { useSelector, useDispatch } from 'react-redux';
import { selectSpaceId } from '../../app/GlobalRedux/Features/client/clientSlice'

// import {
//     setQueries,
//     updateQuery,
//     updateQueryDateRange,
//     updateQueryLeadSource,
//     updateQueryDepartmentsAndTeamMembers,
//     removeQuery,
//     addQuery,
//     toggleQuery,
//     toggleLoading,
//     selectAllQueries
// } from '@/GlobalRedux/Features/kpiQueries/kpiQueriesSlice';

export default function KpiDashboard({ user }) {
    // console.log(user)

    const [isAdmin, setIsAdmin] = useState(user ? user.isAdmin : false);
    const [isProfessional, setIsProfessional] = useState(user ? user.isProfessional : false);
    const [isScaling, setIsScaling] = useState(user ? user.isScaling : false);
    const [isStarter, setIsStarter] = useState(user ? user.isStarter : false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [queryType, setQueryType] = useState("Acquisitions");
    const [leadSources, setLeadSources] = useState({});
    const [teamMembers, setTeamMembers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [closers, setClosers] = useState([]);
    const [setters, setSetters] = useState([]);
    const [kpiList, setKpiList] = useState();
    const datePresets = getDatePresets();
    const [idCounter, setIdCounter] = useState(0);
    const [queries, setQueries] = useState([]);
    const closersSpaceId = Number(process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID);
    const clientSpaceId = useSelector(selectSpaceId);

    // const dispatch = useDispatch();
    // const queries = useSelector(selectAllQueries);
    // console.log(clientSpaceId)

    // console.log(user)
    // console.log(isStarter)

    const professionalQuery = (type) => {
        return ({ id: idCounter + 1, kpiView: type ? type : "Acquisitions", results: [], isOpen: true, isLoading: false, isUnavailable: false, leadSources: [], dateRange: { gte: datePresets['Last Week'].startDate, lte: datePresets['Last Week'].endDate }, departments: ["Lead Manager"], teamMembers: [{ "Lead Manager": "Bob" }, { "Acquisition Manager": "Bob" }, { "Deal Analyst": "Bob" }] })
    }

    const createInitialQueries = (leadSourcesObject, departmentsDataObject, datePresets, newQueryId, kpiView) => {

        const firstDepartment = Object?.keys(departmentsDataObject)[0]
        const firstDeptTeamMembers = Object?.keys(departmentsDataObject[firstDepartment])

        const initialQuery = [
            {
                id: newQueryId ? 1 + newQueryId : 1,
                kpiView: kpiView ? kpiView : KPI_VIEWS.Acquisitions,
                results: [],
                isOpen: true,
                isLoading: true,
                isUnavailable: false,
                leadSources: [],
                dateRange: { gte: datePresets['Last Week'].startDate, lte: datePresets['Last Week'].endDate },
                departments: [firstDepartment],
                teamMembers: firstDeptTeamMembers,
                // closers: clientSpaceId === closersSpaceId ? Object.keys(departmentsDataObject["Closer"]) : [],
                closers: [],
                // setters: clientSpaceId === closersSpaceId ? Object.keys(departmentsDataObject["Setter"]) : [],
                setters: [],
                noSetter: false
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
                    // set closers and setters
                    const closers = Object.keys(departmentsDataObject["Closer"])
                    const setters = Object.keys(departmentsDataObject["Setter"])
                    setClosers(closers)
                    setSetters(setters)
                } else {
                    setKpiList(VIEW_KPIS["Acquisitions"]["Clients"]);
                }

                setQueries(createInitialQueries(leadSourcesObject, departmentsDataObject, datePresets));
                // dispatch(addQuery(createInitialQueries(leadSourcesObject, departmentsDataObject, datePresets)[0]))
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingData(false);
            }
        }

        if (clientSpaceId !== closersSpaceId && isProfessional || clientSpaceId !== closersSpaceId && isStarter) {
            // console.log("professional query")
            setLeadSources({});
            setDepartments([]);
            setTeamMembers([]);
            setQueryType(KPI_VIEWS.Acquisitions);
            setKpiList(VIEW_KPIS["Acquisitions"]["Clients"]);
            let newQuery = professionalQuery("Acquisitions");
            setIdCounter(newQuery.id);
            setQueries([newQuery]);
            // dispatch(addQuery([professionalQuery]))
            setIsLoadingData(false);
            return;
        } else if (clientSpaceId !== closersSpaceId && isScaling) {
            // console.log("scaling query")
            getSetData();
        } else if (clientSpaceId === closersSpaceId || isAdmin) {
            // console.log("closers query")
            getSetData();
        } else {
            // console.log("no query")
            setLeadSources({});
            setDepartments([]);
            setTeamMembers([]);
            setQueryType(KPI_VIEWS.Acquisitions);
            setKpiList(VIEW_KPIS["Acquisitions"]["Clients"]);
            let newQuery = professionalQuery("Acquisitions");
            setQueries([newQuery]);
            // dispatch(addQuery([professionalQuery]))
            setIsLoadingData(false);
        }

    }, [clientSpaceId, user]);

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

        // console.log(data)
        // dispatch(updateQuery(queryId, data))
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
        // dispatch(updateQueryDateRange(queryId, startDate, endDate))
    };

    const handleLeadSourceChange = (queryId, leadSources) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId
                    ? {
                        ...query,
                        leadSources: leadSources,
                    }
                    : query
            )
        );
        // dispatch(updateQueryLeadSource(queryId, leadSources))
    };

    const handleTeamChange = (queryId, department, teamMembers) => {
        console.log(department)
        console.log(teamMembers)
        

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
        // dispatch(updateQueryDepartmentsAndTeamMembers(queryId, department, teamMembers))
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
        // dispatch(toggleQuery(queryId))
    };

    const handleRemoveQuery = (queryId) => {
        setQueries((prevQueries) => prevQueries.filter((query) => query.id !== queryId));
        // dispatch(removeQuery(queryId))
    };

    const handleAddQuery = (type) => {
        setIdCounter(idCounter + 1);
        if (user.isProfessional && clientSpaceId !== closersSpaceId || user.isStarter && clientSpaceId !== closersSpaceId) {
            let newQuery = professionalQuery(type);
            setQueries([...queries, newQuery]);
            return;
        }
        setQueries([...queries, ...createInitialQueries(leadSources, departments, datePresets, idCounter + 1, type)]);
        // dispatch(addQuery(createInitialQueries(leadSources, departments, datePresets, idCounter + 1)[0]))
    };

    const createClonedLeaderboardQuery = (queryId, dayStart, dayEnd, weekStart, weekEnd, monthStart, monthEnd) => {
        const clonedQuery = [{
            id: queryId + 1,
            results: { "dayStart": dayStart, "dayEnd": dayEnd, "weekStart": weekStart, "weekEnd": weekEnd, "monthStart": monthStart, "monthEnd": monthEnd },
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
        // console.log(type)
        // console.log(queryType)
        if (clientSpaceId === closersSpaceId) {
            setKpiList(VIEW_KPIS[type]["Closers"]);
        } else {
            setKpiList(VIEW_KPIS[type]["Clients"]);
        }
        setIdCounter(idCounter + 1);

        // If the type is the same as the queryType, don't add a new query
        // Else if the type is different and there are no queries of that type, add a new query
        if (type === queryType) {
            return;
        } else if (user.isProfessional && clientSpaceId !== closersSpaceId && queries.filter((query) => query.kpiView === type).length === 0 || user.isStarter && clientSpaceId !== closersSpaceId && queries.filter((query) => query.kpiView === type).length === 0) {
            let newQuery = professionalQuery(type);
            setQueries([...queries, newQuery]);
        } else if (type !== queryType && queries.filter((query) => query.kpiView === type).length === 0) {
            setQueries([...queries, ...createInitialQueries(leadSources, departments, datePresets, idCounter + 1, type)]);
        }
        setQueryType(type);
    };

    const handleClosersChange = (closers, queryId) => {
        // console.log("closers", closers)
        setQueries((prevQueries) => {
            return prevQueries.map((query) => {
                if (query.id === queryId) {
                    return {
                        ...query,
                        closers: closers,
                    };
                } else {
                    return query;
                }
            });
        });
    };

    const handleSettersChange = (setters, queryId, noSetter) => {
        // console.log(queryId)
        // console.log("setters", setters)
        setQueries((prevQueries) => {
            return prevQueries.map((query) => {
                if (query.id === queryId) {
                    return {
                        ...query,
                        setters: setters,
                        noSetter: noSetter
                    };
                } else {
                    return query;
                }
            });
        });
    };

    const handleTeamMemberForClosersChange = (teamMembers, queryId) => {
        setQueries((prevQueries) => {
            return prevQueries.map((query) => {
                if (query.id === queryId) {
                    return {
                        ...query,
                        teamMembers: teamMembers,
                    };
                } else {
                    return query;
                }
            });
        });
    };

    const renderKpiResultsSection = () => {
        return <KpiQueryContainer
            isStarter={isStarter}
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
            handleClosersChange={handleClosersChange}
            handleSettersChange={handleSettersChange}
            handleTeamChange={handleTeamChange}
            handleTeamMemberForClosersChange={handleTeamMemberForClosersChange}
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
