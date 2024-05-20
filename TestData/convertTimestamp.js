const { DateTime } = require('luxon');

function convertTimestamp(timestamp, fromZone, toZone) {
    if (!timestamp) return null;

    // Parse the input timestamp in the source time zone and convert to UTC
    let sourceDateTime = DateTime.fromISO(timestamp, { zone: fromZone }).toUTC();
    
    // Convert the UTC time to the target time zone and then back to UTC
    let convertedTimestamp = sourceDateTime.setZone(toZone).toISO();

    return convertedTimestamp;
}


// Test cases
const testCases = [
    {
        timestamp: '2024-05-20T12:00:00', // Noon in Honolulu
        fromZone: 'Pacific/Honolulu',
        toZone: 'America/New_York',
        expected: '2024-05-20T18:00:00.000' // 6 PM UTC
    },
    {
        timestamp: '2024-12-25T00:00:00', // Midnight in Honolulu
        fromZone: 'Pacific/Honolulu',
        toZone: 'America/New_York',
        expected: '2024-12-25T05:00:00.000' // 5 AM UTC
    },
    {
        timestamp: '2024-01-01T15:30:00', // 3:30 PM in Honolulu
        fromZone: 'Pacific/Honolulu',
        toZone: 'America/New_York',
        expected: '2024-01-01T20:30:00.000' // 8:30 PM UTC
    }
];

testCases.forEach(({ timestamp, fromZone, toZone, expected }) => {
    const convertedTimestamp = convertTimestamp(timestamp, fromZone, toZone);
    console.log(`Converted Timestamp: ${convertedTimestamp}`);
    console.log(`Expected: ${expected}`);
    console.log(`Test Passed: ${convertedTimestamp === expected}`);
    console.log('---');
});
