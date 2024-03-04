"use client";

import { useState, useEffect, useRef } from "react";
import { getDatePresets, getWeekRange } from "../../lib/date-utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Transition } from "react-transition-group";
import DropdownButton from "./DropdownButton";

function SingleDateRangeSelector({ queryId, onDateRangeChange, selectedDateRange }) {
    const [datePresets, setDatePresets] = useState(getDatePresets());
    const [dateRange, setDateRange] = useState(selectedDateRange);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const datePickerContentRef = useRef(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);

    // console.log("selectedDateRange", selectedDateRange)
    // console.log("dateRange", dateRange)
    // console.log("showDatePicker", showDatePicker)

    useEffect(() => {
        setDateRange(selectedDateRange);
    }, [selectedDateRange]);

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

    const handleWeekSelect = (year, weekNumber) => {
        const range = getWeekRange(year, weekNumber);
        onDateRangeChange(range.startDate, range.endDate, queryId);
        setDateRange({ gte: range.startDate, lte: range.endDate });
    };

    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if (start && end) {
            onDateRangeChange(start, end, queryId);
            setDateRange({ gte: start, lte: end });
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

    const duration = 150;
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
        <div className="relative text-xs sm:text-sm bg-opacity-80 date-picker">
            <div className="flex flex-row items-center justify-between gap-2 w-50 md:w-full">
                <div className="flex text-md">Date:</div>
                <DropdownButton onClick={toggleDatePicker} isOpen={showDatePicker}>
                    <div className="truncate">
                        {dateRange && dateRange.gte instanceof Date && !isNaN(dateRange.gte) && dateRange.gte === datePresets['All Time'].startDate ? 'All Time' :
                            dateRange && dateRange.gte instanceof Date && !isNaN(dateRange.gte) && dateRange.lte && dateRange.gte.toLocaleDateString() === dateRange.lte?.toLocaleDateString() ? dateRange.gte?.toLocaleDateString() :
                                dateRange && dateRange.gte instanceof Date && !isNaN(dateRange.gte) && dateRange.lte instanceof Date && !isNaN(dateRange.lte) ? `${dateRange.gte.toLocaleDateString()} - ${dateRange.lte.toLocaleDateString()}`
                                    : "Select Date Range"}
                    </div>
                </DropdownButton>
            </div>
            <Transition in={showDatePicker} timeout={duration}>
                {(state) => (
                    <div
                        ref={datePickerContentRef}
                        className={` absolute md:-left-40 flex-1 mx-auto  z-50 flex w-72 sm:w-100 flex-col sm:flex-row  bg-blue-900 rounded-md bg-opacity-80 shadow-super-4`}
                        style={{
                            ...defaultStyle,
                            ...transitionStyles[state],
                            maxHeight: "370px", // Limit the height of the dropdown
                            overflowY: "auto", // Enable scrolling if the content is too long
                        }}
                    >
                        <div className="flex flex-row flex-wrap mt-2 mb-2 ml-2 sm:overflow-y-scroll">
                            {Object.entries(datePresets).map(([key, preset], index) => (
                                <button
                                    key={index}
                                    className="w-32 px-2 py-0 mb-0.5 border-b text-left text-white hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                                    onClick={() => onChange([preset.startDate, preset.endDate])}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                        <div className="p-2">
                            <div className="flex flex-row gap-2 pb-2">
                                <label>Year:</label>
                                <input type="number" defaultValue={new Date().getFullYear()} id="year-input" className="px-1 text-blue-900 w-13" />
                                <label>Week:</label>
                                <select onChange={(e) => handleWeekSelect(document.getElementById('year-input').value, e.target.value)} className="text-blue-900">
                                    {Array.from({ length: 53 }, (_, i) => i + 1).map((weekNumber) => (
                                        <option key={weekNumber} value={weekNumber}>
                                            {weekNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <DatePicker
                                key={queryId}
                                onChange={onChange}
                                startDate={startDate}
                                endDate={endDate}
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
