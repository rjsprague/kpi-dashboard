import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SingleDateRangeSelector({ queryId, onDateRangeChange }) {
    const [dateRange, setDateRange] = useState([null, null]);
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

    const datePresets = [
        {
            label: "Yesterday",
            range: () => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                return [yesterday, yesterday];
            },
        },
        {
            label: "7 days",
            range: () => {
                const today = new Date();
                const lastWeek = new Date();
                lastWeek.setDate(today.getDate() - 6);
                return [lastWeek, today];
            },
        },
        {
            label: "30 days",
            range: () => {
                const today = new Date();
                const lastMonth = new Date();
                lastMonth.setDate(today.getDate() - 29);
                return [lastMonth, today];
            },
        },
        {
            label: "Quarter",
            range: () => {
                const today = new Date();
                const startOfQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
                const endOfQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 + 3, 0);
                return [startOfQuarter, endOfQuarter];
            },
        },
        {
            label: "Year",
            range: () => {
                const today = new Date();
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                const endOfYear = new Date(today.getFullYear(), 11, 31);
                return [startOfYear, endOfYear];
            },
        },
        {
            label: "Today",
            range: () => {
                const today = new Date();
                return [today, today];
            },
        },
        {
            label: "Current Week",
            range: () => {
                const today = new Date();
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                return [startOfWeek, today];
            },
        },
        {
            label: "Current Month",
            range: () => {
                const today = new Date();
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                return [startOfMonth, today];
            },
        },
        {
            label: "Current Quarter",
            range: () => {
                const today = new Date();
                const startOfQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
                return [startOfQuarter, today];
            },
        },
        {
            label: "Current Year",
            range: () => {
                const today = new Date();
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                return [startOfYear, today];
            },
        },
        {
            label: "All Time",
            range: () => {
                const today = new Date();
                const startOfAllTime = new Date(1970, 0, 1);
                return [startOfAllTime, today];
            },
        },
    ];
    

    return (
        <div className="relative flex date-picker">
            <button
                onClick={toggleDatePicker}
                className="box-border px-2 py-1 text-blue-900 transition-colors duration-200 bg-white rounded-md shadow-super-4 hover:bg-blue-50"
            >
                {dateRange[0] && dateRange[1]
                    ? `${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`
                    : "Select Date Range"}
            </button>
            {showDatePicker && (
                <div className="absolute z-10 flex flex-row translate-y-8 bg-white rounded-md shadow-super-4">
                    <div className="mt-2 mb-3 ml-2 border border-gray-200 rounded">
                        {datePresets.map((preset, index) => (
                            <button
                                key={index}
                                className="w-32 px-2 py-0 mb-0.5 border-b text-left text-blue-900 hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                                onClick={() => handleDateRangeChange(preset.range())}
                            >
                                {preset.label}
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
