import { useState } from 'react';
import KpiQuery from './KpiQuery';
import AddQueryButton from './AddQueryButton';
import { VIEW_KPIS } from './constants';

const KpiQueryContainer = ({ 
    view, 
    kpiList,
    leadSources,
    departments,
    teamMembers,
    queries,      
    handleSetLoading,
    handleSetLeadSourcesLoading,     
    handleFetchedKpiData,
    handleDateRangeChange,
    handleLeadSourceChange,
    handleToggleQuery,
    handleRemoveQuery,
    handleAddQuery,
    handleTeamChange,
    isLoadingData
}) => {

    console.log("KpiViews view: ", view)
    console.log("kpilist: ", kpiList)
    console.log("lead sources: ", leadSources)
    console.log("queries: ", queries)

    return (
        <div>
            {queries.map((query) => (
                <KpiQuery
                    key={query.id}
                    view={view}
                    VIEW_KPIS={VIEW_KPIS}
                    query={query}
                    kpiList={kpiList}
                    leadSources={leadSources}
                    teamMembers={teamMembers}
                    departments={departments}
                    onDateRangeChange={handleDateRangeChange}
                    onLeadSourceChange={handleLeadSourceChange}
                    onToggleQuery={handleToggleQuery}
                    onRemoveQuery={handleRemoveQuery}
                    onFetchedKpiData={handleFetchedKpiData}
                    onSetLoading={handleSetLoading}
                    onSetLeadSourcesLoading={handleSetLeadSourcesLoading}
                    onTeamChange={handleTeamChange}
                    isLoadingData={isLoadingData}
                />
            ))}
            <AddQueryButton handleAddQuery={handleAddQuery} />
        </div>
    );
};

export default KpiQueryContainer;