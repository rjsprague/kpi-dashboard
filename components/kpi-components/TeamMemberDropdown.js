import { useState, useEffect } from "react";
import Dropdown from './Dropdown';
//import fetchTeamMembers from '../../lib/fetchTeamMembers';

function TeamMemberDropdown(props) {
    const [teamMembers, setTeamMembers] = useState([]);
    
    setTeamMembers[
        {
            "0123456789": "All",
            "1866392814": "Kay Weaver",
        }
    ]

/*    useEffect(() => {
        const fetchSources = async () => {
            const sources = await fetchTeamMembers();
            setTeamMembers(sources);
        };
        fetchSources();
    }, []);
*/
    const optionDisplayName = (optionValue) => {
        // Return the display name for the given option value
        return Object.keys(teamMembers).find(key => teamMembers[key] === optionValue);
    }

    return (
        <Dropdown
            options={teamMembers}
            optionDisplayName={optionDisplayName}
            {...props}
        />
    );
}

export default TeamMemberDropdown;