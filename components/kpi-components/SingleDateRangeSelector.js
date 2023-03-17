import { useState } from "react";
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
        }
    };

    const toggleDatePicker = () => {
        setShowDatePicker((prevShowDatePicker) => !prevShowDatePicker);
    };

    return (
        <div style={{ position: "relative" }}>
            <button
                onClick={toggleDatePicker}
                className="box-border px-4 text-blue-900 transition-colors duration-200 bg-gray-200 rounded-md ring-offset-4 ring-offset-teal-100 shadow-super-4 hover:bg-gray-100"
            >Select dates</button>
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
