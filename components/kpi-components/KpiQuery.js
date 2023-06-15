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
  ...props
}) => {
  const { id, dateRange, leadSource, department, teamMember } = query;
  
  useEffect(() => {
    const fetchData = async () => {
      onSetLoading(id, true);

      const ls = Object.values(leadSource);
      const gte = dateRange?.gte || '';
      const lte = dateRange?.lte || '';
      const dept = department || [];
      const teamMem = teamMember || [];

      // console.log("lead source values ", ls)
      // console.log("var type of a lead source ", typeof(ls[0]))

      try {
        const data = await fetchKpiData(view, kpiList, ls, gte, lte, dept, teamMem);
        onFetchedKpiData(id, data);
        // console.log("data in KpiQuery: ", data)
      } catch (error) {
        console.error(error);
        // Handle the error appropriately
        return <ServiceUnavailable />;
      } finally {
        onSetLoading(id, false);
      }
    };

    fetchData();
  }, [view, kpiList, dateRange, leadSource.length, department, teamMember]);

  // console.log("queries in KpiQuery: ", query)

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
        />
      );
    case 'Financial':
      return <FinancialsKpiQuery {...props} view={view} query={query} kpiList={kpiList} />;
    case 'Leaderboard':
      return <Leaderboard {...props} view={view} query={query} kpiList={kpiList} />;
    default:
      return <AcquisitionsKpiQuery {...props} view={view} query={query} kpiList={kpiList} />;
  }
};

export default KpiQuery;
