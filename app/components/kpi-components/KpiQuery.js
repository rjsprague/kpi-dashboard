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

const KpiQuery = ({
    view,
    kpiList,
    query,
    onSetLoading,
    onFetchedKpiData,
    onTeamChange,
    isLoadingData,
    ...props
}) => {

    let id, dateRange, leadSource, departments, teamMembers, gte, lte;
    if (query) {
        ({ id, dateRange, leadSource, departments, teamMembers } = query);
        gte = dateRange?.gte || '';
        lte = dateRange?.lte || '';
    }
    const clientSpaceId = useSelector(selectSpaceId);

    const { data, error } = useSWR({ clientSpaceId, view, kpiList, leadSource, gte, lte, departments, teamMembers }, fetchKpiData);
    

    useEffect(() => {
        onSetLoading(id, true);
        if (data) {
            onFetchedKpiData(id, data);
            onSetLoading(id, false);
        }
    }, [data])

    switch (view) {
        case 'Acquisitions':
            return <AcquisitionsKpiQuery {...props} view={view} query={query} kpiList={kpiList} isLoadingData={isLoadingData} />;
        case 'Team':
            return (
                <TeamKpiQuery
                    {...props}
                    onTeamChange={onTeamChange}
                    view={view}
                    query={query}
                    kpiList={kpiList}
                    isLoadingData={isLoadingData}
                />
            );
        case 'Financial':
            return <FinancialsKpiQuery {...props} view={view} query={query} kpiList={kpiList} isLoadingData={isLoadingData} />;
        case 'Leaderboard':
            return <Leaderboard {...props} view={view} query={query} kpiList={kpiList} />;
        default:
            return <AcquisitionsKpiQuery {...props} view={view} query={query} kpiList={kpiList} isLoadingData={isLoadingData} />;
    }
};

export default KpiQuery;
