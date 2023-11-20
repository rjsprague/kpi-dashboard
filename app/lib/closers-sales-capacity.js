

// Utility function to convert time strings to minutes
const timeToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutesPart] = time.split(':');
    const minutes = minutesPart.slice(0, -2);
    const meridian = minutesPart.slice(-2);
    return (parseInt(hours) % 12 + (meridian.toLowerCase() === 'pm' ? 12 : 0)) * 60 + parseInt(minutes);
};

// Function to calculate the number of 90-minute slots in a day
const calculateDailySlots = (start, end, slotDuration, lunchBreak) => {
    if (!start || !end) return 0; // If the day is unavailable, return 0 slots

    const totalMinutes = timeToMinutes(end) - timeToMinutes(start);
    const usableMinutes = totalMinutes - lunchBreak;
    return Math.floor(usableMinutes / slotDuration);
};

// Function to calculate slots for each team member's weekly schedule
const calculateSlotsForTeam = (teamSchedules) => {
    const slotDuration = 60; // Slot duration in minutes
    const lunchBreak = 30; // Lunch break duration in minutes
    let teamMemberSlots = {};

    // Loop over each team member's schedule
    for (const [memberId, weeklySchedule] of Object.entries(teamSchedules)) {
        teamMemberSlots[memberId] = {};
        for (const [day, hours] of Object.entries(weeklySchedule)) {
            teamMemberSlots[memberId][day] = calculateDailySlots(hours.start, hours.end, slotDuration, lunchBreak);
        }
    }

    return teamMemberSlots;
};

// Sample nested object with schedules for each team member
const teamSchedules = {
    '2593542815': { // Brandon Pringle
        '0': { start: null, end: null }, // Sunday
        '1': { start: '12:00pm', end: '5:30pm' }, // Monday
        '2': { start: '12:00pm', end: '5:30pm' }, // Tuesday
        '3': { start: '12:00pm', end: '5:30pm' }, // Wednesday
        '4': { start: '12:00pm', end: '5:30pm' }, // Thursday
        '5': { start: null, end: null }, // Friday
        '6': { start: null, end: null }, // Saturday
    },
    '2637469614': { // Chris Kaczmarski
        '0': { start: null, end: null }, // Sunday
        '1': { start: '9:00am', end: '8:00pm' }, // Monday
        '2': { start: '9:00am', end: '5:30pm' }, // Tuesday
        '3': { start: '9:00am', end: '5:30pm' }, // Wednesday
        '4': { start: '9:00am', end: '5:30pm' }, // Thursday
        '5': { start: '9:00am', end: '5:30pm' }, // Friday
        '6': { start: null, end: null }, // Saturday
    },
    // ... other team members
};

// Calculate slots for the entire team
const salesTeamMemberSlots = calculateSlotsForTeam(teamSchedules);

// Utility function to get the day of the week as a number
const getDayOfWeek = (date) => {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek;
}

// Function to calculate total sales capacity within a date range
const calculateTotalSalesCapacity = (startDate, endDate, closerIDs) => {

    let totalCapacity = 0;
    let currentDate = new Date(startDate);
    let end = new Date(endDate);

    // Set time for midnight comparison
    currentDate.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);


    while (currentDate.getTime() <= end.getTime()) {
        const dayOfWeek = getDayOfWeek(currentDate);
        // iterate over the closerIDs array to add up the capacity for each closer
        try {
            closerIDs.forEach(closerID => {
                if (closerID in salesTeamMemberSlots) {
                    const capacity = salesTeamMemberSlots[closerID][dayOfWeek];
                    if (typeof capacity === 'number') {
                        totalCapacity += capacity;
                    } else {
                        console.error(`Capacity not a number for closerID: ${closerID}, dayOfWeek: ${dayOfWeek}`);
                    }
                }
            });
        } catch (error) {
            console.error('An error occurred:', error);
        }

        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        currentDate.setUTCHours(0, 0, 0, 0); // reset time for midnight comparison
    }
    return totalCapacity;
}

export default calculateTotalSalesCapacity;