import { useEffect } from 'react';
import AcquisitionsKpiQuery from './AcquisitionsKpiQuery';
import TeamKpiQuery from './TeamKpiQuery';
import FinancialsKpiQuery from './FinancialsKpiQuery';
import fetchKpiData from '../../lib/fetch-kpis';

const KpiQuery = ({ ...props }) => {
  //console.log("KpiQuery props", props)

  useEffect(() => {
    const fetchData = async () => {
      props.onSetLoading(props.query.id, true);

      const leadSource = props.query.leadSource || [];
      const gte = props.query.dateRange?.gte || '';
      const lte = props.query.dateRange?.lte || '';
      const teamMember = props.query.teamMember || [];

      const data = await fetchKpiData(props.view, props.kpiList, leadSource, gte, lte, teamMember);
      
      props.onFetchedKpiData(props.query.id, data);
      props.onSetLoading(props.query.id, false);
    };

    fetchData();
  }, [props.view, props.kpiList, props.query.dateRange, props.query.leadSource]);

  switch (props.view) {
    case 'Acquisitions':
      return <AcquisitionsKpiQuery {...props} />;
    case 'Team':
      return <TeamKpiQuery {...props} />;
    case 'Financial':
      return <FinancialsKpiQuery {...props} />;
    case 'Dispositions':
      return <DispositionsKpiQuery {...props} />;
    default:
      return <AcquisitionsKpiQuery {...props} />;
  }
};

export default KpiQuery;