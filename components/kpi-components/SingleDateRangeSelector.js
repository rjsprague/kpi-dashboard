import { useState, useEffect } from "react";
import { getDatePresets } from "../../lib/date-utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SingleDateRangeSelector({ queryId, onDateRangeChange }) {
    const datePresets = getDatePresets();
    const defaultDateRange = [datePresets['All Time'].startDate, datePresets['All Time'].endDate];
    const [dateRange, setDateRange] = useState(defaultDateRange);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        const [startDate, endDate] = dates;
        if (startDate && endDate) {
            onDateRangeChange(startDate, endDate, queryId);
            toggleDatePicker();
        }
    };

    const toggleDatePicker = () => {
        setShowDatePicker((prevShowDatePicker) => !prevShowDatePicker);
    };

    useEffect(() => {
        const handleClickOutsideDatePicker = (event) => {
            if (!event.target.closest(".date-picker")) {
                setShowDatePicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutsideDatePicker);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideDatePicker);
        };
    }, []);    

    return (
        <div className="relative flex text-sm bg-opacity-80 date-picker">
            <button
                onClick={toggleDatePicker}
                className="box-border w-40 h-8 px-2 py-1 text-white transition-colors duration-200 bg-blue-900 rounded-md shadow-super-4 hover:bg-blue-50"
            >
                {dateRange[0]?.toLocaleDateString() === '1/1/1970' ? 'All Time' :
                    dateRange[0]?.toLocaleDateString() === dateRange[1]?.toLocaleDateString() ? dateRange[0]?.toLocaleDateString() :
                        dateRange[0] && dateRange[1] ? `${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`
                            : "Select Date Range"}
            </button>
            {showDatePicker && (
                <div className="absolute z-10 flex flex-row translate-y-8 bg-blue-900 rounded-md bg-opacity-80 shadow-super-4 min-h-70 h-78">
                    <div className="mt-2 mb-3 ml-2 overflow-y-scroll">
                        {Object.entries(datePresets).map(([key, preset], index) => (
                            <button
                                key={index}
                                className="w-32 px-2 py-0 mb-0.5 border-b text-left text-white hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                                onClick={() => handleDateRangeChange([preset.startDate, preset.endDate])}
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                    <div className="p-2">
                        <DatePicker
                            onChange={handleDateRangeChange}
                            startDate={dateRange[0]}
                            endDate={dateRange[1]}
                            selectsRange
                            inline
                            showMonthDropdown
                            showYearDropdown
                        />
                    </div>

                </div>
            )}
        </div>
    );
}

export default SingleDateRangeSelector;
