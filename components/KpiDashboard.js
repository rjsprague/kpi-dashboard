import { useState } from 'react';
import KpiQueryContainer from './kpi-components/KpiQueryContainer';
import NavigationBar from './kpi-components/NavigationBar';
import { KPI_VIEWS, VIEW_KPIS } from './kpi-components/constants';

export default function KpiDashboard() {
  const [queryType, setQueryType] = useState(KPI_VIEWS.Acquisitions);
  const [kpiList, setKpiList] = useState(VIEW_KPIS[queryType]);

  const handleQueryTypeChange = (type) => {
    setQueryType(type);
    setKpiList(VIEW_KPIS[type]);
  };

  const renderKpiResultsSection = () => {
    return <KpiQueryContainer view={queryType} kpiList={kpiList} />;
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
