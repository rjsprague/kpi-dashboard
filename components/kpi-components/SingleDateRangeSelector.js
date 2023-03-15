import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SingleDateRangeSelector({ queryId, onDateRangeChange }) {
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        const [startDate, endDate] = dates;
        console.log("startDate:", startDate, "endDate:", endDate);
        if (startDate && endDate) {
            onDateRangeChange(startDate, endDate, queryId);
        }
    };

    const toggleDatePicker = () => {
        setShowDatePicker((prevShowDatePicker) => !prevShowDatePicker);
    };

    return (
        <div style={{ position: "relative" }}>
            <button onClick={toggleDatePicker}>Select dates</button>
            {showDatePicker && (
                <div style={{ position: "absolute", zIndex: 10 }}>
                    <DatePicker
                        onChange={handleDateRangeChange}
                        startDate={dateRange[0]}
                        endDate={dateRange[1]}
                        selectsRange
                        inline
                    />
                </div>
            )}
        </div>
    );
}

export default SingleDateRangeSelector;
