import { useState } from 'react';
import KpiQuery from './KpiQuery';
import AddQueryButton from './AddQueryButton';
import { VIEW_KPIS } from './constants';

const KpiQueryContainer = ({ 
    view, 
    kpiList, 
    queries,      
    handleSetLoading,     
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

    return (
        <div>
            {queries.map((query) => (
                <KpiQuery
                    key={query.id}
                    view={view}
                    VIEW_KPIS={VIEW_KPIS}
                    query={query}
                    kpiList={kpiList}
                    teamMember={query.teamMember}
                    department={query.department}
                    onDateRangeChange={handleDateRangeChange}
                    onLeadSourceChange={handleLeadSourceChange}
                    onToggleQuery={handleToggleQuery}
                    onRemoveQuery={handleRemoveQuery}
                    onFetchedKpiData={handleFetchedKpiData}
                    onSetLoading={handleSetLoading}
                    onTeamChange={handleTeamChange}
                />
            ))}
            <AddQueryButton handleAddQuery={handleAddQuery} />
        </div>
    );
};

export default KpiQueryContainer;