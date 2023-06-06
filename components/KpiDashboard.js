import { useState } from 'react';
import KpiQueryContainer from './kpi-components/KpiQueryContainer';
import NavigationBar from './kpi-components/NavigationBar';
import { KPI_VIEWS, VIEW_KPIS } from './kpi-components/constants';
import { getDatePresets } from "../lib/date-utils";

export default function KpiDashboard() {
  const [queryType, setQueryType] = useState(KPI_VIEWS.Acquisitions);
  const [kpiList, setKpiList] = useState(VIEW_KPIS[queryType]);
  const datePresets = getDatePresets();
  const [idCounter, setIdCounter] = useState(2);

  const initialQueries = [
    {
      id: 1,
      results: [],
      isOpen: true,
      isLoading: false,
      isUnavailable: false,
      leadSource: [],
      dateRange: { gte: datePresets['All Time'].startDate, lte: datePresets['All Time'].endDate },
      department: ["Lead Manager"],
      teamMember: []
    },
  ];

  const [queries, setQueries] = useState(initialQueries);

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
            department: department,
            teamMember: teamMembers,
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
    const newQuery = {
      id: idCounter,
      results: [],
      isOpen: true,
      isLoading: false,
      isUnavailable: false,
      leadSource: [],
      dateRange: { gte: datePresets['All Time'].startDate, lte: datePresets['All Time'].endDate },
      department: [],
      teamMember: []
    };
    setIdCounter(idCounter + 1);
    setQueries([...queries, newQuery]);
  };

  const handleQueryTypeChange = (type) => {
    setQueryType(type);
    setKpiList(VIEW_KPIS[type]);
    setQueries(initialQueries);
  };

  const renderKpiResultsSection = () => {
    return <KpiQueryContainer
      view={queryType}
      kpiList={kpiList}
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
    />;
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <section>
          {/* Navigation bar */}
          <NavigationBar onQueryTypeChange={handleQueryTypeChange} />
        </section>
        <section className="flex flex-col h-full px-4 py-2">
          {/* KPI Results Section */}
          {renderKpiResultsSection()}
        </section>
      </div>
    </>
  );
}
