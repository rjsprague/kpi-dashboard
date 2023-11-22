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
    handleClosersChange,
    handleSettersChange,
    handleToggleQuery,
    handleRemoveQuery,
    handleAddQuery,
    handleTeamChange,
    handleTeamMemberForClosersChange,
    handleCloneLeaderboard,
    isLoadingData
}) => {

    // console.log('queries', queries)
    // console.log('view', view)

    return (
        <div>
            {
                // Only render queries that match the current view
                queries.filter((query) => query.kpiView === view)
                .map((query) => (
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
                        onClosersChange={handleClosersChange}
                        onSettersChange={handleSettersChange}
                        onToggleQuery={handleToggleQuery}
                        onRemoveQuery={handleRemoveQuery}
                        onFetchedKpiData={handleFetchedKpiData}
                        onSetLoading={handleSetLoading}
                        onSetLeadSourcesLoading={handleSetLeadSourcesLoading}
                        onTeamChange={handleTeamChange}
                        onTeamMemberForClosersChange={handleTeamMemberForClosersChange}
                        isLoadingData={isLoadingData}
                        handleAddQuery={handleAddQuery}
                        handleCloneLeaderboard={handleCloneLeaderboard}
                    />
                ))
            }
            <AddQueryButton handleAddQuery={handleAddQuery} view={view} />
        </div>
    );
};

export default KpiQueryContainer;