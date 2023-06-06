import { useState } from 'react';
import KpiQuery from './KpiQuery';
import AddQueryButton from './AddQueryButton';
import { getDatePresets } from "../../lib/date-utils";
import { VIEW_KPIS } from './constants';

const KpiQueryContainer = ({ view, kpiList }) => {

    //console.log("KpiViews view: ", view)
    //console.log("kpilist: ", kpiList)

    const [idCounter, setIdCounter] = useState(2);
    const datePresets = getDatePresets();

    const [queries, setQueries] = useState([
        {
            id: 1,
            results: [],
            isOpen: true,
            isLoading: false,
            isUnavailable: false,
            leadSource: [],
            dateRange: { gte: datePresets['All Time'].startDate, lte: datePresets['All Time'].endDate },
            department: ["Lead Manager"],
            teamMember: []
        },
    ]);

    const handleSetLoading = (queryId, isLoading) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId ? { ...query, isLoading: isLoading } : query
            )
        );
    };

    const handleSetUnavailable = (queryId, isUnavailable) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId ? { ...query, isUnavailable: isUnavailable } : query
            )
        );
    };

    const handleFetchedKpiData = (queryId, data) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId ? { ...query, results: data } : query
            )
        );
    };

    const handleDateRangeChange = (startDate, endDate, queryId) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId
                    ? {
                        ...query,
                        dateRange: {
                            gte: startDate,
                            lte: endDate,
                        },
                    }
                    : query
            )
        );
    };

    const handleLeadSourceChange = (values, queryId) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId
                    ? {
                        ...query,
                        leadSource: values,
                    }
                    : query
            )
        );
    };

    const handleTeamChange = (department, teamMembers, queryId) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId
                    ? {
                        ...query,
                        department: department,
                        teamMember: teamMembers,
                    }
                    : query
            )
        );
    };

    const handleToggleQuery = (queryId) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId
                    ? {
                        ...query,
                        isOpen: !query.isOpen,
                    }
                    : query
            )
        );
    };

    const handleRemoveQuery = (queryId) => {
        setQueries((prevQueries) => prevQueries.filter((query) => query.id !== queryId));
    };

    const handleAddQuery = () => {
        const newQuery = {
            id: idCounter,
            results: [],
            isOpen: true,
            isLoading: false,
            isUnavailable: false,
            leadSource: [],
            dateRange: { gte: datePresets['All Time'].startDate, lte: datePresets['All Time'].endDate },
            department: [],
            teamMember: []
        };
        setIdCounter(idCounter + 1);
        setQueries([...queries, newQuery]);
    };

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