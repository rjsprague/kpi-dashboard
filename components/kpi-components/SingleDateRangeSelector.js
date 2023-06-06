import { useState, useEffect, useRef } from "react";
import { getDatePresets } from "../../lib/date-utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Transition } from "react-transition-group";
//import { fetchEarliestLeadDate } from "../../lib/api-utils";

function SingleDateRangeSelector({ queryId, onDateRangeChange }) {
    //const [fetchedEarliestDate, setFetchedEarliestDate] = useState(null);
    const [datePresets, setDatePresets] = useState(getDatePresets());
    const [dateRange, setDateRange] = useState([datePresets["All Time"].startDate, datePresets["All Time"].endDate]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const datePickerContentRef = useRef(null);

    useEffect(() => {
        if (showDatePicker) {
            const contentElement = datePickerContentRef.current;
            if (contentElement) {
                setContentHeight(contentElement.scrollHeight);
            }
        } else {
            setContentHeight(0);
        }
    }, [showDatePicker]);

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

    const duration = 300;
    const defaultStyle = {
        transition: `height ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
        height: 0,
        opacity: 0,
        visibility: "hidden",
        overflow: "hidden",
    };

    const transitionStyles = {
        entering: { height: 0, opacity: 1, visibility: "visible" },
        entered: { height: contentHeight, opacity: 1, visibility: "visible" },
        exiting: { height: 0, opacity: 1, visibility: "visible" },
        exited: { height: 0, opacity: 0, visibility: "hidden" },
    };

    return (
        <div className="relative flex text-sm bg-opacity-80 date-picker">
            <button
                onClick={toggleDatePicker}
                className="box-border w-32 px-2 py-1 mx-2 text-white transition-colors duration-200 bg-blue-900 rounded-md sm:h-8 sm:w-40 shadow-super-4 hover:bg-blue-50"
            >
                {dateRange && dateRange[0] instanceof Date && !isNaN(dateRange[0]) && dateRange[0] === datePresets['All Time'].startDate ? 'All Time' :
                    dateRange && dateRange[0] instanceof Date && !isNaN(dateRange[0]) && dateRange[1] && dateRange[0].toLocaleDateString() === dateRange[1]?.toLocaleDateString() ? dateRange[0]?.toLocaleDateString() :
                        dateRange && dateRange[0] instanceof Date && !isNaN(dateRange[0]) && dateRange[1] instanceof Date && !isNaN(dateRange[1]) ? `${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`
                            : "Select Date Range"}
            </button>
            <Transition in={showDatePicker} timeout={duration}>
                {(state) => (
                    <div
                        ref={datePickerContentRef}
                        className={`absolute -right-10 xl:left-2 h-full z-50 flex w-72 sm:w-100 flex-col sm:flex-row translate-y-9 bg-blue-900 rounded-md bg-opacity-80 shadow-super-4`}
                        style={{
                            ...defaultStyle,
                            ...transitionStyles[state],
                            maxHeight: "320px", // Limit the height of the dropdown
                            overflowY: "auto", // Enable scrolling if the content is too long
                        }}
                    >
                        <div className="flex flex-row flex-wrap mt-2 mb-2 ml-2 sm:overflow-y-scroll sm:overflow-x-hidden">
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
                                key={`${dateRange[0]}-${dateRange[1]}`}
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
            </Transition>
        </div>
    );
}

export default SingleDateRangeSelector;
