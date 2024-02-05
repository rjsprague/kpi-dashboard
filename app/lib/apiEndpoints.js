const generateFilters = (apiName, startDate, endDate, leadSources, kpiView, leadSourcesFieldName, dateFieldName, teamMembers=null, extraFilters=null, setters=null, closers=null) => {
    const filters = [];
    // console.log(apiName, startDate, endDate, leadSources, kpiView, leadSourcesFieldName, dateFieldName, teamMembers, extraFilters, setters, closers)
    // console.log(kpiView)

    if (startDate && endDate) {
        filters.push({
            "type": 'date',
            "fieldName": dateFieldName,
            "gte": startDate + " 00:00:00",
            "lte": endDate + " 23:59:59",
        });
    }

    if (leadSources && leadSources.length > 0) {
        filters.push({
            "type": "app",
            "fieldName": leadSourcesFieldName,
            "values": leadSources,
        });
    }


    if (setters && setters.length > 0 && kpiView === "Acquisitions") {
        filters.push({
            "type": "app",
            "fieldName": "Setter Responsible",
            "values": setters,
        });
    }

    if (closers && closers.length > 0 && kpiView === "Acquisitions") {
        filters.push({
            "type": "app",
            "fieldName": "Closer Responsible",
            "values": closers,
        });
    }

    if (teamMembers && teamMembers.length > 0) {
        filters.push({
            "type": "app",
            "fieldName": "Team Member Responsible",
            "values": teamMembers
        });
    }

    if (extraFilters) {
        filters.push(...extraFilters);
    }

    // console.log(filters)

    return filters;
};
// Define the endpoints and filters for each KPI
const apiEndpoints = (startDate, endDate, leadSources, kpiView, teamMembers, closers, setters) => {
    // console.log(leadSources)
    // console.log(teamMembers)
    // console.log(kpiView)
    // console.log(closers)
    // console.log(setters)

    return {
        marketingExpenses: {
            name: "Marketing Expenses",
            url: "/api/marketing-expenses",
            filters: generateFilters("Marketing Expenses", startDate, endDate, leadSources, kpiView, "Lead Source", "Date")
        },
        leads: {
            name: "Leads",
            url: "/api/seller-leads",
            filters: generateFilters("Leads", startDate, endDate, leadSources, kpiView, "Lead Source Item", "Lead Created On")
        },
        leadConnections: {
            name: "Lead Connections",
            url: "/api/seller-leads",
            filters: generateFilters("Lead Connections", startDate, endDate, leadSources, kpiView, "Lead Source Item", "First lead connection")
        },
        triageCalls: {
            name: "Triage Calls",
            url: "/api/seller-lead-sheets",
            filters: generateFilters("Triage Calls", startDate, endDate, leadSources, kpiView, "Lead Source", "SLS Created On")
        },
        qualifiedTriageCalls: {
            name: "Qualified Triage Calls",
            url: "/api/seller-lead-sheets",
            filters: generateFilters("Qualified Triage Calls", startDate, endDate, leadSources, kpiView, "Lead Source", "SLS Created On", null, [
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
            filters: generateFilters("Triage Approval", startDate, endDate, leadSources, kpiView, "Lead Source", "SLS Created On", null, [
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
            filters: generateFilters("Deal Analysis", startDate, endDate, leadSources, kpiView, "Lead Source", "Timestamp", null, [
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
            filters: generateFilters("Perfect Presentations", startDate, endDate, leadSources, kpiView, "Lead Source", "AS Created On")
        },
        contracts: {
            name: "Contracts",
            url: "/api/contracts",
            filters: generateFilters("Contracts", startDate, endDate, leadSources, kpiView, "Lead Source", "*Date Ratified")
        },
        acquisitions: {
            name: "Acquisitions",
            url: "/api/acquisitions",
            filters: generateFilters("Acquisitions", startDate, endDate, leadSources, kpiView, "Lead Source", "Date Acquired")
        },
        pendingDeals: {
            name: "Pending Deals",
            url: "/api/acquisitions",
            filters: generateFilters("Pending Deals", null, null, leadSources, kpiView, "Lead Source", "Date Acquired")
        },
        deals: {
            name: "Deals",
            url: "/api/deals",
            filters: generateFilters("Deals", startDate, endDate, leadSources, kpiView, "Lead Source", "Closing (Sell)")
        },
        profit: {
            name: "Profit",
            url: "/api/deals",
            filters: generateFilters("Profit", startDate, endDate, leadSources, kpiView, "Lead Source", "Closing (Sell)")
        },
        lmStlMedian: {
            name: "LM STL Median",
            url: "/api/acquisition-kpis",
            filters: generateFilters("LM STL Median", startDate, endDate, leadSources, kpiView, "Lead Source", "Timestamp", teamMembers, [
                {
                    "type": "category",
                    "fieldName": "Type",
                    "values": ["LM Speed to Lead"]
                }
            ])
        },
        amStlMedian: {
            name: "AM STL Median",
            url: "/api/acquisition-kpis",
            filters: generateFilters("AM STL Median", startDate, endDate, leadSources, kpiView, "Lead Source", "Timestamp", teamMembers, [
                {
                    "type": "category",
                    "fieldName": "Type",
                    "values": ["AM Speed to Lead"]
                }
            ])
        },
        daStlMedian: {
            name: "DA STL Median",
            url: "/api/acquisition-kpis",
            filters: generateFilters("DA STL Median", startDate, endDate, leadSources, kpiView, "Lead Source", "Timestamp", teamMembers, [
                {
                    "type": "category",
                    "fieldName": "Type",
                    "values": ["DA Speed to Lead"]
                }
            ])
        },
        bigChecks: {
            name: "BiG Checks",
            url: "/api/acquisition-kpis",
            filters: generateFilters("BiG Checks", startDate, endDate, null, kpiView, "Null", "Timestamp", teamMembers, [
                {
                    "type": "category",
                    "fieldName": "Type",
                    "values": ["BiG"]
                }
            ])
        },
        contractedProfit: {
            name: "Contracted Profit",
            url: "/api/contracts",
            filters: generateFilters("Contracted Profit", startDate, endDate, leadSources, kpiView, "Lead Source", "*Date Ratified")
        },
        projectedProfit: {
            name: "Projected Profit",
            url: "/api/acquisitions",
            filters: generateFilters("Projected Profit", null, null, leadSources, kpiView, "Lead Source", "Date Acquired")
        },
        closersAdSpend: {
            name: "Closers Ad Spend",
            url: "/api/closers/acquisitions/marketing-expenses",
            filters: generateFilters("Closers Ad Spend", startDate, endDate, leadSources, kpiView, "Lead Source", "Date")
        },
        closersLeadsCreated: {
            name: "Closers Leads Created",
            url: "/api/closers/acquisitions/reia-leads",
            filters: generateFilters("Closers Leads Created", startDate, endDate, leadSources, kpiView, "Lead Source Item", "Lead Created On")
        },
        closersLeadsSetPrequalified: {
            name: "Closers Leads Set Prequalified",
            url: "/api/closers/acquisitions/setter-calls",
            filters: generateFilters("Closers LSP", startDate, endDate, null, kpiView, null, "created_on", null, [
                {
                    "type": "category",
                    "fieldName": "Qualification",
                    "values": ["Qualified"]
                }
            ], setters, null)
        },
        closersBookings: {
            name: "Closers Bookings",
            url: "/api/closers/acquisitions/lead-events",
            filters: generateFilters("Closers Bookings", startDate, endDate, leadSources, kpiView, "Related Lead Source Item", "Date", null, [
                {
                    "type": "category",
                    "fieldName": "Event",
                    "values": ["Discovery Call Scheduled"]
                },
                {
                    "type": "category",
                    "fieldName": "lead_event #",
                    "values": ["1.0000"]
                }
            ], null, closers)
        },
        closersQualifiedBookings: {
            name: "Closers Qualified Bookings",
            url: "/api/closers/acquisitions/reia-leads",
            filters: generateFilters("Closers Qualified Bookings", startDate, endDate, leadSources, kpiView, "Lead Source Item", "Lead Created On", null, [
                {
                    "type": "category",
                    "fieldName": "Pre-Qualification Status",
                    "values": ["Qualified"]
                }
            ])
        },
        closersAppointments: {
            name: "Closers Appointments",
            url: "/api/closers/acquisitions/lead-events",
            filters: generateFilters("Closers Appointments", startDate, endDate, leadSources, kpiView, "Related Lead Source Item", "Date", null, [
                {
                    "type": "category",
                    "fieldName": "Event",
                    "values": ["Discovery Call Attended", "Discovery Call NO-SHOW"]
                }
            ], setters, closers)
        },
        closersTotalAttended: {
            name: "Closers Total Attended",
            url: "/api/closers/acquisitions/lead-events",
            filters: generateFilters("Closers Total Attended", startDate, endDate, leadSources, kpiView, "Related Lead Source Item", "Date", null, [
                {
                    "type": "category",
                    "fieldName": "Event",
                    "values": ["Discovery Call Attended"]
                }
            ], setters, closers)
        },
        closersUniqueAttended: {
            name: "Closers Unique Attended",
            url: "/api/closers/acquisitions/lead-events",
            filters: generateFilters("Closers Unique Attended", startDate, endDate, leadSources, kpiView, "Related Lead Source Item", "Date", null, [
                {
                    "type": "category",
                    "fieldName": "Event",
                    "values": ["Discovery Call Attended"]
                },
                {
                    "type": "category",
                    "fieldName": "lead_event #",
                    "values": ["1.0000"]
                }
            ], setters, closers)
        },
        // Finds all offers made by closers BEFORE the selected date range
        allPreviousDcOffers: {
            name: "All DC Offers",
            url: "/api/closers/acquisitions/discovery-calls",
            filters: generateFilters("Closers DC Offers", "2000-01-01", startDate, null, kpiView, "Related Lead Source Item", "created_on", null, [
                {
                    "type": "category",
                    "fieldName": "Status of the Call",
                    "values": ["Closed", "Interested", "Lost"]
                }
            ], null, null)
        },
        closersDcOffers: {
            name: "Closers DC Offers",
            url: "/api/closers/acquisitions/discovery-calls",
            filters: generateFilters("Closers DC Offers", startDate, endDate, leadSources, kpiView, "Related Lead Source Item", "created_on", null, [
                {
                    "type": "category",
                    "fieldName": "Status of the Call",
                    "values": ["Closed", "Interested", "Lost"]
                }
            ], setters, closers)
        },
        closersDcClosed: {
            name: "Closers DC Closed",
            url: "/api/closers/acquisitions/discovery-calls",
            filters: generateFilters("Closers DC Closed", startDate, endDate, leadSources, kpiView, "Related Lead Source Item", "created_on", null, [
                    {
                        "type": "category",
                        "fieldName": "Status of the Call",
                        "values": ["Closed"]
                    }
                ], setters, closers)
        },
        closersPayments: {
            name: "Closers Payments",
            url: "/api/closers/management/payment-plans",
            filters: generateFilters("Closers Payments", startDate, endDate, null, kpiView, null, "Date", null, [
                {
                    "type": "category",
                    "fieldName": "Plan #",
                    "values": ["1.0000"]
                },
                {
                    "type": "category",
                    "fieldName": "Status",
                    "values": ["Active", "Inactive"]
                }
            ], null, closers)
        },
        setterStlMedian: {
            name: "Setter STL Median",
            url: "/api/closers/acquisitions/reia-leads",
            filters: generateFilters("Setter STL Median", startDate, endDate, leadSources, kpiView, "Lead Source Item", "Lead Created On")
        },
        closerCommission: {
            name: "Closer Commission",
            url: "/api/closers/management/team-events",
            filters: generateFilters("Closer Commission", startDate, endDate, null, kpiView, null, "Date Completed", teamMembers, [
                {
                    "type": "category",
                    "fieldName": "Type",
                    "values": ["Closer Commission"]
                },
                {
                    "type": "category",
                    "fieldName": "Status",
                    "values": ["Pending", "Completed"]
                }
            ])
        },
        setterCommission: {
            name: "Setter Commission",
            url: "/api/closers/management/team-events",
            filters: generateFilters("Setter Commission", startDate, endDate, null, kpiView, null, "Date Completed", teamMembers, [
                {
                    "type": "category",
                    "fieldName": "Type",
                    "values": ["Setter Commission"]
                },
                {
                    "type": "category",
                    "fieldName": "Status",
                    "values": ["Pending", "Completed"]
                }
            ])
        },
        currentPassiveIncome: {
            name: "Current Passive Income",
            url: "/api/closers/management/payment-plans",
            filters: generateFilters("Current Passive Income", null, null, null, kpiView, null, null, teamMembers, [
                {
                    "type": "category",
                    "fieldName": "Plan #",
                    "values": ["1.0000"]
                },
                {
                    "type": "category",
                    "fieldName": "Status",
                    "values": ["Active"]
                }
            ])
        },
    };
};

export default apiEndpoints;