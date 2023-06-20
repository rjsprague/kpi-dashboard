"use client";

import { useState, useEffect } from 'react';
import KpiQueryContainer from './kpi-components/KpiQueryContainer';
import NavigationBar from './kpi-components/NavigationBar';
import { KPI_VIEWS, VIEW_KPIS } from './kpi-components/constants';
import { getDatePresets } from '../lib/date-utils'
import fetchLeadSources from '../lib/fetchLeadSources';
import fetchActiveTeamMembers from '../lib/fetchActiveTeamMembers';

export default function KpiDashboard() {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [queryType, setQueryType] = useState(KPI_VIEWS.Acquisitions);
  const [leadSources, setLeadSources] = useState({});
  const [teamMembers, setTeamMembers] = useState();
  const [departments, setDepartments] = useState();
  const [kpiList, setKpiList] = useState(VIEW_KPIS[queryType]);
  const datePresets = getDatePresets();
  const [idCounter, setIdCounter] = useState(0);
  const [queries, setQueries] = useState([]);

  // console.log("lead sources object ", leadSources)
  // console.log("Queries ", queries.map((query) => query.id))

  const createInitialQueries = (leadSourcesObject, departmentsDataObject, datePresets, newQueryId) => {
    const firstDepartment = Object.keys(departmentsDataObject)[0]
    //console.log("first department ", firstDepartment)
    const firstDeptTeamMembers = Object.keys(departmentsDataObject[firstDepartment])
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

  // Fetch lead sources on component mount
  useEffect(() => {
    async function getLeadSources() {
      setIsLoadingData(true);
      try {
        const leadSourcesData = await fetchLeadSources();
        setLeadSources(leadSourcesData);
        const leadSourcesObject = leadSourcesData;
        const departmentsData = await fetchActiveTeamMembers();
        setDepartments(departmentsData)
        setTeamMembers(departmentsData)
        const departmentsDataObject = departmentsData;
        setQueries(createInitialQueries(leadSourcesObject, departmentsDataObject, datePresets));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingData(false);
      }
    }
    getLeadSources();
  }, []);


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
    console.log("department", department)
    console.log("teamMembers", teamMembers)


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
    setKpiList(VIEW_KPIS[type]);
    setQueries(createInitialQueries(leadSources, departments, datePresets));
  };

  const renderKpiResultsSection = () => {
    return <KpiQueryContainer
      view={queryType}
      kpiList={kpiList}
      leadSources={leadSources}
      departments={departments}
      teamMembers={teamMembers}
      queries={queries}
      setQueries={setQueries}
      datePresets={datePresets}
      handleSetLoading={handleSetLoading}
      handleSetUnavailable={handleSetUnavailable}
      handleFetchedKpiData={handleFetchedKpiData}
      handleDateRangeChange={handleDateRangeChange}
      handleLeadSourceChange={handleLeadSourceChange}
      handleTeamChange={handleTeamChange}
      handleToggleQuery={handleToggleQuery}
      handleRemoveQuery={handleRemoveQuery}
      handleAddQuery={handleAddQuery}
      isLoadingData={isLoadingData}
    />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar onQueryTypeChange={handleQueryTypeChange} />
      <div className="flex flex-col h-full px-2 py-2 sm:px-4">
        {renderKpiResultsSection()}
      </div>
    </div>
  );
}
