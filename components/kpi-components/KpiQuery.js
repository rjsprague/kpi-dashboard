import AcquisitionsKpiQuery from './AcquisitionsKpiQuery';
import TeamKpiQuery from './TeamKpiQuery';

const KpiQuery = ({ ...props }) => {
  
  switch (props.view) {
    case 'Acquisitions':
      return <AcquisitionsKpiQuery {...props} />;
    /*case 'Team':
      //return <TeamKpiQuery {...props} />;
    case 'Financials':
      return <FinancialsKpiQuery {...props} />;
    case 'Dispositions':
      return <DispositionsKpiQuery {...props} />;
      */
    default:
      return <AcquisitionsKpiQuery { ...props} />;
  }
};

export default KpiQuery;