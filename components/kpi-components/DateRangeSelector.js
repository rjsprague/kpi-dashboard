import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DateRangeSelector({ queryId, onDateRangeChange }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    onDateRangeChange(startDate, endDate, queryId);
  }, [startDate, endDate]);

  return (
    <div>
      <label>Start date:</label>
      <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />

      <label>End date:</label>
      <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
    </div>
  );
}

export default DateRangeSelector;
