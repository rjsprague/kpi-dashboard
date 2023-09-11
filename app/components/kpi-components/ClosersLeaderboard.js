import { useState, useEffect } from 'react';
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
    return null;
}

const formatDateToDay = (dateString) => {
    const date = new Date(dateString);
    return String(date.getDate()).padStart(2, '0');
};

const formatDateToWeek = (startDateString, endDateString) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    return `${String(startDate.getDate()).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
};

export default function ClosersLeaderboard({
    query,
    departments,
    onToggleQuery,
    onRemoveQuery,
}) {
    const today = getDatePresets().Today;
    const thisWeek = getDatePresets()['Current Week'];
    const thisMonth = getDatePresets()["Current Month"];

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const [height, setHeight] = useState('auto');

    const [selectedDay, setSelectedDay] = useState();
    const [selectedWeek, setSelectedWeek] = useState();
    const [selectedMonth, setSelectedMonth] = useState();

    const [days, setDays] = useState([]);
    const [weeks, setWeeks] = useState([]);

    useEffect(() => {
        setSelectedDay(formatDateToDay(today.startDate))
        setSelectedWeek(formatDateToWeek(thisWeek.startDate, thisWeek.endDate))
        setSelectedMonth(months[new Date().getMonth()])

        const currentYear = new Date().getFullYear();

        // Generate days for the initially selected month
        const daysInMonth = new Date(currentYear, months.indexOf(selectedMonth) + 1, 0).getDate();
        const newDays = Array.from({ length: daysInMonth }, (_, i) => formatDateToDay(new Date(currentYear, months.indexOf(selectedMonth), i + 1)));
        setDays(newDays);

        // Generate weeks for the initially selected month
        const newWeeks = [];
        for (let i = 1; i <= daysInMonth; i += 7) {
            const endWeek = Math.min(i + 6, daysInMonth);
            newWeeks.push(formatDateToWeek(new Date(currentYear, months.indexOf(selectedMonth), i), new Date(currentYear, months.indexOf(selectedMonth), endWeek)));
        }
        setWeeks(newWeeks);
    }, [])

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

    const handleDayChange = (selectedDay, selectedMonth, selectedWeek, weeks) => {

        const selectedDayDate = new Date(`${currentYear}-${months.indexOf(selectedMonth) + 1}-${selectedDay}`);
        setDayStart(formatDate(selectedDayDate));
        setDayEnd(formatDate(selectedDayDate));
        setSelectedDay(formatDateToDay(selectedDayDate));

        // set the selected week to the week that the selected day is in
        weeks.find(week => {
            const [startDay, endDay] = week.split('-');

            if (selectedDay >= startDay && selectedDay <= endDay) {
                setSelectedWeek(week);
                handleWeekChange(week, selectedMonth, selectedDay, weeks);
                return true;
            }
        });

        mutate({ startDate: formatDate(selectedDayDate), endDate: formatDate(selectedDayDate), departments: departments });
    };

    const handleWeekChange = (selectedWeek, selectedMonth, selectedDay, weeks) => {

        const [startDay, endDay] = selectedWeek.split('-');
        const startWeekDate = new Date(`${currentYear}-${months.indexOf(selectedMonth) + 1}-${startDay}`);
        const endWeekDate = new Date(`${currentYear}-${months.indexOf(selectedMonth) + 1}-${endDay}`);
        setSelectedWeek(formatDateToWeek(startWeekDate, endWeekDate));
        setWeekStart(formatDate(startWeekDate));
        setWeekEnd(formatDate(endWeekDate));

        // set the selected day to the first day of the selected week if it is not within the selected week
        if (selectedDay < startDay || selectedDay > endDay) {
            setSelectedDay(formatDateToDay(startWeekDate));
            handleDayChange(formatDateToDay(startWeekDate), selectedMonth, selectedWeek, weeks);
        }

        mutate({ startDate: formatDate(startWeekDate), endDate: formatDate(endWeekDate), departments: departments });
    };

    const handleMonthChange = (selectedMonth) => {
        setSelectedMonth(selectedMonth);
        const currentYear = new Date().getFullYear();

        // Generate days based on the selected month
        const daysInMonth = new Date(currentYear, months.indexOf(selectedMonth) + 1, 0).getDate();
        const newDays = Array.from({ length: daysInMonth }, (_, i) => formatDateToDay(new Date(currentYear, months.indexOf(selectedMonth), i + 1)));
        setDays(newDays);

        // Generate weeks based on the selected month
        const newWeeks = [];
        for (let i = 1; i <= daysInMonth; i += 7) {
            const endWeek = Math.min(i + 6, daysInMonth);
            newWeeks.push(formatDateToWeek(new Date(currentYear, months.indexOf(selectedMonth), i), new Date(currentYear, months.indexOf(selectedMonth), endWeek)));
        }
        setWeeks(newWeeks);

        const selectedMonthDate = new Date(`${currentYear}-${months.indexOf(selectedMonth) + 1}-01`);
        const lastDayOfMonth = new Date(selectedMonthDate.getFullYear(), selectedMonthDate.getMonth() + 1, 0);
        setMonthStart(formatDate(selectedMonthDate));
        setMonthEnd(formatDate(lastDayOfMonth));

        // update the data for the selected month to the newly selected month
        mutate({ startDate: formatDate(selectedMonthDate), endDate: formatDate(lastDayOfMonth), departments: departments });

        handleDayChange(newDays[0], selectedMonth, weeks[0], weeks);
        handleWeekChange(weeks[0], selectedMonth, newDays[0], weeks);
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
                    selectedDay={selectedDay}
                    selectedWeek={selectedWeek}
                    selectedMonth={selectedMonth}
                    days={days}
                    weeks={weeks}
                    months={months}
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
                        {[`Day (${selectedDay})`, `Week (${selectedWeek})`, `Month (${selectedMonth})`].map((timeFrame, index) => (
                            <div key={index} className="flex flex-row justify-between px-4 py-2 text-sm text-blue-800 bg-white">
                                <div className="w-32 font-semibold">{timeFrame}</div>
                                {['highestCloseRate', 'mostClosedDiscoveryCalls', 'mostCashCollectedUpFront'].map((kpi, i) => (
                                    <div key={i} className="w-32 text-center">
                                        {timeFrame === `Day (${selectedDay})` ?
                                            (isLoading(dayData, dayError) ? <EllipsisLoader /> :
                                                dayData?.winners[kpi] ? `${getNameById(dayData.winners[kpi][0], departments).split(' ')[0]} :  ${kpi === 'mostCashCollectedUpFront' ? '$' : ''}${dayData.winners[kpi][1]}${kpi === 'highestCloseRate' ? '%' : ''}` : '-')

                                            : timeFrame === `Week (${selectedWeek})` ?
                                                (isLoading(weekData, weekError) ? <EllipsisLoader /> :
                                                    weekData?.winners[kpi] ? `${getNameById(weekData.winners[kpi][0], departments).split(' ')[0]} : ${kpi === 'mostCashCollectedUpFront' ? '$' : ''}${weekData.winners[kpi][1]}${kpi === 'highestCloseRate' ? '%' : ''}` : '-')

                                                : timeFrame === `Month (${selectedMonth})` ?
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