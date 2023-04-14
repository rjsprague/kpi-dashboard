import { useState, useEffect } from 'react';
import KpiQuery from './KpiQuery';
import AddQueryButton from './AddQueryButton';
import { getDatePresets } from "../../lib/date-utils";
import fetchLeadSources from '../../lib/fetchLeadSources';

const VIEW_KPIS = {
    Acquisitions: [
      "Cost Per Lead",
      "Lead Connections",
      "Triage Calls",
      "Triage Qualifications",
      "Triage Approval",
      "Deal Analysis",
      "Perfect Presentations",
      "Contracts",
      "Acquisitions",
      "Deals",
      "Profit",
    ],
    Team: ["Speed to Lead", "Big Checks"],
    Financials: [
      "Ad Spend",
      "Cost Per Lead",
      "Cost Per Contract",
      "Cost Per Acquisition",
      "Cost Per Deal",
      "Actualized Profit",
      "Projected Profit",
      "Total Profit",
      "ROAS Actualized",
      "ROAS Projected",
      "ROAS Total",
      "ROAS Total APR",
    ],
  };

const KpiViews = ({ view }) => {
    const [idCounter, setIdCounter] = useState(2);
    const [leadSources, setLeadSources] = useState([]);
    const datePresets = getDatePresets(); 
    const [kpiList, setKpiList] = useState(VIEW_KPIS[view]);


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
        },
    ]);

    const handleSetLoading = (queryId, isLoading) => {
        setQueries((prevQueries) =>
          prevQueries.map((query) =>
            query.id === queryId ? { ...query, isLoading: isLoading } : query
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

    return (
        <div>
            {queries.map((query) => (
                <KpiQuery
                    key={query.id}
                    view={view}
                    query={query}
                    kpiList={VIEW_KPIS[view]}
                    onKpiListChange={setKpiList}
                    onDateRangeChange={handleDateRangeChange}
                    onLeadSourceChange={handleLeadSourceChange}
                    onToggleQuery={handleToggleQuery}
                    onRemoveQuery={handleRemoveQuery}
                    onFetchedKpiData={handleFetchedKpiData}
                    onSetLoading={handleSetLoading}
                />
            ))}
            <AddQueryButton handleAddQuery={handleAddQuery} />
        </div>
    );
};

export default KpiViews;