import { useState, useEffect } from "react";
import Dropdown from './Dropdown';
import fetchLeadSources from '../../lib/fetchLeadSources';

function LeadSourcesDropdown(props) {
    const [leadSources, setLeadSources] = useState([]);
    
    useEffect(() => {
        const fetchSources = async () => {
            const sources = await fetchLeadSources();
            setLeadSources(sources);
        };
        fetchSources();
    }, []);

    const optionDisplayName = (optionValue) => {
        // Return the display name for the given option value
        return Object.keys(leadSources).find(key => leadSources[key] === optionValue);
    }

    return leadSources ? (
        <Dropdown
            options={leadSources}
            fetchOptions={fetchLeadSources}
            optionDisplayName={optionDisplayName}
            {...props}
        />
    ) : null;
}

export default LeadSourcesDropdown;
