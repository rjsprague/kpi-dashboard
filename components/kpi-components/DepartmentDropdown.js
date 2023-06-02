import { useState, useEffect } from "react";
import Dropdown from './Dropdown';
import fetchActiveTeamMembers from "../../lib/fetchActiveTeamMembers";
import ServiceUnavailable from '../ServiceUnavailable';

function DepartmentDropdown({ onOptionSelected, queryId }) {
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

    return (
        <Dropdown
            options={departments}
            onOptionSelected={handleOptionSelected}
            queryId={queryId}
        />
    );
}

export default DepartmentDropdown;