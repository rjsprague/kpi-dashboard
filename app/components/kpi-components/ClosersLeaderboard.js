import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { getDatePresets } from '../../lib/date-utils';
import getClosersLeaderboard from '../../lib/closers-leaderboard'
import EllipsisLoader from '../EllipsisLoader';
import ClosersDateSelector from './ClosersDateSelector';
import QueryPanel from './QueryPanel';
import AnimateHeight from 'react-animate-height';
import { FiCopy } from 'react-icons/fi';

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
    onCloneLeaderboard,
}) {

    const today = getDatePresets().Today;
    const thisWeek = getDatePresets()['Current Week'];
    const thisMonth = getDatePresets()["Current Month"];
    const thisYear = getDatePresets()["Current Year"];

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = [2023, 2024]

    const [height, setHeight] = useState('auto');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('settings');

    const [selectedDay, setSelectedDay] = useState("");
    const [selectedWeek, setSelectedWeek] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    const [days, setDays] = useState([]);
    const [weeks, setWeeks] = useState([]);

    const [dayStart, setDayStart] = useState("");
    const [dayEnd, setDayEnd] = useState("");
    const [weekStart, setWeekStart] = useState("");
    const [weekEnd, setWeekEnd] = useState("");
    const [monthStart, setMonthStart] = useState("");
    const [monthEnd, setMonthEnd] = useState("");
    const [yearStart, setYearStart] = useState("");
    const [yearEnd, setYearEnd] = useState("");

    useEffect(() => {
        setSelectedDay(formatDateToDay(today.startDate))
        setSelectedWeek(formatDateToWeek(thisWeek.startDate, thisWeek.endDate))
        setSelectedMonth(months[new Date().getMonth()])
        setSelectedYear(new Date().getFullYear())
    
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

        setDayStart(formatDate(today.startDate));
        setDayEnd(formatDate(today.endDate));
        setWeekStart(formatDate(thisWeek.startDate));
        setWeekEnd(formatDate(thisWeek.endDate));
        setMonthStart(formatDate(thisMonth.startDate));
        setMonthEnd(formatDate(thisMonth.endDate));
        setYearStart(formatDate(thisYear.startDate));
        setYearEnd(formatDate(thisYear.endDate));

    }, [])

    // When a leaderboard is cloned the query results will hold the previous query's results
    useEffect(() => {
        if (!query.results.dayStart) return;
        setDayStart(query.results.dayStart)
        setDayEnd(query.results.dayEnd)
        setWeekStart(query.results.weekStart)
        setWeekEnd(query.results.weekEnd)
        setMonthStart(query.results.monthStart || monthStart)
        setMonthEnd(query.results.monthEnd || monthEnd)
        setYearStart(query.results.yearStart || yearStart)
        setYearEnd(query.results.yearEnd || yearEnd)

        setSelectedDay(formatDateToDay(query.results.dayStart))
        setSelectedWeek(formatDateToWeek(query.results.weekStart, query.results.weekEnd))
        setSelectedMonth(months[new Date(query.results.monthStart || monthStart).getMonth()])
        setSelectedYear
    }, [query.results])

    const { data: dayData, error: dayError } = useSWR({ startDate: dayStart, endDate: dayEnd, departments: departments }, getClosersLeaderboard);
    const { data: weekData, error: weekError } = useSWR({ startDate: weekStart, endDate: weekEnd, departments: departments }, getClosersLeaderboard);
    const { data: monthData, error: monthError } = useSWR({ startDate: monthStart, endDate: monthEnd, departments: departments }, getClosersLeaderboard);

    
    const handleDayChange = (selectedYear, selectedMonth, selectedDay) => {
        
        // set the selected day's Year-Month-Day date to the newly selected day
        const selectedDayDate = new Date(`${selectedYear}-${months.indexOf(selectedMonth) + 1}-${selectedDay}`);
        setDayStart(formatDate(selectedDayDate));
        setDayEnd(formatDate(selectedDayDate));
        setSelectedDay(formatDateToDay(selectedDayDate));

        // set the selected week to the week that the selected day is in
        weeks.find(week => {
            const [startDay, endDay] = week.split('-');

            if (selectedDay >= startDay && selectedDay <= endDay) {
                setSelectedWeek(week);
                handleWeekChange(selectedYear, selectedMonth, week, selectedDay);
                return true;
            }
        });
        mutate({ startDate: formatDate(selectedDayDate), endDate: formatDate(selectedDayDate), departments: departments });
    };

    const handleWeekChange = (selectedYear, selectedMonth, selectedWeek, selectedDay) => {

        // set the selected week's Year-Month-Day date to the newly selected week
        const [startDay, endDay] = selectedWeek.split('-');
        const startWeekDate = new Date(`${selectedYear}-${months.indexOf(selectedMonth) + 1}-${startDay}`);
        const endWeekDate = new Date(`${selectedYear}-${months.indexOf(selectedMonth) + 1}-${endDay}`);
        setSelectedWeek(formatDateToWeek(startWeekDate, endWeekDate));
        setWeekStart(formatDate(startWeekDate));
        setWeekEnd(formatDate(endWeekDate));

        // set the selected day to the first day of the selected week if it is not within the selected week
        if (selectedDay < startDay || selectedDay > endDay) {
            setSelectedDay(formatDateToDay(startWeekDate));
            handleDayChange(selectedYear, selectedMonth, formatDateToDay(startWeekDate));
        }

        mutate({ startDate: formatDate(startWeekDate), endDate: formatDate(endWeekDate), departments: departments });
    };

    const handleMonthChange = (selectedYear, selectedMonth) => {
        setSelectedMonth(selectedMonth);

        // Generate days based on the selected month
        const daysInMonth = new Date(selectedYear, months.indexOf(selectedMonth) + 1, 0).getDate();
        const newDays = Array.from({ length: daysInMonth }, (_, i) => formatDateToDay(new Date(selectedYear, months.indexOf(selectedMonth), i + 1)));
        setDays(newDays);

        console.log(daysInMonth, newDays)

        // Generate weeks based on the selected month
        const newWeeks = [];
        for (let i = 1; i <= daysInMonth; i += 7) {
            const endWeek = Math.min(i + 6, daysInMonth);
            newWeeks.push(formatDateToWeek(new Date(selectedYear, months.indexOf(selectedMonth), i), new Date(selectedYear, months.indexOf(selectedMonth), endWeek)));
        }
        setWeeks(newWeeks);

        const selectedMonthDate = new Date(`${selectedYear}-${months.indexOf(selectedMonth) + 1}-01`);
        const lastDayOfMonth = new Date(selectedMonthDate.getFullYear(), selectedMonthDate.getMonth() + 1, 0);
        setMonthStart(formatDate(selectedMonthDate));
        setMonthEnd(formatDate(lastDayOfMonth));

        // update the data for the selected month to the newly selected month
        mutate({ startDate: formatDate(selectedMonthDate), endDate: formatDate(lastDayOfMonth), departments: departments });

        handleDayChange(selectedYear, selectedMonth, newDays[0]);
        handleWeekChange(selectedYear, selectedMonth, weeks[0], newDays[0]);
    };

    const handleYearChange = (selectedYear, selectedMonth) => {

        setSelectedYear(selectedYear);
        // convert the year from a number to a Date object
        const selectedYearDate = new Date(selectedYear, months.indexOf(selectedMonth), 1);
        const lastDayOfYear = new Date(selectedYearDate.getFullYear(), 11, 31);
        setYearStart(formatDate(selectedYearDate));
        setYearEnd(formatDate(lastDayOfYear));
        
        // update the data for the selected year to the newly selected year
        mutate({ startDate: formatDate(selectedYearDate), endDate: formatDate(lastDayOfYear), departments: departments });

        // update the days and weeks of the currently selected month for the newly selected year
        handleMonthChange(selectedYear, selectedMonth);
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
        setModalOpen(true);
    };

    const handleCloneLeaderboard = (dayStart, dayEnd, weekStart, weekEnd, monthStart, monthEnd) => {
        // console.log(dayStart, dayEnd, weekStart, weekEnd, monthStart, monthEnd)
        onCloneLeaderboard(dayStart, dayEnd, weekStart, weekEnd, monthStart, monthEnd);
    };

    const isLoading = (data, error) => !data && !error;

    if (dayError || weekError || monthError) {
        console.error(dayError || weekError || monthError);
        return <div className="flex flex-col items-center justify-center w-full h-full text-red-500">Error loading data</div>;
    }

    return (
        <div className="w-full max-w-full 6xl:w-[880px]">
            <QueryPanel query={query} height={height} setHeight={setHeight} handleToggleQuery={handleToggleQuery} handleRemoveQuery={handleRemoveQuery} handleGearIconClick={handleGearIconClick}>
                <div className='flex flex-row gap-2'>
                    <ClosersDateSelector
                        selectedDay={selectedDay}
                        selectedWeek={selectedWeek}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        days={days}
                        weeks={weeks}
                        months={months}
                        years={years}
                        onDayChange={handleDayChange}
                        onWeekChange={handleWeekChange}
                        onMonthChange={handleMonthChange}
                        onYearChange={handleYearChange}
                    />
                    <div>
                        <FiCopy className="w-7 h-7 p-0.5 text-white border shadow-super-3 rounded-md cursor-pointer border-color-white hover:text-blue-700 hover:bg-white" onClick={() => handleCloneLeaderboard(dayStart, dayEnd, weekStart, weekEnd, monthStart, monthEnd)} />
                    </div>
                </div>
            </QueryPanel>
            <AnimateHeight duration={500} height={height}>
                <div id="closers-leaderboard" className="flex flex-col items-center w-full px-2 py-2 mb-2 bg-blue-600 rounded-lg shadow-super-4">
                    <div className="flex flex-col w-full bg-white rounded-lg shadow-super-4">
                        {/* Table Header */}
                        <div className="flex flex-row justify-center py-1 font-bold text-blue-900 bg-gray-100 rounded-t-lg">
                            <div className="w-40"></div>
                            <div className="w-40 text-left ">Highest Close Rate</div>
                            <div className="w-40 text-left ">Most Closed Calls</div>
                            <div className="w-40 text-left ">Most Cash Collected</div>
                        </div>
                        {/* Table Rows */}
                        {[`Day (${selectedDay})`, `Week (${selectedWeek})`, `Month (${selectedMonth})`].map((timeFrame, index) => (
                            <div key={index} className="flex flex-row justify-center px-4 py-1 text-sm text-blue-800 border-t-2 border-blue-300">
                                <div className="w-40 font-semibold ">{timeFrame}</div>
                                {['highestCloseRate', 'mostClosedDiscoveryCalls', 'mostCashCollectedUpFront'].map((kpi, i) => (
                                    <div key={i} className="w-40 text-left ">
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
        </div>
    );
}