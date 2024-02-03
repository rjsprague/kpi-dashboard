import cookies from 'js-cookie';

// Function to extract team member IDs from the departments object
function extractTeamMemberIDs(departments) {
    let teamMemberIDs = [];
    for (const role in departments) {
        for (const id in departments[role]) {
            teamMemberIDs.push(parseInt(id));
        }
    }
    return teamMemberIDs;
}

// Function to create fetch promises
function createFetchPromises(teamMemberIDs, accessToken, startDate, endDate, closersSpaceId, managementSpaceId) {
    const fetchPromises = [];

    teamMemberIDs.forEach((id) => {
        // Discovery Calls - Total
        fetchPromises.push(
            fetch(`api/closers/acquisitions/discovery-calls`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    "spaceid": closersSpaceId,
                    "limit": 100,
                    "filters": [
                        {
                            "type": "date",
                            "fieldName": "created_on",
                            "gte": `${startDate} 00:00:00`,
                            "lte": `${endDate} 23:59:59`
                        },
                        {
                            "type": "app",
                            "fieldName": "Closer Responsible",
                            "values": [id]
                        }
                    ]
                }),
            })
        );

        // Discovery Calls - Closed
        fetchPromises.push(
            fetch(`api/closers/acquisitions/discovery-calls`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    "spaceid": closersSpaceId,
                    "limit": 100,
                    "filters": [
                        {
                            "type": "date",
                            "fieldName": "created_on",
                            "gte": `${startDate} 00:00:00`,
                            "lte": `${endDate} 23:59:59`
                        },
                        {
                            "type": "category",
                            "fieldName": "Status of the Call",
                            "values": ["Closed"]
                        },
                        {
                            "type": "app",
                            "fieldName": "Closer Responsible",
                            "values": [id]
                        }
                    ]
                }),
            })
        );

        // Payment Plans
        fetchPromises.push(
            fetch(`api/closers/management/payment-plans`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    "spaceid": managementSpaceId,
                    "limit": 100,
                    "filters": [
                        {
                            "type": "date",
                            "fieldName": "Date",
                            "gte": `${startDate} 00:00:00`,
                            "lte": `${endDate} 23:59:59`
                        },
                        {
                            "type": "app",
                            "fieldName": "Closer Responsible",
                            "values": [id]
                        }
                    ]
                }),
            })
        );
    });

    return fetchPromises;
}

// Function to determine winners based on KPIs
function determineWinners(teamMemberData) {

    const winners = {
        highestCloseRate: null,
        mostClosedDiscoveryCalls: null,
        mostCashCollectedUpFront: null
    };

    let maxCloseRate = 0;
    let maxClosedCalls = 0;
    let maxCashCollected = 0;

    for (const [id, data] of Object.entries(teamMemberData)) {


        if (data.closeRate > maxCloseRate) {
            maxCloseRate = data.closeRate;
            winners.highestCloseRate = [id, maxCloseRate];
        }

        if (data.dcClosed > maxClosedCalls) {
            maxClosedCalls = data.dcClosed;
            winners.mostClosedDiscoveryCalls = [id, maxClosedCalls];
        }

        if (data.totalCashCollected > maxCashCollected) {
            maxCashCollected = data.totalCashCollected;
            winners.mostCashCollectedUpFront = [id, maxCashCollected];
        }
    }

    return winners;
}


export default async function getClosersLeaderboard({ startDate, endDate, departments }) {

    const accessToken = cookies.get('token')
    // console.log('accessToken:', accessToken)

    const closersSpaceId = parseInt(process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID)
    const managementSpaceId = parseInt(process.env.NEXT_PUBLIC_MANAGEMENT_SPACEID)

    const teamMemberIDs = extractTeamMemberIDs(departments);

    const fetchPromises = createFetchPromises(teamMemberIDs, accessToken, startDate, endDate, closersSpaceId, managementSpaceId);

    try {
        const responses = await Promise.all(fetchPromises);

        const teamMemberData = {};

        for (let i = 0; i < responses.length; i += 3) {
            const teamMemberID = teamMemberIDs[i / 3];
            const totalDCs = await responses[i].json();
            const dcClosed = await responses[i + 1].json();
            const paymentPlans = await responses[i + 2].json();

            const cashCollectedUpFront = paymentPlans && paymentPlans.data ? paymentPlans.data.reduce((acc, curr) => {
                if (curr['Cash Collected Up Front']) {
                    return acc + parseFloat(curr['Cash Collected Up Front']);
                } else {
                    return acc;
                }
            }, 0) : 0;

            teamMemberData[teamMemberID] = {
                closeRate: totalDCs && totalDCs.total !== 0 ? ((dcClosed.total / totalDCs.total) * 100).toPrecision(3) : 0,
                dcClosed: (dcClosed.total),
                totalCashCollected: cashCollectedUpFront
            };
        }

        // Determine winners
        const winners = determineWinners(teamMemberData);

        return { teamMemberData, winners };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Error fetching data. Please try again later.');
    }
}

