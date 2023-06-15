import { useEffect } from 'react';
import AcquisitionsKpiQuery from './AcquisitionsKpiQuery';
import TeamKpiQuery from './TeamKpiQuery';
import FinancialsKpiQuery from './FinancialsKpiQuery';
import Leaderboard from './Leaderboard';
import fetchKpiData from '../../lib/fetch-kpis'
import ServiceUnavailable from '../ServiceUnavailable';

const KpiQuery = ({
  view,
  kpiList,
  query,
  onSetLoading,
  onFetchedKpiData,
  onTeamChange,
  isLoadingData,
  ...props
}) => {
  const { id, dateRange, leadSource, departments, teamMembers } = query;
  //console.log("department in KpiQuery: ", departments)
  //console.log("teamMember in KpiQuery: ", teamMembers)
  
  useEffect(() => {
    const fetchData = async () => {
      onSetLoading(id, true);

      const ls = Object.values(leadSource);
      const gte = dateRange?.gte || '';
      const lte = dateRange?.lte || '';
      const dept = departments || [];
      const teamMem = teamMembers || [];

      try {
        const data = await fetchKpiData(view, kpiList, ls, gte, lte, dept, teamMem);
        onFetchedKpiData(id, data);
        console.log("data in KpiQuery: ", data)
      } catch (error) {
        console.error(error);
        // Handle the error appropriately
        return <ServiceUnavailable />;
      } finally {
        onSetLoading(id, false);
      }
    };

    fetchData();
  }, [view, kpiList, dateRange, leadSource.length, departments, teamMembers]);

  // console.log("queries in KpiQuery: ", query)
  console.log("Kpi list in KpiQuery: ", kpiList)

  switch (view) {
    case 'Acquisitions':
      return <AcquisitionsKpiQuery {...props} view={view} query={query} kpiList={kpiList} />;
    case 'Team':
      return (
        <TeamKpiQuery
          {...props}
          onTeamChange={onTeamChange}
          view={view}
          query={query}
          kpiList={kpiList}
          isLoadingData={isLoadingData}
        />
      );
    case 'Financial':
      return <FinancialsKpiQuery {...props} view={view} query={query} kpiList={kpiList} isLoadingData={isLoadingData} />;
    case 'Leaderboard':
      return <Leaderboard {...props} view={view} query={query} kpiList={kpiList} />;
    default:
      return <AcquisitionsKpiQuery {...props} view={view} query={query} kpiList={kpiList} isLoadingData={isLoadingData} />;
  }
};

export default KpiQuery;
