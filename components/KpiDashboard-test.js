import React, { useState, useEffect } from 'react';
import AcquisitionKpis from './kpi-components/AcquisitionKpis';
import NavigationBar from './kpi-components/NavigationBar';
import KpiQuery from './kpi-components/KpiQuery';

export default function KpiDashboardTest() {
    const [queryType, setQueryType] = useState('Acquisitions');

    const handleQueryTypeChange = (type) => {
        setQueryType(type);
    };

    const renderKpiResultsSection = () => {
        switch (queryType) {
            case 'Acquisitions':
                return <AcquisitionKpis />;
            case 'Dispositions':
                // Replace with your Dispositions KPIs component
                return <div>Dispositions</div>;
            case 'Team':
                // Replace with your Team KPIs component
                return <div>Team</div>;
            default:
                return <AcquisitionKpis />;
        }
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
