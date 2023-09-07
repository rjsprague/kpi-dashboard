import { Listbox } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { getDatePresets } from '../../lib/date-utils';


const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const ClosersDateSelector = ({ onDayChange, onWeekChange, onMonthChange }) => {
    const today = getDatePresets().Today;
    const thisWeek = getDatePresets()['Current Week'];
    const thisMonth = getDatePresets()["Current Month"];

    const [selectedMonth, setSelectedMonth] = useState(months[thisMonth.startDate.getMonth()]);
    const [days, setDays] = useState([]);
    const [weeks, setWeeks] = useState([]);
    const [selectedDay, setSelectedDay] = useState(today);
    const [selectedWeek, setSelectedWeek] = useState(thisWeek);

    useEffect(() => {
        // Generate days based on the selected month
        const daysInMonth = new Date(2023, months.indexOf(selectedMonth) + 1, 0).getDate();
        const newDays = Array.from({ length: daysInMonth }, (_, i) => `${selectedMonth} ${String(i + 1).padStart(2, '0')}`);
        setDays(newDays);
        setSelectedDay(newDays[0]);
        onDayChange(newDays[0]);

        // Generate weeks based on the selected month
        const newWeeks = [];
        for (let i = 1; i <= daysInMonth; i += 7) {
            const endWeek = Math.min(i + 6, daysInMonth);
            newWeeks.push(`${selectedMonth} ${String(i).padStart(2, '0')}-${String(endWeek).padStart(2, '0')}`);
        }
        setWeeks(newWeeks);
        setSelectedWeek(newWeeks[0]);
        onWeekChange(newWeeks[0]);
    }, [selectedMonth]);

    const handleDaySelection = (e) => {
        setSelectedDay(e.target.value);
        onDayChange(e.target.value);
    };

    const handleWeekSelection = (e) => {
        setSelectedWeek(e.target.value);
        onWeekChange(e.target.value);
    };

    const handleMonthSelection = (e) => {
        setSelectedMonth(e.target.value);
        onMonthChange(e.target.value);
    };

    return (
        <div className="flex flex-row flex-wrap items-center justify-center gap-2">
            <Listbox as="div" className="flex flex-row items-center justify-center gap-2">
                {/* Month Selector */}
                <Listbox.Label>Month:</Listbox.Label>
                <Listbox.Button className="text-black" as="select" onChange={handleMonthSelection} value={selectedMonth}>
                    {months.map((month, index) => (
                        <option className="text-black" key={index} value={month}>{month}</option>
                    ))}
                </Listbox.Button>
            </Listbox>

            <Listbox as="div" className="flex flex-row items-center justify-center gap-2">
                {/* Day Selector */}
                <Listbox.Label>Day:</Listbox.Label>
                <Listbox.Button className="text-black" as="select" onChange={handleDaySelection}>
                    {days.map((day, index) => (
                        <option className="text-black" key={index} value={day}>{day}</option>
                    ))}
                </Listbox.Button>
            </Listbox>

            <Listbox as="div" className="flex flex-row items-center justify-center gap-2">
                {/* Week Selector */}
                <Listbox.Label>Week:</Listbox.Label>
                <Listbox.Button className="text-black" as="select" onChange={handleWeekSelection}>
                    {weeks.map((week, index) => (
                        <option className="text-black" key={index} value={week}>{week}</option>
                    ))}
                </Listbox.Button>
            </Listbox>
        </div>
    );
};

export default ClosersDateSelector;
