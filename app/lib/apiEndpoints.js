const generateFilters = (startDate, endDate, leadSource, kpiView, leadSourceFieldName, dateFieldName, extraFilters) => {
    const filters = [];

    if (startDate && endDate) {
        filters.push({
            "type": 'date',
            "fieldName": dateFieldName,
            "gte": startDate,
            "lte": endDate,
        });
    }

    if (leadSource && leadSource.length > 0 && kpiView !== "Team") {
        filters.push({
            "type": "app",
            "fieldName": leadSourceFieldName,
            "values": leadSource,
        });
    }

    if (extraFilters) {
        filters.push(...extraFilters);
    }

    return filters;
};
// Define the endpoints and filters for each KPI
const apiEndpoints = (startDate, endDate, leadSource, kpiView, teamMembers) => {
    return {
        marketingExpenses: {
            name: "Marketing Expenses",
            url: "/api/marketing-expenses",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Lead Source", "Date")
        },
        leads: {
            name: "Leads",
            url: "/api/seller-leads",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Lead Source Item", "Lead Created On")
        },
        leadConnections: {
            name: "Lead Connections",
            url: "/api/seller-leads",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Lead Source Item", "First lead connection")
        },
        triageCalls: {
            name: "Triage Calls",
            url: "/api/seller-lead-sheets",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Lead Source", "SLS Created On")
        },
        qualifiedTriageCalls: {
            name: "Qualified Triage Calls",
            url: "/api/seller-lead-sheets",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Lead Source", "SLS Created On", [
                {
                    "type": "category",
                    "fieldName": "Q or UNQ",
                    "values": ["Q"]
                }
            ]),
        },
        triageApproval: {
            name: "Triage Approval",
            url: "/api/seller-lead-sheets",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Lead Source", "SLS Created On", [
                {
                    "type": "category",
                    "fieldName": "Q or UNQ",
                    "values": ["Q"]
                },
                {
                    "type": "category",
                    "fieldName": "Qualified?",
                    "values": ["Approve"]
                }
            ]),
        },
        dealAnalysis: {
            name: "Deal Analysis",
            url: "/api/acquisition-kpis",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Lead Source", "Timestamp", [
                {
                    "type": "category",
                    "fieldName": "Type",
                    "values": ["DA Speed to Lead"]
                }
            ])
        },
        perfectPresentations: {
            name: "Perfect Presentations",
            url: "/api/acquisition-scripts",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Lead Source", "AS Created On")
        },
        contracts: {
            name: "Contracts",
            url: "/api/contracts",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Lead Source", "*Date Ratified")
        },
        acquisitions: {
            name: "Acquisitions",
            url: "/api/acquisitions",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Lead Source", "Date Acquired")
        },
        // pendingDeals: {
        //     name: "Pending Deals",
        //     url: "/api/acquisitions",
        //     filters: generateFilters(startDate, endDate, leadSource, kpiView, "Lead Source", "Date Acquired")
        // },
        deals: {
            name: "Deals",
            url: "/api/deals",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Lead Source", "Closing (Sell)")
        },
        profit: {
            name: "Profit",
            url: "/api/deals",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Lead Source", "Closing (Sell)")
        },
        lmStlMedian: {
            name: "LM STL Median",
            url: "/api/acquisition-kpis",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Null", "Timestamp", [
                {
                    "type": "category",
                    "fieldName": "Type",
                    "values": ["LM Speed to Lead"]
                },
                {
                    "type": "app",
                    "fieldName": "Team Member Responsible",
                    "values": teamMembers
                }
            ])
        },
        amStlMedian: {
            name: "AM STL Median",
            url: "/api/acquisition-kpis",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Null", "Timestamp", [
                {
                    "type": "category",
                    "fieldName": "Type",
                    "values": ["AM Speed to Lead"]
                },
                {
                    "type": "app",
                    "fieldName": "Team Member Responsible",
                    "values": teamMembers
                }
            ])
        },
        daStlMedian: {
            name: "DA STL Median",
            url: "/api/acquisition-kpis",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Null", "Timestamp", [
                {
                    "type": "category",
                    "fieldName": "Type",
                    "values": ["DA Speed to Lead"]
                },
                {
                    "type": "app",
                    "fieldName": "Team Member Responsible",
                    "values": teamMembers
                }
            ])
        },
        bigChecks: {
            name: "BiG Checks",
            url: "/api/acquisition-kpis",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Null", "Timestamp", [
                {
                    "type": "category",
                    "fieldName": "Type",
                    "values": ["BiG"]
                },
                {
                    "type": "app",
                    "fieldName": "Team Member Responsible",
                    "values": teamMembers
                }
            ])
        },
        projectedProfit: {
            name: "Projected Profit",
            url: "/api/acquisitions",
            filters: generateFilters(startDate, endDate, leadSource, kpiView, "Lead Source", "Date Acquired")
        },
    };
};

export default apiEndpoints;