import { useState } from "react";
import CheckboxDropdown from './CheckboxDropdown';

function DepartmentDropdown({ departments, onOptionSelected, selectedDepartment, queryId, isLoadingData }) {
    
    console.log("departments", departments)
    console.log("selectedDepartment", selectedDepartment)
    const departmentsArray = Object.keys(departments);

    
    console.log("departments", departmentsArray)

    return (
        <CheckboxDropdown
            options={departmentsArray}
            onOptionSelected={onOptionSelected}
            selectedOptions={selectedDepartment}
            queryId={queryId}
            isSingleSelect={true}
            isLoadingData={isLoadingData}
        />
    );
}

export default DepartmentDropdown;