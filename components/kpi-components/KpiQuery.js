import { useEffect } from 'react';
import AcquisitionsKpiQuery from './AcquisitionsKpiQuery';
import TeamKpiQuery from './TeamKpiQuery';
import FinancialsKpiQuery from './FinancialsKpiQuery';
import Leaderboard from './Leaderboard';
import fetchKpiData from '../../lib/fetch-kpis';

const KpiQuery = ({ ...props }) => {
  //console.log("KpiQuery props query department", props.query.department)
  //console.log("KpiQuery props query team member", props.query.teamMember)
  //console.log("KpiQuery props query lead source", props.query.leadSource)
  //console.log("KpiQuery props query date range", props.query.dateRange)
  //console.log("On Team Change props", props.onTeamChange)

  useEffect(() => {
    const fetchData = async () => {
      props.onSetLoading(props.query.id, true);

      const leadSource = props.query.leadSource || [];
      const gte = props.query.dateRange?.gte || '';
      const lte = props.query.dateRange?.lte || '';
      const department = props.query.department || [];
      const teamMember = props.query.teamMember || [];

      //console.log("KpiQuery fetchData leadSource", leadSource)
      //console.log("KpiQuery fetchData gte", gte)
      //console.log("KpiQuery fetchData lte", lte)
      //console.log("KpiQuery fetchData department", department)
      //console.log("KpiQuery fetchData teamMember", teamMember)


      const data = await fetchKpiData(props.view, props.kpiList, leadSource, gte, lte, department, teamMember);

      props.onFetchedKpiData(props.query.id, data);
      props.onSetLoading(props.query.id, false);
    };

    fetchData();
  }, [props.view, props.kpiList, props.query.dateRange, props.query.leadSource, props.query.department, props.query.teamMember]);

  switch (props.view) {
    case 'Acquisitions':
      return <AcquisitionsKpiQuery {...props} />;
    case 'Team':
      return (
        <TeamKpiQuery
          {...props}
          onTeamChange={props.onTeamChange}
        />
      );
    case 'Financial':
      return <FinancialsKpiQuery {...props} />;
    case 'Leaderboard':
      return <Leaderboard />;
    default:
      return <AcquisitionsKpiQuery {...props} />;
  }
};

export default KpiQuery;