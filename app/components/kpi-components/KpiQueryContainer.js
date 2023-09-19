"use client";

import { useState } from 'react';
import KpiQuery from './KpiQuery';
import AddQueryButton from './AddQueryButton';
import { VIEW_KPIS } from './constants';

const KpiQueryContainer = ({ 
    isProfessional,
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

    return (
        <div>
            {queries.map((query) => (
                <KpiQuery
                    isProfessional={isProfessional}
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
                    handleAddQuery={handleAddQuery}
                />
            ))}
            <AddQueryButton handleAddQuery={handleAddQuery} />
        </div>
    );
};

export default KpiQueryContainer;