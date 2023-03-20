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
        <div className="relative flex">
            <button
                onClick={toggleDatePicker}
                className="box-border px-1 text-blue-900 transition-colors duration-200 bg-white rounded-md shadow-super-4 hover:bg-blue-50"
            >Select dates</button>
            {showDatePicker && (
                <div className="absolute z-10 translate-y-8">
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
