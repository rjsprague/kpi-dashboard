"use client";

import { useEffect } from 'react';
import AcquisitionsKpiQuery from './AcquisitionsKpiQuery';
import TeamKpiQuery from './TeamKpiQuery';
import FinancialsKpiQuery from './FinancialsKpiQuery';
import Leaderboard from './Leaderboard';
import fetchKpiData from '../../lib/fetch-kpis';
import { useSelector } from 'react-redux';
import { selectSpaceId } from '../../../app/GlobalRedux/Features/client/clientSlice'
import useSWR from 'swr';
import ClosersLeaderboard from './ClosersLeaderboard';
import ClosersPayments from './ClosersPayments';

const KpiQuery = ({
    isProfessional,
    view,
    kpiList,
    query,
    onSetLoading,
    onFetchedKpiData,
    onTeamChange,
    isLoadingData,
    handleCloneLeaderboard,
    ...props
}) => {
    let id, dateRange, leadSource, departments, teamMembers, gte, lte;
    if (query) {
        ({ id, dateRange, leadSource, departments, teamMembers } = query);
        gte = dateRange?.gte || '';
        lte = dateRange?.lte || '';
    }
    const clientSpaceId = useSelector(selectSpaceId);
    const closersSpaceId = Number(process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID)

    const { data, error } = useSWR({ isProfessional, clientSpaceId, view, kpiList, leadSource, gte, lte, departments, teamMembers }, fetchKpiData);
    
    useEffect(() => {

        onSetLoading(id, true);
        if (data) {
            onFetchedKpiData(id, data);
            onSetLoading(id, false);
        }
    }, [data])

    if (error) return <div>Failed to load.</div>;

    switch (view) {
        case 'Acquisitions':
            return <AcquisitionsKpiQuery {...props} view={view} query={query} kpiList={kpiList} isLoadingData={isLoadingData} isProfessional={isProfessional} />;
        case 'Team':
            return (
                <TeamKpiQuery
                    {...props}
                    onTeamChange={onTeamChange}
                    view={view}
                    query={query}
                    kpiList={kpiList}
                    isLoadingData={isLoadingData}
                    isProfessional={isProfessional}
                />
            );
        case 'Financial':
            return <FinancialsKpiQuery {...props} view={view} query={query} kpiList={kpiList} isLoadingData={isLoadingData} isProfessional={isProfessional} />;
        case 'Leaderboard':
            if (clientSpaceId === closersSpaceId) {
                return <ClosersLeaderboard {...props} view={view} query={query} kpiList={kpiList} isProfessional={isProfessional} onCloneLeaderboard={handleCloneLeaderboard} />;
            } else {
            return <Leaderboard {...props} view={view} query={query} kpiList={kpiList} isProfessional={isProfessional} />;
            }
        case 'Payments':
            return <ClosersPayments {...props} view={view} query={query} kpiList={kpiList}  />;
        default:
            return <AcquisitionsKpiQuery {...props} view={view} query={query} kpiList={kpiList} isLoadingData={isLoadingData} isProfessional={isProfessional} />;
    }
};

export default KpiQuery;
