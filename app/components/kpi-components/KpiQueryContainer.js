"use client";

import { useState } from 'react';
import KpiQuery from './KpiQuery';
import AddQueryButton from './AddQueryButton';
import { VIEW_KPIS } from './constants';

const KpiQueryContainer = ({ 
    view, 
    kpiList,
    leadSources,
    departments,
    queries,      
    handleSetLoading,
    handleSetLeadSourcesLoading,     
    handleFetchedKpiData,
    handleDateRangeChange,
    handleLeadSourceChange,
    handleTeamMemberForClosersChange,
    handleToggleQuery,
    handleRemoveQuery,
    handleAddQuery,
    handleTeamChange,
    isLoadingData
}) => {

    // console.log("KpiViews view: ", view)
    // console.log("kpilist: ", kpiList)
    // console.log("lead sources: ", leadSources)
    // console.log("queries: ", queries)

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
                    departments={departments}
                    onDateRangeChange={handleDateRangeChange}
                    onLeadSourceChange={handleLeadSourceChange}
                    onTeamMemberForClosersChange={handleTeamMemberForClosersChange}
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