const generateFilters = (startDate, endDate, leadSources, kpiView, leadSourcesFieldName, dateFieldName, extraFilters) => {
    const filters = [];
    // console.log(leadSources)
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

    if (extraFilters) {
        filters.push(...extraFilters);
    }

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
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source", "Date")
        },
        leads: {
            name: "Leads",
            url: "/api/seller-leads",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source Item", "Lead Created On")
        },
        leadConnections: {
            name: "Lead Connections",
            url: "/api/seller-leads",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source Item", "First lead connection")
        },
        triageCalls: {
            name: "Triage Calls",
            url: "/api/seller-lead-sheets",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source", "SLS Created On")
        },
        qualifiedTriageCalls: {
            name: "Qualified Triage Calls",
            url: "/api/seller-lead-sheets",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source", "SLS Created On", [
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
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source", "SLS Created On", [
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
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source", "Timestamp", [
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
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source", "AS Created On")
        },
        contracts: {
            name: "Contracts",
            url: "/api/contracts",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source", "*Date Ratified")
        },
        acquisitions: {
            name: "Acquisitions",
            url: "/api/acquisitions",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source", "Date Acquired")
        },
        pendingDeals: {
            name: "Pending Deals",
            url: "/api/acquisitions",
            filters: generateFilters(null, null, leadSources, kpiView, "Lead Source", "Date Acquired")
        },
        deals: {
            name: "Deals",
            url: "/api/deals",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source", "Closing (Sell)")
        },
        profit: {
            name: "Profit",
            url: "/api/deals",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source", "Closing (Sell)")
        },
        lmStlMedian: {
            name: "LM STL Median",
            url: "/api/acquisition-kpis",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source", "Timestamp", [
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
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source", "Timestamp", [
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
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source", "Timestamp", [
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
            filters: generateFilters(startDate, endDate, null, kpiView, "Null", "Timestamp", [
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
        contractedProfit: {
            name: "Contracted Profit",
            url: "/api/contracts",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source", "*Date Ratified")
        },
        projectedProfit: {
            name: "Projected Profit",
            url: "/api/acquisitions",
            filters: generateFilters(null, null, leadSources, kpiView, "Lead Source", "Date Acquired")
        },
        closersAdSpend: {
            name: "Closers Ad Spend",
            url: "/api/closers/acquisitions/marketing-expenses",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source", "Date")
        },
        closersLeadsCreated: {
            name: "Closers Leads Created",
            url: "/api/closers/acquisitions/reia-leads",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source Item", "Lead Created On")
        },
        closersLeadsSetPrequalified: {
            name: "Closers Leads Set Prequalified",
            url: "/api/closers/acquisitions/setter-calls",
            filters: generateFilters(startDate, endDate, null, kpiView, null, "created_on", [
                {
                    "type": "category",
                    "fieldName": "Qualification",
                    "values": ["Qualified"]
                },
                {
                    "type": "app",
                    "fieldName": "Setter Responsible",
                    "values": setters
                }
            ])
        },
        closersBookings: {
            name: "Closers Bookings",
            url: "/api/closers/acquisitions/lead-events",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Related Lead Source Item", "Date", [
                {
                    "type": "category",
                    "fieldName": "Event",
                    "values": ["Discovery Call Scheduled"]
                },
                {
                    "type": "category",
                    "fieldName": "lead_event #",
                    "values": ["1.0000"]
                },
                {
                    "type": "app",
                    "fieldName": "Closer Responsible",
                    "values": closers
                }
            ])
        },
        closersQualifiedBookings: {
            name: "Closers Qualified Bookings",
            url: "/api/closers/acquisitions/reia-leads",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source Item", "Lead Created On", [
                {
                    "type": "category",
                    "fieldName": "Pre-Qualification Status",
                    "values": ["Qualified"]
                },
                {
                    "type": "app",
                    "fieldName": "Lead Assignee",
                    "values": teamMembers
                }
            ])
        },
        closersAppointments: {
            name: "Closers Appointments",
            url: "/api/closers/acquisitions/lead-events",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Related Lead Source Item", "Date", [
                {
                    "type": "category",
                    "fieldName": "Event",
                    "values": ["Discovery Call Attended", "Discovery Call NO-SHOW"]
                },
                {
                    "type": "app",
                    "fieldName": "Closer Responsible",
                    "values": closers
                },
                {
                    "type": "app",
                    "fieldName": "Setter Responsible",
                    "values": setters
                }
            ])
        },
        closersTotalAttended: {
            name: "Closers Total Attended",
            url: "/api/closers/acquisitions/lead-events",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Related Lead Source Item", "Date", [
                {
                    "type": "category",
                    "fieldName": "Event",
                    "values": ["Discovery Call Attended"]
                },
                {
                    "type": "app",
                    "fieldName": "Closer Responsible",
                    "values": closers
                },
                {
                    "type": "app",
                    "fieldName": "Setter Responsible",
                    "values": setters
                }
            ])
        },
        closersUniqueAttended: {
            name: "Closers Unique Attended",
            url: "/api/closers/acquisitions/lead-events",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Related Lead Source Item", "Date", [
                {
                    "type": "category",
                    "fieldName": "Event",
                    "values": ["Discovery Call Attended"]
                },
                {
                    "type": "category",
                    "fieldName": "lead_event #",
                    "values": ["1.0000"]
                },
                {
                    "type": "app",
                    "fieldName": "Closer Responsible",
                    "values": closers
                },
                {
                    "type": "app",
                    "fieldName": "Setter Responsible",
                    "values": setters
                }
            ])
        },
        closersDcOffers: {
            name: "Closers DC Offers",
            url: "/api/closers/acquisitions/discovery-calls",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Related Lead Source Item", "created_on", [
                {
                    "type": "category",
                    "fieldName": "Status of the Call",
                    "values": ["Closed", "Interested", "Lost"]
                },
                {
                    "type": "app",
                    "fieldName": "Closer Responsible",
                    "values": closers
                }
            ])
        },
        closersDcClosed: {
            name: "Closers DC Closed",
            url: "/api/closers/acquisitions/discovery-calls",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Related Lead Source Item", "created_on", [
                {
                    "type": "category",
                    "fieldName": "Status of the Call",
                    "values": ["Closed"]
                },
                {
                    "type": "app",
                    "fieldName": "Closer Responsible",
                    "values": closers
                },
                {
                    "type": "app",
                    "fieldName": "Setter Responsible",
                    "values": setters
                }
            ])
        },
        closersPayments: {
            name: "Closers Payments",
            url: "/api/closers/management/payment-plans",
            filters: generateFilters(startDate, endDate, null, kpiView, null, "Date", [
                {
                    "type": "category",
                    "fieldName": "Plan #",
                    "values": ["1.0000"]
                },
                {
                    "type": "category",
                    "fieldName": "Status",
                    "values": ["Active", "Inactive"]
                },
                {
                    "type": "app",
                    "fieldName": "Closer Responsible",
                    "values": closers
                }
            ])
        },
        setterStlMedian: {
            name: "Setter STL Median",
            url: "/api/closers/acquisitions/reia-leads",
            filters: generateFilters(startDate, endDate, leadSources, kpiView, "Lead Source Item", "Lead Created On")
        },
        closerCommission: {
            name: "Closer Commission",
            url: "/api/closers/management/team-events",
            filters: generateFilters(startDate, endDate, null, kpiView, null, "Date Completed", [
                {
                    "type": "app",
                    "fieldName": "Team Member",
                    "values": teamMembers
                },
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
            filters: generateFilters(startDate, endDate, null, kpiView, null, "Date Completed", [
                {
                    "type": "app",
                    "fieldName": "Team Member",
                    "values": teamMembers
                },
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
            filters: generateFilters(null, null, null, kpiView, null, null, [
                {
                    "type": "app",
                    "fieldName": "Closer Responsible",
                    "values": teamMembers
                },
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