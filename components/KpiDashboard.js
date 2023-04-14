import { useState } from 'react';
import KpiViews from './kpi-components/KpiViews';
import NavigationBar from './kpi-components/NavigationBar';

const KPI_VIEWS = {
  Financial: 'Financials',
  Acquisitions: 'Acquisitions',
  Dispositions: 'Dispositions',
  Team: 'Team',
};

export default function KpiDashboardTest() {
  const [queryType, setQueryType] = useState(KPI_VIEWS.Acquisitions);

  const handleQueryTypeChange = (type) => {
    setQueryType(KPI_VIEWS[type]);
  };

  const renderKpiResultsSection = () => {
    return <KpiViews view={queryType} />;
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
