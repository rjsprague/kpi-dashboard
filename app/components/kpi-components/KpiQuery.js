"use client";

import { useEffect } from 'react';
import AcquisitionsKpiQuery from './AcquisitionsKpiQuery';
import TeamKpiQuery from './TeamKpiQuery';
import FinancialsKpiQuery from './FinancialsKpiQuery';
import Leaderboard from './Leaderboard';
import fetchKpiData from '../../lib/fetch-kpis';
import { useSelector } from 'react-redux';
import { selectSpaceId } from '@/GlobalRedux/Features/client/clientSlice'
import useSWR from 'swr';
import ClosersLeaderboard from './ClosersLeaderboard';
import ClosersPayments from './ClosersPayments';

const KpiQuery = ({
    isStarter,
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

    let id, dateRange, leadSources, departments, teamMembers, gte, lte, closers, setters;
    if (query) {
        ({ id, dateRange, leadSources, departments, teamMembers, closers, setters } = query);
        gte = dateRange?.gte || '';
        lte = dateRange?.lte || '';
    }
    const clientSpaceId = useSelector(selectSpaceId);
    const closersSpaceId = Number(process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID)

    const { data, error } = useSWR({ isStarter, isProfessional, clientSpaceId, view, kpiList, leadSources, gte, lte, departments, teamMembers, closers, setters }, fetchKpiData);

    // console.log(id, data)

    useEffect(() => {

        onSetLoading(id, true);
        if (data) {
            onFetchedKpiData(id, data);
            onSetLoading(id, false);
        }
    }, [data])

    if (error) {
        // console.log(error)
        
        return (
            <div>Failed to load.</div>
        )
    }

    switch (view) {
        case 'Acquisitions':
            return <AcquisitionsKpiQuery {...props} view={view} query={query} kpiList={kpiList} isLoadingData={isLoadingData} isProfessional={isProfessional} isStarter={isStarter} />;
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
                    isStarter={isStarter}
                />
            );
        case 'Financial':
            return <FinancialsKpiQuery {...props} view={view} query={query} kpiList={kpiList} isLoadingData={isLoadingData} isProfessional={isProfessional} isStarter={isStarter} />;
        case 'Leaderboard':
            if (clientSpaceId === closersSpaceId) {
                return <ClosersLeaderboard {...props} view={view} query={query} kpiList={kpiList} isProfessional={isProfessional} onCloneLeaderboard={handleCloneLeaderboard} />;
            } else {
                return <Leaderboard {...props} view={view} query={query} kpiList={kpiList} isProfessional={isProfessional} isStarter={isStarter} />;
            }
        case 'Payments':
            return <ClosersPayments {...props} view={view} query={query} kpiList={kpiList} />;
        default:
            return <AcquisitionsKpiQuery {...props} view={view} query={query} kpiList={kpiList} isLoadingData={isLoadingData} isProfessional={isProfessional} isStarter={isStarter} />;
    }
};

export default KpiQuery;
