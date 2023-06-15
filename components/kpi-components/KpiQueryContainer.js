import { useState } from 'react';
import KpiQuery from './KpiQuery';
import AddQueryButton from './AddQueryButton';
import { VIEW_KPIS } from './constants';

const KpiQueryContainer = ({ 
    view, 
    kpiList,
    leadSources,
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
}) => {

    //console.log("KpiViews view: ", view)
    //console.log("kpilist: ", kpiList)
    //console.log("lead sources: ", leadSources)
    //console.log("queries: ", queries)

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
                    teamMember={query.teamMember}
                    department={query.department}
                    onDateRangeChange={handleDateRangeChange}
                    onLeadSourceChange={handleLeadSourceChange}
                    onToggleQuery={handleToggleQuery}
                    onRemoveQuery={handleRemoveQuery}
                    onFetchedKpiData={handleFetchedKpiData}
                    onSetLoading={handleSetLoading}
                    onSetLeadSourcesLoading={handleSetLeadSourcesLoading}
                    onTeamChange={handleTeamChange}
                />
            ))}
            <AddQueryButton handleAddQuery={handleAddQuery} />
        </div>
    );
};

export default KpiQueryContainer;