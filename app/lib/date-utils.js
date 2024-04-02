"use client"
import { DateTime } from 'luxon';

export const formatDate = (dateTimeString) => {
    const dateObject = new Date(dateTimeString);
    return dateObject.toISOString().split('T')[0];
}

export function getStartOfTheDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

export function getEndOfTheDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function getStartOfLastWeek() {
    const now = new Date();
    const startOfLastWeek = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - now.getUTCDay() - 6,
        0, 0, 0, 0
    );
    return startOfLastWeek;
}

export function getEndOfLastWeek() {
    const now = new Date();
    const endOfLastWeek = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - now.getUTCDay(),
        23, 59, 59, 999
    );
    return endOfLastWeek;
}

export function getStartOfLastMonth() {
    const now = new Date();
    const startOfLastMonth = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth() - 1,
        1,
        0, 0, 0, 0
    );
    return startOfLastMonth;
}

export function getEndOfLastMonth() {
    const now = new Date();
    const endOfLastMonth = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        0,
        23, 59, 59, 999
    );
    return endOfLastMonth;
}

export function getStartOfLastQuarter() {
    const now = new Date();
    const startOfLastQuarter = new Date(
        now.getUTCFullYear(),
        Math.floor(now.getUTCMonth() / 3) * 3 - 3,
        1,
        0, 0, 0, 0
    );
    return startOfLastQuarter;
}

export function getEndOfLastQuarter() {
    const now = new Date();
    const endOfLastQuarter = new Date(
        now.getUTCFullYear(),
        Math.floor(now.getUTCMonth() / 3) * 3,
        0,
        23, 59, 59, 999
    );
    return endOfLastQuarter;
}

export function getDatePresets() {

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startOfToday = getStartOfTheDay(today);

    const endOfToday = getEndOfTheDay(today);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const startOfQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);

    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const previousWeek = new Date(startOfWeek);
    previousWeek.setDate(startOfWeek.getDate() - 7);

    const endOfPreviousWeek = new Date(previousWeek);
    endOfPreviousWeek.setDate(previousWeek.getDate() + 6);

    const startOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);


    const startOfPreviousQuarter = new Date(today.getFullYear(), Math.floor((today.getMonth() - 3) / 3) * 3, 1);

    const endOfPreviousQuarter = new Date(startOfQuarter);
    endOfPreviousQuarter.setDate(startOfQuarter.getDate() - 1);

    const startOfPreviousYear = new Date(today.getFullYear() - 1, 0, 1);

    const endOfPreviousYear = new Date(today.getFullYear(), 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const endOfQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 + 3, 0);

    const endOfYear = new Date(today.getFullYear(), 11, 31);

    const allTimeStart = new Date(2018, 0, 1);

    return {
        'Yesterday': { startDate: yesterday, endDate: yesterday },
        'Today': { startDate: startOfToday, endDate: endOfToday },
        'Last 7 Days': { startDate: new Date(yesterday - 6 * 86400000), endDate: yesterday },
        'Last Week': { startDate: previousWeek, endDate: endOfPreviousWeek },
        'Last 30 Days': { startDate: new Date(yesterday - 29 * 86400000), endDate: yesterday },
        'Last Month': { startDate: startOfPreviousMonth, endDate: endOfPreviousMonth },
        'Last Quarter': { startDate: startOfPreviousQuarter, endDate: endOfPreviousQuarter },
        'Last Year': { startDate: startOfPreviousYear, endDate: endOfPreviousYear },
        'Week to Date': { startDate: startOfWeek, endDate: endOfToday },
        'Month to Date': { startDate: startOfMonth, endDate: endOfToday },
        'Quarter to Date': { startDate: startOfQuarter, endDate: endOfToday },
        'Year to Date': { startDate: startOfYear, endDate: endOfToday },
        'Current Week': { startDate: startOfWeek, endDate: endOfWeek },
        'Current Month': { startDate: startOfMonth, endDate: endOfMonth },
        'Current Quarter': { startDate: startOfQuarter, endDate: endOfQuarter },
        'Current Year': { startDate: startOfYear, endDate: endOfYear },
        'All Time': { startDate: allTimeStart, endDate: endOfToday }
    };

}

export function getWeekRange(year, weekNumber) {
    // Create a date object set to the first day of the year
    const firstDayOfYear = new Date(year, 0, 1);
    // Get the first day of the week
    const start = new Date(firstDayOfYear);
    start.setDate(firstDayOfYear.getDate() + (weekNumber - 1) * 7 - firstDayOfYear.getDay());
    // Get the last day of the week
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    // Return the start and end dates
    return { startDate: start, endDate: end };
}

export function calculateBusinessHoursDiff(startTimestamp, endTimestamp, timezone) {

    const workingStartHour = 8;  // 8 AM
    const workingEndHour = 20;   // 8 PM, 20 in 24-hour format

    let start = DateTime.fromISO(startTimestamp, { zone: timezone });
    let end = DateTime.fromISO(endTimestamp, { zone: timezone });

    let businessHoursCount = 0;

    while (start < end) {
        if (start.hour >= workingStartHour && start.hour < workingEndHour) {
            businessHoursCount++;
        }
        // Move to the next hour
        start = start.plus({ hours: 1 });
    }

    return businessHoursCount*60*60; // Convert to seconds
}