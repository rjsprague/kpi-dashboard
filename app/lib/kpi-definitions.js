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
            let pendingDealsReduced = pendingDeals && pendingDeals.length > 0 ? pendingDeals.reduce((acc, curr) => {
                if (!curr.hasOwnProperty("*Deal")) {
                    acc.push(curr)
                }
                return acc
            }, []) : [];
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
            const end = new Date(endDate + "T23:59:59");
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
    "Cost Per Approved SLS Q": {
        name: "Cost Per Approved SLS Q",
        dataKeys: ["marketingExpenses", "triageApproval"],
        formula: (apiData) => {
            const { totalMarketingExpenses, triageApproval } = apiData;
            return totalMarketingExpenses != null && totalMarketingExpenses != NaN && triageApproval !== 0 ? Math.round(totalMarketingExpenses / triageApproval) : 0;
        },
        redFlag: 150,
        target: 90,
        dataLabels: ["Ad Spend: $", "Approved SLS Q: "],
        kpiType: "meter",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Cost Per Approved SLS Q",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
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
            //console.log("Projected Profit: ", projectedProfit)
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
    "Contracted Profit": {
        name: "Contracted Profit",
        dataKeys: ["contractedProfit"],
        formula: (apiData) => {
            const { contractedProfit } = apiData;
            return contractedProfit;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Contracted Profit: $"],
        kpiType: "",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Contracted Profit",
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
        dataKeys: ["profit", "projectedProfit", "contractedProfit"],
        formula: (apiData) => {
            const { projectedProfit, actualizedProfit, contractedProfit } = apiData;
            return projectedProfit + actualizedProfit + contractedProfit;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Actualized Profit: $", "Projected Profit: $", "Contracted Profit: $"],
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
            const end = new Date(endDate + "T23:59:59");
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
    "Closers Ad Spend": {
        name: "Closers Ad Spend",
        dataKeys: ["totalClosersAdSpend"],
        formula: (apiData) => {
            const { totalClosersAdSpend } = apiData;
            return totalClosersAdSpend;
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
    // "Closers Leads Per Day": {
    //     name: "Closers Leads Per Day",
    //     dataKeys: ["closersLeadsCreated", "closersSalesCapacity"],
    //     createFormula: (startDate, endDate) => (apiData) => {
    //         const { closersLeadsCreated } = apiData;
    //         const start = new Date(startDate);
    //         const end = new Date(endDate + "T23:59:59.999Z");
    //         const timeDifference = Math.abs(end.getTime() - start.getTime());
    //         const daysInRange = Math.ceil(timeDifference / (1000 * 3600 * 24));
    //         return Math.ceil(closersLeadsCreated / daysInRange);
    //     },
    //     createRedFlag: (startDate, endDate) => (apiData) => {
    //         const { closersSalesCapacity } = apiData;
    //         const leadsPerSlotRedFlag = 3.46;

    //         const start = new Date(startDate);
    //         const end = new Date(endDate + "T23:59:59.999Z");
    //         const timeDifference = Math.abs(end.getTime() - start.getTime());
    //         const daysInRange = Math.ceil(timeDifference / (1000 * 3600 * 24));
    //         const leadsPerDayRedFlag = Math.floor(closersSalesCapacity / daysInRange * leadsPerSlotRedFlag);

    //         return leadsPerDayRedFlag;
    //     },
    //     createTarget: (startDate, endDate) => (apiData) => {
    //         const { closersSalesCapacity } = apiData;
    //         const leadsPerSlotTarget = 5.77;

    //         const start = new Date(startDate);
    //         const end = new Date(endDate + "T23:59:59.999Z");
    //         const timeDifference = Math.abs(end.getTime() - start.getTime());
    //         const daysInRange = Math.ceil(timeDifference / (1000 * 3600 * 24));
    //         const leadsPerDayTarget = Math.floor(closersSalesCapacity / daysInRange * leadsPerSlotTarget);

    //         return leadsPerDayTarget;
    //     },
    //     dataLabels: ["Leads Created: ", "Sales Capacity: "],
    //     kpiType: "meter",
    //     unit: "LPD",
    //     kpiFactors: [
    //         {
    //             id: 0,
    //             title: "How to Optimize Leads Per Day",
    //         },
    //         {
    //             id: 1,
    //             desc: "Description TBD",
    //             linkName: "Learn More",
    //             link: ""
    //         },
    //     ],
    // },
    "Closers Connection Rate": {
        name: "Closers Connection Rate",
        dataKeys: ["closersLeadsCreated", "closersLeadsConnected"],
        formula: (apiData) => {
            const { closersLeadsCreated, allLeadConnections } = apiData;
            return closersLeadsCreated > 0 ? allLeadConnections / closersLeadsCreated * 100 : 0;
        },
        redFlag: 60,
        target: 80,
        dataLabels: ["Leads Created: ", "Leads Connected: "],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Leads Connected",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Closers Triage Rate": {
        name: "Closers Triage Rate",
        dataKeys: ["closersLeadsConnected", "closersLeadsTriaged"],
        formula: (apiData) => {
            const { allLeadConnections, closersLeadsTriaged } = apiData;
            return allLeadConnections > 0 ? closersLeadsTriaged / allLeadConnections * 100 : 0;
        },
        redFlag: 60,
        target: 75,
        dataLabels: ["Leads Connected: ", "Leads Triaged: "],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Leads Triaged",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },      
    "Closers Leads Set Prequalified": {
        name: "Closers Leads Set Prequalified",
        dataKeys: ["closersLeadsCreated", "closersLeadsSetPrequalified"],
        formula: (apiData) => {
            const { closersLeadsCreated, closersLeadsSetPrequalified } = apiData;
            return closersLeadsCreated > 0 ? closersLeadsSetPrequalified / closersLeadsCreated * 100 : 0;
        },
        redFlag: 10,
        target: 20,
        dataLabels: ["Leads Created: ", "LSP: "],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Leads Set Prequalified",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Closers Booking Rate": {
        name: "Closers Booking Rate",
        dataKeys: ["closersLeadsCreated", "closersBookings"],
        formula: (apiData) => {
            const { closersLeadsCreated, closersBookings } = apiData;
            return closersLeadsCreated > 0 ? closersBookings / closersLeadsCreated * 100 : 0;
        },
        redFlag: 20,
        target: 40,
        dataLabels: ["Leads: ", "Unique Bookings: "],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Booking Rate",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Closers Cost Per Booking": {
        name: "Closers Cost Per Booking",
        dataKeys: ["totalClosersAdSpend", "closersBookings"],
        formula: (apiData) => {
            const { totalClosersAdSpend, closersBookings } = apiData;
            return closersBookings > 0 ? totalClosersAdSpend / closersBookings : 0;
        },
        redFlag: 60,
        target: 40,
        dataLabels: ["Ad Spend: $", "Unique Bookings: "],
        kpiType: "meter",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Cost Per Booking",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Closers Cost Per Qualified Booking": {
        name: "Closers Cost Per Qualified Booking",
        dataKeys: ["totalClosersAdSpend", "closersQualifiedBookings"],
        formula: (apiData) => {
            const { totalClosersAdSpend, closersQualifiedBookings } = apiData;
            // console.log(totalClosersAdSpend, closersQualifiedBookings)
            return closersQualifiedBookings > 0 ? totalClosersAdSpend / closersQualifiedBookings : 0;
        },
        redFlag: 150,
        target: 100,
        dataLabels: ["Ad Spend: $", "Unique Qualified Bookings: "],
        kpiType: "meter",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Cost Per Qualified Booking",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    // "Closers Sales Capacity": {
    //     name: "Closers Sales Capacity",
    //     dataKeys: ["closersSalesCapacity", "closersAppointments"],
    //     formula: (apiData) => {
    //         const { closersSalesCapacity, closersAppointments } = apiData;
    //         return closersSalesCapacity > 0 ? closersAppointments / closersSalesCapacity * 100 : 0;
    //     },
    //     redFlag: 50,
    //     target: 70,
    //     dataLabels: ["Sales Capacity: ", "Appointments: "],
    //     kpiType: "meter",
    //     unit: "%",
    //     kpiFactors: [
    //         {
    //             id: 0,
    //             title: "How to Optimize Sales Capacity",
    //         },
    //         {
    //             id: 1,
    //             desc: "Description TBD",
    //             linkName: "Learn More",
    //             link: ""
    //         },
    //     ],
    // },
    "Closers Total Attendance Rate": {
        name: "Closers Total Attendance Rate",
        dataKeys: ["closersAppointments", "closersTotalAttended"],
        formula: (apiData) => {
            const { closersAppointments, closersTotalAttended } = apiData;
            return closersAppointments > 0 ? closersTotalAttended / closersAppointments * 100 : 0;
        },
        redFlag: 70,
        target: 90,
        dataLabels: ["Appointments: ", "Total Attended: "],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Show Rate",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Closers Offer Rate": {
        name: "Closers Offer Rate",
        dataKeys: ["closersUniqueAttended", "closersDcOffers"],
        formula: (apiData) => {
            const { closersUniqueAttended, closersDcOffers, allPreviousDcOffers } = apiData;
            /*
            allPreviousDcOffers includes all offers made by closers BEFORE the selected date range
            closersDcOffers includes all offers made by closers DURING the selected date range
            We de-duplicate the offers by making sure that the offer is not already in the allPreviousDcOffers array
            */

            // console.log('closersUniqueAttended', closersUniqueAttended)
            // console.log('allPreviousDcOffers', allPreviousDcOffers)
            // console.log('closersDcOffers', closersDcOffers)


            // De-duplicate the offers
            let deduplicatedAllDcOffers = allPreviousDcOffers.reduce((acc, curr) => {
                let lead = curr['Related Lead'] && curr['Related Lead'][0];
                // console.log(lead)
                if (lead && !acc.includes(lead)) {
                    acc.push(lead);
                }
                return acc;
            }, []);

            // console.log('deduplicatedAllDcOffers', deduplicatedAllDcOffers)

            let deduplicatedCurrentDcOffers = closersDcOffers.reduce((acc, curr) => {
                let lead = curr['Related Lead'] && curr['Related Lead'][0];
                if (lead && !acc.includes(lead)) {
                    acc.push(lead);
                }
                return acc;
            }, []);

            // console.log('deduplicatedAllDcOffers', deduplicatedAllDcOffers)

            let uniqueOffers = deduplicatedCurrentDcOffers.reduce((acc, curr) => {
                if (!deduplicatedAllDcOffers.includes(curr)) {
                    acc.push(curr);
                }
                return acc;
            }, []).length;

            // console.log('uniqueOffers', uniqueOffers)

            return closersUniqueAttended > 0 ? uniqueOffers / closersUniqueAttended * 100 : 0;
        },
        redFlag: 60,
        target: 80,
        dataLabels: ["Unique Attended: ", "Unique Offers: "],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Offer Rate",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Closers Close Rate": {
        name: "Closers Close Rate",
        dataKeys: ["closersUniqueAttended", "closersDcClosed"],
        formula: (apiData) => {
            const { closersUniqueAttended, closersDcClosed } = apiData;
            return closersDcClosed ? closersDcClosed / closersUniqueAttended * 100 : 0;
        },
        redFlag: 20,
        target: 40,
        dataLabels: ["Unique Attended: ", "Closed: "],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize DC Closed",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Closers Avg Cash Collected": {
        name: "Closers Avg Cash Collected",
        dataKeys: ["closersCashCollected", "numPaymentPlans"],
        formula: (apiData) => {
            const { cashCollectedUpFront, numPaymentPlans } = apiData;

            return numPaymentPlans && numPaymentPlans !== 0 ? (cashCollectedUpFront / numPaymentPlans).toFixed(2) : 0;
        },
        redFlag: 2500,
        target: 4000,
        dataLabels: ["Cash Collected: $", "Payment Plans: "],
        kpiType: "meter",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Cash Collected",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Closers Avg Revenue Contracted": {
        name: "Closers Avg Revenue Contracted",
        dataKeys: ["closersRevenueContracted", "numPaymentPlans"],
        formula: (apiData) => {
            const { totalRevenueContracted, numPaymentPlans } = apiData;
            return numPaymentPlans && numPaymentPlans !== 0 ? (totalRevenueContracted / numPaymentPlans).toFixed(2) : 0;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Revenue Contracted: $", "Payment Plans: "],
        kpiType: "",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Revenue Contracted",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Setter STL Median": {
        name: "Setter STL Median",
        dataKeys: ["setterStlMedian"],
        formula: (apiData) => {
            const { setterStlMedian } = apiData;
            // console.log('setterStlMedian', setterStlMedian)
            let stlArray = (setterStlMedian && setterStlMedian.length > 0) ? setterStlMedian.reduce((acc, curr) => {
                if ('STL Outbound Call' in curr) {
                    acc.push(curr['STL Outbound Call']);
                }
                return acc;
            }, []) : [];
            stlArray.sort((a, b) => a - b);
            let setterStlMedianSorted = stlArray.length % 2 === 0 ? (stlArray[stlArray.length / 2 - 1] + stlArray[stlArray.length / 2]) / 2 : stlArray[(stlArray.length - 1) / 2];
            return setterStlMedianSorted;
        },
        redFlag: 15,
        target: 5,
        dataLabels: [" minutes"],
        kpiType: "STL",
        unit: " mins",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Setter STL Median",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Closers Cost Per Lead": {
        name: "Closers Cost Per Lead",
        dataKeys: ["totalClosersAdSpend", "closersLeadsCreated"],
        formula: (apiData) => {
            const { totalClosersAdSpend, closersLeadsCreated } = apiData;
            return closersLeadsCreated > 0 ? totalClosersAdSpend / closersLeadsCreated : 0;
        },
        redFlag: 35,
        target: 20,
        dataLabels: ["Ad Spend: $", "Leads Created: "],
        kpiType: "meter",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Cost Per Lead",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Closers Cost Per Close": {
        name: "Closers Cost Per Close",
        dataKeys: ["totalClosersAdSpend", "closersDcClosed"],
        formula: (apiData) => {
            const { totalClosersAdSpend, closersDcClosed } = apiData;
            return closersDcClosed > 0 ? totalClosersAdSpend / closersDcClosed : 0;
        },
        redFlag: 1000,
        target: 500,
        dataLabels: ["Ad Spend: $", "Closed: "],
        kpiType: "meter",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Cost Per Close",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Closers ROAS Cash Collected": {
        name: "Closers ROAS Cash Collected",
        dataKeys: ["cashCollectedUpFront", "totalClosersAdSpend"],
        formula: (apiData) => {
            const { cashCollectedUpFront, totalClosersAdSpend } = apiData;
            return totalClosersAdSpend > 0 ? cashCollectedUpFront / totalClosersAdSpend * 100 : 0;
        },
        redFlag: 300,
        target: 500,
        dataLabels: ["Cash Collected: $", "Ad Spend: $"],
        kpiType: "meter",
        unit: "%",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize ROAS Cash Collected",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Closers ROAS Projected": {
        name: "Closers ROAS Projected",
        dataKeys: ["totalRevenueContracted", "totalClosersAdSpend"],
        formula: (apiData) => {
            const { totalRevenueContracted, totalClosersAdSpend, } = apiData;

            return totalClosersAdSpend > 0 ? totalRevenueContracted / totalClosersAdSpend * 100 : 0;
        },
        redFlag: 500,
        target: 800,
        dataLabels: ["Revenue Contracted: $", "Ad Spend: $"],
        kpiType: "meter",
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
    "Closer Commission": {
        name: "Closer Commission",
        dataKeys: ["closerCommission"],
        formula: (apiData) => {
            const { closerCommission } = apiData;
            const closerCommissionTotal = (closerCommission && closerCommission.length > 0) ? closerCommission.reduce((acc, curr) => {
                if ("Compensation" in curr) {
                    acc += parseFloat(curr["Compensation"]);
                }
                return acc;
            }, 0) : [];
            return closerCommissionTotal;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Commission: $"],
        kpiType: "",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Closer Commission",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Setter Commission": {
        name: "Setter Commission",
        dataKeys: ["setterCommission"],
        formula: (apiData) => {
            const { setterCommission } = apiData;
            const setterCommissionTotal = (setterCommission && setterCommission.length > 0) ? setterCommission.reduce((acc, curr) => {
                if ("Compensation" in curr) {
                    acc += parseFloat(curr["Compensation"]);
                }
                return acc;
            }, 0) : [];
            return setterCommissionTotal;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Commission: $"],
        kpiType: "",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Setter Commission",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    },
    "Current Passive Income": {
        name: "Current Passive Income",
        dataKeys: ["currentPassiveIncome"],
        formula: (apiData) => {
            const { currentPassiveIncome } = apiData;
            const currentPassiveIncomeTotal = (currentPassiveIncome && currentPassiveIncome.length > 0) ? currentPassiveIncome.reduce((acc, curr) => {
                if ("Closer Commision Monthly" in curr) {
                    acc += parseFloat(curr["Closer Commision Monthly"]);
                }
                return acc;
            }, 0) : [];
            return currentPassiveIncomeTotal;
        },
        redFlag: 0,
        target: 0,
        dataLabels: ["Passive Income: $"],
        kpiType: "",
        unit: "$",
        kpiFactors: [
            {
                id: 0,
                title: "How to Optimize Current Passive Income",
            },
            {
                id: 1,
                desc: "Description TBD",
                linkName: "Learn More",
                link: ""
            },
        ],
    }
};

export default KPI_DEFINITIONS;