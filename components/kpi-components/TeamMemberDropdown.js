import { useState, useEffect } from "react";
import fetchActiveTeamMembers from '../../lib/fetchActiveTeamMembers';
import Dropdown from './Dropdown';

function TeamMemberDropdown({ onOptionSelected, queryId }) {
    const [options, setOptions] = useState([]);
    useEffect(() => {
        const fetchOptions = async () => {
            const teamMembers = await fetchActiveTeamMembers();
            setOptions(teamMembers);
        };
        fetchOptions();
    }, []);

    return (
        <Dropdown
            options={options}
            onOptionSelected={onOptionSelected}
            queryId={queryId}
        />
    );
}

export default TeamMemberDropdown;