const KPI_DEFINITIONS = {
    "Ad Spend": {
        name: "Ad Spend",
        dataKeys: ["marketingExpenses"],
        formula: (apiData) => {
            const { totalMarketingExpenses } = apiData;
            return totalMarketingExpenses != null && totalMarketingExpenses != NaN ? Math.round(totalMarketingExpenses) : 0;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Ad Spend: $"],
        kpiType: "",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Ad Spend",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Cost Per Lead": {
        name: "Cost Per Lead",
        dataKeys: ["marketingExpenses", "leads"],
        formula: (apiData) => {
            const { totalMarketingExpenses, leads } = apiData;
            return leads !== 0 ? Math.round(totalMarketingExpenses / leads) : 0;
        },
        redFlag: 60,
        target: 35,
        dataLabels: ["Marketing: $", "Leads: "],
        kpiType: "meter",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Cost Per Lead",
            },
            {
                id: 1,
                desc: "Consider increasing your metro count. The more people you market to, the cheaper your leads will get. Disregard this if you are only marketing locally.",
                linkName: "Learn More: Choosing Your Metros",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/43155989-starting-your-marketing-choosing-your-metros"
            },
        ],
    },
    "Lead Connections": {
        name: "Lead Connections",
        dataKeys: ["leads", "leadConnections"],
        formula: (apiData) => {
            const { leads, leadConnections } = apiData;
            return leads !== 0 ? Math.round((leadConnections / leads) * 100) : 0;
        },
        redFlag: 70,
        target: 80,
        dataLabels: ["Leads: ", "Connections: "],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Lead Connections",
            },
            {
                id: 1,
                desc: "1 of 2 things is wrong: Leads are giving you wrong numbers, or your phone number may be marked as 'Spam Risk'. Get a new phone number, or go through A2P/10DLC/Stirred & Shaken and register your numbers in a Campaign through Smrtphone.",
                linkName: "Learn More: smrtPhone Trust Center",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/multimedia/41192521-smrtphone-trust-center"
            },
        ],
    },
    "Triage Calls": {
        name: "Triage Calls",
        dataKeys: ["leadConnections", "triageCalls"],
        formula: (apiData) => {
            const { leadConnections, triageCalls } = apiData;
            return leadConnections !== 0 ? Math.round((triageCalls / leadConnections) * 100) : 0;
        },
        redFlag: 60,
        target: 75,
        dataLabels: ["Connections: ", "Triages: "],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Triage Calls",
            },
            {
                id: 1,
                desc: "Speed to Lead",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235788-speed-to-lead-the-most-important-metric"
            },
            {
                id: 2,
                desc: "Big Checks",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235790-the-big-check-philosophy"
            },
            {
                id: 3,
                desc: "Crazy Ex-Girlfriend",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235793-best-practices-calling-using-the-crazy-ex-girlfriend-method"
            },
            {
                id: 4,
                desc: "Not submitting SLS",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/42977333-how-to-fill-out-the-triage-call-formerly-the-sls"
            },
        ],
    },
    "Qualified Triage Calls": {
        name: "Qualified Triage Calls",
        dataKeys: ["triageCalls", "qualifiedTriageCalls"],
        formula: (apiData) => {
            const { triageCalls, qualifiedTriageCalls } = apiData;
            return triageCalls !== 0 ? Math.round((qualifiedTriageCalls / triageCalls) * 100) : 0;
        },
        redFlag: 50,
        target: 70,
        dataLabels: ["Triages: ", "Qualified: "],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Qualified Triage Calls",
            },
            {
                id: 1,
                desc: "How to Optimize your Ad Spend",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235797-how-to-optimize-your-ad-spend-this-will-change-your-life"
            },
            {
                id: 2,
                desc: "Weekly Marketing Manager Reports",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/multimedia/40235798-example-weekly-marketing-report"
            },
            {
                id: 3,
                desc: "Mislabeling 'Qualified' leads",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/multimedia/40235775-lead-statuses-mind-map"
            }
        ],
    },
    "Triage Approval": {
        name: "Triage Approval",
        dataKeys: ["qualifiedTriageCalls", "triageApproval"],
        formula: (apiData) => {
            const { qualifiedTriageCalls, triageApproval } = apiData;
            return qualifiedTriageCalls !== 0 ? Math.round((triageApproval / qualifiedTriageCalls) * 100) : 0;
        },
        redFlag: 50,
        target: 70,
        dataLabels: ["Qualified: ", "Approved: "],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Define Triage Approvals",
            },
            {
                id: 1,
                desc: "Results of a Triage Call",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/multimedia/42977342-triage-call-results"
            }
        ],
    },
    "Deal Analysis": {
        name: "Deal Analysis",
        dataKeys: ["triageApproval", "dealAnalysis"],
        formula: (apiData) => {
            const { triageApproval, dealAnalysis } = apiData;
            return triageApproval !== 0 ? Math.round((dealAnalysis / triageApproval) * 100) : 0;
        },
        redFlag: 65,
        target: 80,
        dataLabels: ["Approved: ", "Analyzed: "],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Deal Analysis",
            },
            {
                id: 1,
                desc: "Deal Analyzer Template Overview",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/42977803-deal-analyzer-template-overview"
            },
            {
                id: 2,
                desc: "Deal Analyzer Masterclass #1",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/42977824-deal-analyzer-masterclass"
            },
            {
                id: 3,
                desc: "Deal Analyzer Masterclass #2",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/42977830-deal-analyzer-masterclass-2"
            }
        ],
    },
    "Perfect Presentations": {
        name: "Perfect Presentations",
        dataKeys: ["dealAnalysis", "perfectPresentations"],
        formula: (apiData) => {
            const { dealAnalysis, perfectPresentations } = apiData;
            return dealAnalysis !== 0 ? Math.round((perfectPresentations / dealAnalysis) * 100) : 0;
        },
        redFlag: 65,
        target: 80,
        dataLabels: ["Analyzed: ", "Presentations: "],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Perfect Presentations",
            },
            {
                id: 1,
                desc: "Speed to Lead",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235788-speed-to-lead-the-most-important-metric"
            },
            {
                id: 2,
                desc: "Big Checks",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235790-the-big-check-philosophy"
            },
            {
                id: 3,
                desc: "Crazy Ex-Girlfriend",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235793-best-practices-calling-using-the-crazy-ex-girlfriend-method"
            },
            {
                id: 4,
                desc: "Not submitting Perfect Presentation",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/42977390-the-perfect-presentation"
            },
        ],
    },
    "Contracts": {
        name: "Contracts",
        dataKeys: ["perfectPresentations", "contracts"],
        formula: (apiData) => {
            const { perfectPresentations, contracts } = apiData;
            return perfectPresentations !== 0 ? Math.round((contracts / perfectPresentations) * 100) : 0;
        },
        redFlag: 10,
        target: 25,
        dataLabels: ["Presentations: ", "Contracts: "],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Contracts",
            },
            {
                id: 1,
                desc: "Negotiation/Sales Frame",
                linkName: "Learn More",
                link: "#"
            },
            {
                id: 2,
                desc: "Deal Structure",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/42977824-deal-analyzer-masterclass"
            },
            {
                id: 3,
                desc: "Stay on the phone for PSA Signing",
                linkName: "Learn More",
                link: "https://knowledge.reiautomated.io/courses/take/scaling/lessons/40235800-how-to-use-the-automated-purchase-and-sale-agreement"
            }
        ],
    },
    "Acquisitions": {
        name: "Acquisitions",
        dataKeys: ["contracts", "acquisitions"],
        formula: (apiData) => {
            const { contracts, acquisitions } = apiData;
            return contracts !== 0 ? Math.round((acquisitions / contracts) * 100) : 0;
        },
        redFlag: 50,
        target: 75,
        dataLabels: ["Contracts: ", "Acquisitions: "],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Acquisitions",
            },
            {
                id: 1,
                desc: "Renegotiation after inspections.",
                linkName: "",
                link: ""
            },
            {
                id: 2,
                desc: "Regular Seller Update, Professionalism, Preparedness.",
                linkName: "",
                link: ""
            },
            {
                id: 3,
                desc: "Give the seller confidence in your ability to solve their problem.",
                linkName: "",
                link: ""
            }
        ],
    },
    "Pending Deals": {
        name: "Pending Deals",
        dataKeys: ["acquisitions", "pendingDeals"],
        formula: (apiData) => {
            const { pendingDeals } = apiData;
            // reduce pendingDeals to only objects that do not have a "*Deal" property
            let pendingDealsReduced = pendingDeals.reduce((acc, curr) => {
                if (!curr.hasOwnProperty("*Deal")) {
                    acc.push(curr)
                }
                return acc
            }, [])
            return pendingDealsReduced.length;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Acquisitions: ", "Pending Deals: "],
        kpiType: "",
        unit: " Pending Deals",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Pending Deals",
            },
            {
                id: 1,
                desc: "Renegotiation after inspections.",
                linkName: "",
                link: ""
            },
            {
                id: 2,
                desc: "Regular Seller Update, Professionalism, Preparedness.",
                linkName: "",
                link: ""
            },
            {
                id: 3,
                desc: "Give the seller confidence in your ability to solve their problem.",
                linkName: "",
                link: ""
            }
        ],
    },
    "Deals": {
        name: "Deals",
        dataKeys: ["pendingDeals", "deals"],
        formula: (apiData) => {
            const { deals } = apiData;
            return deals ? deals : 0;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Pending Deals: ", "Deals: "],
        kpiType: "",
        unit: " Deals",
        kpiFactors: [
            {
                id: 0,
                title: "",
            },
        ],
    },
    "Profit": {
        name: "Profit",
        dataKeys: ["deals", "profit"],
        formula: (apiData) => {
            const { profit } = apiData;
            return profit && Array.isArray(profit) && profit.length > 0 ? profit.reduce((acc, curr) => {
                if ("Net Profit Center" in curr) {
                    return acc + parseInt(curr["Net Profit Center"], 10);
                } else {
                    return acc;
                }
            }, 0) : 0;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Deals: ", "Profit: $"],
        kpiType: "",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "",
            },
        ],
    },
    "LM STL Median": {
        name: "LM STL Median",
        dataKeys: ['lmStlMedian'],
        formula: (apiData) => {
            // Calculate the median Speed to Lead
            const { lmStlMedian } = apiData;
            let stlArray = (lmStlMedian && lmStlMedian.length > 0) ? lmStlMedian.reduce((acc, curr) => {
                if ('Speed to Lead Adjusted' in curr) {
                    acc.push(curr['Speed to Lead Adjusted']);
                }
                return acc;
            }, []) : [];
            stlArray.sort((a, b) => a - b);
            let lmStlMedianSorted = stlArray.length % 2 === 0 ? (stlArray[stlArray.length / 2 - 1] + stlArray[stlArray.length / 2]) / 2 : stlArray[(stlArray.length - 1) / 2];
            return Number((lmStlMedianSorted / 60).toFixed(2));
        },
        redFlag: 15,
        target: 5,
        dataLabels: [" minutes", "NA: "],
        kpiType: "STL",
        unit: " mins",
        kpiFactors: [
            {
                id: 0,
                title: "TBD",
            },
        ],
    },
    "AM STL Median": {
        name: "AM STL Median",
        dataKeys: ['amStlMedian'],
        formula: (apiData) => {
            const { amStlMedian } = apiData;
            let stlArray = (amStlMedian && amStlMedian.length > 0) ? amStlMedian.reduce((acc, curr) => {
                if ('Speed to Lead Adjusted' in curr) {
                    acc.push(curr['Speed to Lead Adjusted']);
                }
                return acc;
            }, []) : [];
            stlArray.sort((a, b) => a - b);
            let amStlMedianSorted = stlArray.length % 2 === 0 ? (stlArray[stlArray.length / 2 - 1] + stlArray[stlArray.length / 2]) / 2 : stlArray[(stlArray.length - 1) / 2];
            return Number((amStlMedianSorted / 3600).toFixed(2));
        },
        redFlag: 8,
        target: 3,
        dataLabels: [" hours", "NA: "],
        kpiType: "STL",
        unit: " hrs",
        kpiFactors: [
            {
                id: 0,
                title: "TBD",
            },
        ],
    },
    "DA STL Median": {
        name: "DA STL Median",
        dataKeys: ['daStlMedian'],
        formula: (apiData) => {
            const { daStlMedian } = apiData;
            let stlArray = (daStlMedian && daStlMedian.length > 0) ? daStlMedian.reduce((acc, curr) => {
                if ('Speed to Lead Adjusted' in curr) {
                    acc.push(curr['Speed to Lead Adjusted']);
                }
                return acc;
            }, []) : [];
            stlArray.sort((a, b) => a - b);
            let daStlMedianSorted = stlArray.length % 2 === 0 ? (stlArray[stlArray.length / 2 - 1] + stlArray[stlArray.length / 2]) / 2 : stlArray[(stlArray.length - 1) / 2];
            return Number((daStlMedianSorted / 3600).toFixed(2));
        },
        redFlag: 4,
        target: 1,
        dataLabels: [" hours", "NA: "],
        kpiType: "STL",
        unit: " hrs",
        kpiFactors: [
            {
                id: 0,
                title: "TBD",
            },
        ],
    },
    "BiG Checks": {
        name: "BiG Checks",
        dataKeys: ['bigChecks'],
        createFormula: (startDate, endDate) => (apiData) => {
            const { bigChecks } = apiData;
            //console.log("Big Checks: ", bigChecks)
            //console.log("Start Date: ", startDate)
            //console.log("End Date: ", endDate)
            if (!bigChecks || !startDate || !endDate) {
                return 0;
            }

            const start = new Date(startDate);
            const end = new Date(endDate);
            const oneDay = 1000 * 60 * 60 * 24;
            const diffDays = Math.abs((end - start) / oneDay);
            const numWeeks = diffDays / 7;

            return Number((bigChecks.length / numWeeks).toFixed(2));
        },
        redFlag: 4,
        target: 5,
        dataLabels: [" checks per week", "NA: "],
        kpiType: "BigChecks",
        unit: " checks",
        kpiFactors: [
            {
                id: 0,
                title: "TBD",
            },
        ],
    },
    "Cost Per Contract": {
        name: "Cost Per Contract",
        dataKeys: ["marketingExpenses", "contracts"],
        formula: (apiData) => {
            const { totalMarketingExpenses, contracts } = apiData;
            return totalMarketingExpenses != null && totalMarketingExpenses != NaN && contracts !== 0 ? Math.round(totalMarketingExpenses / contracts) : 0;
        },
        redFlag: 1200,
        target: 400,
        dataLabels: ["Ad Spend: $", "Contracts: "],
        kpiType: "meter",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Cost Per Contract",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Cost Per Acquisition": {
        name: "Cost Per Acquisition",
        dataKeys: ["marketingExpenses", "acquisitions"],
        formula: (apiData) => {
            const { totalMarketingExpenses, acquisitions } = apiData;
            return totalMarketingExpenses != null && totalMarketingExpenses != NaN && acquisitions !== 0 ? Math.round(totalMarketingExpenses / acquisitions) : 0;
        },
        redFlag: 1800,
        target: 600,
        dataLabels: ["Ad Spend: $", "Acquisitions: "],
        kpiType: "meter",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Cost Per Acquisition",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Cost Per Deal": {
        name: "Cost Per Deal",
        dataKeys: ["marketingExpenses", "deals"],
        formula: (apiData) => {
            const { totalMarketingExpenses, deals } = apiData;
            return totalMarketingExpenses != null && totalMarketingExpenses != NaN && deals !== 0 ? Math.round(totalMarketingExpenses / deals) : 0;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Ad Spend: $", "Deals: "],
        kpiType: "",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Cost Per Deal",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Actualized Profit": {
        name: "Actualized Profit",
        dataKeys: ["profit"],
        formula: (apiData) => {
            const { actualizedProfit } = apiData;
            return actualizedProfit;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Actualized Profit: $"],
        kpiType: "",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Actualized Profit",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Projected Profit": {
        name: "Projected Profit",
        dataKeys: ["projectedProfit"],
        formula: (apiData) => {
            const { projectedProfit } = apiData;
            console.log("Projected Profit: ", projectedProfit)
            return projectedProfit;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Projected Profit: $"],
        kpiType: "",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Projected Profit",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Total Profit": {
        name: "Total Profit",
        dataKeys: ["profit", "projectedProfit"],
        formula: (apiData) => {
            const { projectedProfit, actualizedProfit } = apiData;
            return projectedProfit + actualizedProfit;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Actualized Profit: $", "Projected Profit: $"],
        kpiType: "",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Total Profit",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "ROAS Actualized": {
        name: "ROAS Actualized",
        dataKeys: ["marketingExpenses", "profit"],
        formula: (apiData) => {
            const { totalMarketingExpenses, actualizedProfit } = apiData;
            return actualizedProfit / totalMarketingExpenses * 100;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Ad Spend: $", "Actualized Profit: $"],
        kpiType: "",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize ROAS Actualized",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "ROAS Projected": {
        name: "ROAS Projected",
        dataKeys: ["marketingExpenses", "projectedProfit"],
        formula: (apiData) => {
            const { totalMarketingExpenses, projectedProfit } = apiData;
            return projectedProfit / totalMarketingExpenses * 100;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Ad Spend: $", "Projected Profit: $"],
        kpiType: "",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize ROAS Projected",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "ROAS Total": {
        name: "ROAS Total",
        dataKeys: ["marketingExpenses", "totalProfit"],
        formula: (apiData) => {
            const { totalMarketingExpenses, totalProfit } = apiData;
            return totalMarketingExpenses !== 0 ? totalProfit / totalMarketingExpenses * 100 : 0;
        },
        redFlag: 600,
        target: 1200,
        dataLabels: ["Ad Spend: $", "Total Profit: $"],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize ROAS Total",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "ROAS Total APR": {
        name: "ROAS Total APR",
        dataKeys: ["marketingExpenses", "totalProfit"],
        createFormula: (startDate, endDate) => (apiData) => {
            const { totalMarketingExpenses, projectedProfit, actualizedProfit } = apiData;

            // Calculate the ROAS for the date range
            const roas = totalMarketingExpenses !== 0 ? (projectedProfit + actualizedProfit) / totalMarketingExpenses * 100 : 0;

            // Calculate the number of days in the date range
            const start = new Date(startDate);
            const end = new Date(endDate);
            const timeDifference = Math.abs(end.getTime() - start.getTime());
            const daysInRange = Math.ceil(timeDifference / (1000 * 3600 * 24));

            // Annualize the ROAS
            const annualizedRoas = roas * (365 / daysInRange);

            return annualizedRoas;
        },
        redFlag: 600,
        target: 1200,
        dataLabels: ["Ad Spend: $", "Total Profit: $"],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize ROAS Total APR",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
};

export default KPI_DEFINITIONS;