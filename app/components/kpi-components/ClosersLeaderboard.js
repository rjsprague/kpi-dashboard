import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getDatePresets } from '../../lib/date-utils';
import getClosersLeaderboard from '../../lib/closers-leaderboard'
import EllipsisLoader from '../EllipsisLoader';
import ClosersDateSelector from './ClosersDateSelector';
import QueryPanel from './QueryPanel';
import AnimateHeight from 'react-animate-height';

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getNameById(id, departments) {
    for (const role in departments) {
        if (departments[role][id]) {
            return departments[role][id];
        }
    }
    return null; // Return null if the ID is not found
}


export default function ClosersLeaderboard({
    query,
    view,
    VIEW_KPIS,
    departments,
    kpiList,
    onDateRangeChange,
    onTeamMemberForClosersChange,
    onToggleQuery,
    onRemoveQuery,
    isLoadingData,
}) {
    // create constants for start and end of today, this week, this month
    const today = getDatePresets().Today;
    const thisWeek = getDatePresets()['Current Week'];
    const thisMonth = getDatePresets()["Current Month"];

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const [height, setHeight] = useState('auto');

    // create state for start and end dates
    const [dayStart, setDayStart] = useState(formatDate(today.startDate));
    const [dayEnd, setDayEnd] = useState(formatDate(today.endDate));
    const [weekStart, setWeekStart] = useState(formatDate(thisWeek.startDate));
    const [weekEnd, setWeekEnd] = useState(formatDate(thisWeek.endDate));
    const [monthStart, setMonthStart] = useState(formatDate(thisMonth.startDate));
    const [monthEnd, setMonthEnd] = useState(formatDate(thisMonth.endDate));

    const { data: dayData, error: dayError } = useSWR({ startDate: dayStart, endDate: dayEnd, departments: departments }, getClosersLeaderboard);
    const { data: weekData, error: weekError } = useSWR({ startDate: weekStart, endDate: weekEnd, departments: departments }, getClosersLeaderboard);
    const { data: monthData, error: monthError } = useSWR({ startDate: monthStart, endDate: monthEnd, departments: departments }, getClosersLeaderboard);

    const currentYear = new Date().getFullYear();

    const handleDayChange = (selectedDay) => {
        const [monthName, day] = selectedDay.split(' ');
        const selectedDayDate = new Date(`${currentYear}-${months.indexOf(monthName) + 1}-${day}`);
        setDayStart(formatDate(selectedDayDate));
        setDayEnd(formatDate(selectedDayDate));
        mutate({ startDate: formatDate(selectedDayDate), endDate: formatDate(selectedDayDate), departments: departments });
    };

    const handleWeekChange = (selectedWeek) => {
        const [monthName, dayRange] = selectedWeek.split(' ');
        const [startDay, endDay] = dayRange.split('-');
        const startWeekDate = new Date(`${currentYear}-${months.indexOf(monthName) + 1}-${startDay}`);
        const endWeekDate = new Date(`${currentYear}-${months.indexOf(monthName) + 1}-${endDay}`);
        setWeekStart(formatDate(startWeekDate));
        setWeekEnd(formatDate(endWeekDate));
        mutate({ startDate: formatDate(startWeekDate), endDate: formatDate(endWeekDate), departments: departments });
    };

    const handleMonthChange = (selectedMonth) => {
        const selectedMonthDate = new Date(`${currentYear}-${months.indexOf(selectedMonth) + 1}-01`);
        const lastDayOfMonth = new Date(selectedMonthDate.getFullYear(), selectedMonthDate.getMonth() + 1, 0);
        setMonthStart(formatDate(selectedMonthDate));
        setMonthEnd(formatDate(lastDayOfMonth));
        mutate({ startDate: formatDate(selectedMonthDate), endDate: formatDate(lastDayOfMonth), departments: departments });
    };

    const handleToggleQuery = () => {
        onToggleQuery(query.id);
        setHeight(height === 0 ? 'auto' : 0);
    };

    const handleRemoveQuery = () => {
        onRemoveQuery && onRemoveQuery(query.id);
    };

    const handleGearIconClick = () => {
        setModalType("settings");
        setOpenModal(true);
    };

    const isLoading = (data, error) => !data && !error;

    if (dayError || weekError || monthError) {
        console.error(dayError || weekError || monthError);
        return <div className="flex flex-col items-center justify-center w-full h-full text-red-500">Error loading data</div>;
    }

    return (
        <>
            <QueryPanel query={query} height={height} setHeight={setHeight} handleToggleQuery={handleToggleQuery} handleRemoveQuery={handleRemoveQuery} handleGearIconClick={handleGearIconClick}>
                <ClosersDateSelector
                    onDayChange={handleDayChange}
                    onWeekChange={handleWeekChange}
                    onMonthChange={handleMonthChange}
                />
            </QueryPanel>
            <AnimateHeight duration={500} height={height}>
                <div id="closers-leaderboard" className="flex flex-col items-center w-full px-4 py-4 mb-4 bg-blue-300 rounded-lg shadow-super-4">
                    <div className="flex flex-col w-full bg-white rounded-lg shadow-super-4">
                        {/* Table Header */}
                        <div className="flex flex-row justify-between px-4 py-2 font-bold text-blue-900 bg-blue-100">
                            <div className="w-32"></div>
                            <div className="w-32 text-center">Highest Close Rate</div>
                            <div className="w-32 text-center">Most Closed Calls</div>
                            <div className="w-32 text-center">Most Cash Collected</div>
                        </div>
                        {/* Table Rows */}
                        {['Day', 'Week', 'Month'].map((timeFrame, index) => (
                            <div key={index} className="flex flex-row justify-between px-4 py-2 text-sm text-blue-800 bg-white">
                                <div className="w-32 font-semibold">{timeFrame}</div>
                                {['highestCloseRate', 'mostClosedDiscoveryCalls', 'mostCashCollectedUpFront'].map((kpi, i) => (
                                    <div key={i} className="w-32 text-center">
                                        {timeFrame === 'Day' ?
                                            (isLoading(dayData, dayError) ? <EllipsisLoader /> :
                                                dayData?.winners[kpi] ? `${getNameById(dayData.winners[kpi][0], departments).split(' ')[0]} :  ${kpi === 'mostCashCollectedUpFront' ? '$' : ''}${dayData.winners[kpi][1]}${kpi === 'highestCloseRate' ? '%' : ''}` : '-')

                                            : timeFrame === 'Week' ?
                                                (isLoading(weekData, weekError) ? <EllipsisLoader /> :
                                                    weekData?.winners[kpi] ? `${getNameById(weekData.winners[kpi][0], departments).split(' ')[0]} : ${kpi === 'mostCashCollectedUpFront' ? '$' : ''}${weekData.winners[kpi][1]}${kpi === 'highestCloseRate' ? '%' : ''}` : '-')

                                                : timeFrame === 'Month' ?
                                                    (isLoading(monthData, monthError) ? <EllipsisLoader /> :
                                                        monthData?.winners[kpi] ? `${getNameById(monthData.winners[kpi][0], departments).split(' ')[0]} : ${kpi === 'mostCashCollectedUpFront' ? '$' : ''}${monthData.winners[kpi][1]}${kpi === 'highestCloseRate' ? '%' : ''}` : '-')
                                                    : null}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </AnimateHeight>
        </>
    );
}