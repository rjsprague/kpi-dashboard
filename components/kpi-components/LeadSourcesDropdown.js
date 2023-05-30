import { useState, useEffect } from "react";
import Dropdown from './Dropdown';
import fetchLeadSources from '../../lib/fetchLeadSources';

function LeadSourcesDropdown({ onOptionSelected, queryId }) {
    const [leadSources, setLeadSources] = useState([]);
    useEffect(() => {
        const fetchSources = async () => {
            const sources = await fetchLeadSources();
            setLeadSources(sources);
        };
        fetchSources();
    }, []);

    const optionDisplayName = (optionValue) => {
        return Object.keys(leadSources).find(key => leadSources[key] === optionValue);
    }

    return leadSources ? (
        <Dropdown
            options={leadSources}
            optionDisplayName={optionDisplayName}
            onOptionSelected={onOptionSelected}
            queryId={queryId}
        />
    ) : null;
}

export default LeadSourcesDropdown;
