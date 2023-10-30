

const salesCapacity = {
    2306132453: { // Keith Gillispie
        0: 0, // Sunday
        1: 0, // Monday
        2: 0, // Tuesday
        3: 0, // Wednesday
        4: 0, // Thursday
        5: 0, // Friday
        6: 0, // Saturday
    },
    2593542815: { // Brandon Pringle
        0: 0, // Sunday
        1: 3, // Monday
        2: 3, // Tuesday
        3: 3, // Wednesday
        4: 3, // Thursday
        5: 0, // Friday
        6: 0, // Saturday  
    },
    2337227317: { // Jacob Carey
        0: 4, // Sunday
        1: 4, // Monday
        2: 0, // Tuesday
        3: 0, // Wednesday
        4: 4, // Thursday
        5: 4, // Friday
        6: 4, // Saturday
    }
}

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
                if (closerID in salesCapacity) {
                    const capacity = salesCapacity[closerID][dayOfWeek];
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