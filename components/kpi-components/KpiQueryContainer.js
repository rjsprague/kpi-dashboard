import { useState, useEffect } from 'react';
import KpiQuery from './KpiQuery';
import AddQueryButton from './AddQueryButton';
import { getDatePresets } from "../../lib/date-utils";
import fetchLeadSources from '../../lib/fetchLeadSources';
import { VIEW_KPIS } from './constants';

const KpiQueryContainer = ({ view, kpiList }) => {

    //console.log("KpiViews view: ", view)
    //console.log("kpilist: ", kpiList)

    const [idCounter, setIdCounter] = useState(2);
    const [leadSources, setLeadSources] = useState([]);
    const datePresets = getDatePresets();

    useEffect(() => {
        const fetchSources = async () => {
            const sources = await fetchLeadSources();
            setLeadSources(sources);
        };
        fetchSources();
    }, []);

    const [queries, setQueries] = useState([
        {
            id: 1,
            results: [],
            isOpen: true,
            isLoading: false,
            isUnavailable: false,
            leadSource: [],
            dateRange: { gte: datePresets['All Time'].startDate, lte: datePresets['All Time'].endDate },
            teamMember: [],
            department: [],
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

    const handleTeamMemberChange = (teamMember, queryId) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId
                    ? {
                        ...query,
                        teamMember: teamMember,
                    }
                    : query
            )
        );
    };

    const handleDepartmentChange = (department, queryId) => {
        setQueries((prevQueries) =>
            prevQueries.map((query) =>
                query.id === queryId
                    ? {
                        ...query,
                        department: department,
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
        };
        setIdCounter(idCounter + 1);
        setQueries([...queries, newQuery]);
    };

    //console.log("kpi list", kpiList)

    return (
        <div>
            {queries.map((query) => (
                <KpiQuery
                    key={query.id}
                    view={view}
                    VIEW_KPIS={VIEW_KPIS}
                    query={query}
                    kpiList={kpiList}
                    onDateRangeChange={handleDateRangeChange}
                    onLeadSourceChange={handleLeadSourceChange}
                    onToggleQuery={handleToggleQuery}
                    onRemoveQuery={handleRemoveQuery}
                    onFetchedKpiData={handleFetchedKpiData}
                    onSetLoading={handleSetLoading}
                    onTeamMemberChange={handleTeamMemberChange}
                    onDepartmentChange={handleDepartmentChange}
                />
            ))}
            <AddQueryButton handleAddQuery={handleAddQuery} />
        </div>
    );
};

export default KpiQueryContainer;