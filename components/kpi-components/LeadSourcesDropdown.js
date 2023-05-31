import React, { useEffect, useState } from 'react';
import fetchLeadSources from '../../lib/fetchLeadSources';
import Dropdown from './Dropdown';

export default function LeadSourceDropdown({ onOptionSelected }) {
    const [leadSources, setLeadSources] = useState({});

    useEffect(() => {
        async function getLeadSources() {
            const sources = await fetchLeadSources();
            setLeadSources(sources);
        }
        getLeadSources();
    }, []);

    const leadSourceArray = Object.keys(leadSources);

    const handleOptionSelected = (selectedOptions) => {
        // Here, selectedOptions is an array of selected option names
        // We convert this array back to an array of IDs
        const selectedIds = selectedOptions.map(option => leadSources[option]);
        onOptionSelected(selectedIds);
    };

    return (
        <Dropdown options={leadSourceArray} onOptionSelected={handleOptionSelected} />
    );
}
