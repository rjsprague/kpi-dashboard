"use client";

import { useState, useEffect } from 'react';
import KpiQueryContainer from './kpi-components/KpiQueryContainer';
import NavigationBar from './kpi-components/NavigationBar';
import { KPI_VIEWS, VIEW_KPIS } from './kpi-components/constants';
import { getDatePresets } from '../lib/date-utils'
import fetchLeadSources from '../lib/fetchLeadSources';
import fetchActiveTeamMembers from '../lib/fetchActiveTeamMembers';
import LoadingQuotes from './LoadingQuotes';
import { useSelector } from 'react-redux';
import { selectSpaceId } from '../../app/GlobalRedux/Features/client/clientSlice'

export default function KpiDashboard() {
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [queryType, setQueryType] = useState();
    const [leadSources, setLeadSources] = useState({});
    const [teamMembers, setTeamMembers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [kpiList, setKpiList] = useState();
    const datePresets = getDatePresets();
    const [idCounter, setIdCounter] = useState(0);
    const [queries, setQueries] = useState([]);
    const clientSpaceId = useSelector(selectSpaceId);
    const closersSpaceId = process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID;
    // console.log(clientSpaceId)
    // console.log(closersSpaceId)
    // console.log(clientSpaceId == closersSpaceId)


    //console.log("clientSpaceId: ", clientSpaceId)
    // console.log("lead sources object ", leadSources)
    // console.log("Queries ", queries.map((query) => query.id))

    const createInitialQueries = (leadSourcesObject, departmentsDataObject, datePresets, newQueryId) => {
        const firstDepartment = Object?.keys(departmentsDataObject)[0]
        //console.log("first department ", firstDepartment)
        const firstDeptTeamMembers = Object?.keys(departmentsDataObject[firstDepartment])
        //console.log("first department team members ", firstDeptTeamMembers)
        return [
            {
                id: newQueryId ? 1 + newQueryId : 1,
                results: [],
                isOpen: true,
                isLoading: false,
                isUnavailable: false,
                leadSource: leadSourcesObject,
                dateRange: { gte: datePresets['Previous Week'].startDate, lte: datePresets['Previous Week'].endDate },
                departments: [firstDepartment],
                teamMembers: firstDeptTeamMembers,
            },
        ];
    };

    // Fetch lead sources and departmentData on component mount
    useEffect(() => {
        async function getLeadSources() {
            setIsLoadingData(true);
            try {

                // console.log("clientSpaceId: ", clientSpaceId)
                const leadSourcesData = await fetchLeadSources(clientSpaceId);
                // console.log("lead sources data ", leadSourcesData)
                setLeadSources(leadSourcesData);
                const leadSourcesObject = leadSourcesData;
                const departmentsData = await fetchActiveTeamMembers(clientSpaceId);
                console.log("departments data ", departmentsData)
                setDepartments(departmentsData)
                setTeamMembers(departmentsData)
                const departmentsDataObject = departmentsData;
                setQueryType(KPI_VIEWS.Acquisitions);
                if (clientSpaceId == closersSpaceId) {
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
        getLeadSources();
    }, [clientSpaceId]);



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
        //console.log("values", values)
        //console.log("queryId", queryId)

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
        console.log("query.id ", queries)
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
        setQueries([...queries, ...createInitialQueries(leadSources, departments, datePresets, idCounter + 1)]);
    };

    const handleQueryTypeChange = (type) => {
        setQueryType(type);
        if (clientSpaceId == closersSpaceId) {
            setKpiList(VIEW_KPIS[type]["Closers"]);
        } else {
            setKpiList(VIEW_KPIS[type]["Clients"]);
        }
        setQueries(createInitialQueries(leadSources, departments, datePresets));
    };

    const handleTeamMemberForClosersChange = (teamMember, queryId) => {
        console.log("team member ", teamMember)
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
            isLoadingData={isLoadingData}
        />;
    };

    return (
        <div className="absolute left-0 right-0 flex flex-col h-full top-20 max-w-screen lg:left-20">
            <NavigationBar onQueryTypeChange={handleQueryTypeChange} />
            <div className="flex flex-col h-full px-3 pt-2 pb-24 overflow-y-auto">
                {renderKpiResultsSection()}
            </div>
        </div>
    );
}
