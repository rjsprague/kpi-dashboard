import { useState, useEffect } from "react";
import CheckboxDropdown from './CheckboxDropdown';
import fetchActiveTeamMembers from "../../lib/fetchActiveTeamMembers";
import ServiceUnavailable from '../ServiceUnavailable';

function DepartmentDropdown({ onOptionSelected, selectedDepartment, queryId }) {
    const [departments, setDepartments] = useState([]);
    const [isUnavailable, setIsUnavailable] = useState(false);

    useEffect(() => {
        async function fetchDepartments() {
            try {
                const data = await fetchActiveTeamMembers();
                const departments = Object.keys(data);
                //console.log("departments", departments)
                setDepartments(departments);
            } catch (error) {
                console.error(error);
                setIsUnavailable(true);
            }
        }
        fetchDepartments();
    }, []);

    const handleOptionSelected = (selectedOptions) => {
        onOptionSelected(selectedOptions);
    };

    if (isUnavailable) {
        return <ServiceUnavailable small={true} />;
    }

    console.log("departments", departments)

    return (
        <CheckboxDropdown
            options={departments}
            onOptionSelected={handleOptionSelected}
            selectedOptions={selectedDepartment}
            queryId={queryId}
            isSingleSelect={true}
        />
    );
}

export default DepartmentDropdown;