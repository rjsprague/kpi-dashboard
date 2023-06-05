import React, { useEffect, useState } from 'react';
import fetchLeadSources from '../../lib/fetchLeadSources';
import CheckboxDropdown from './CheckboxDropdown';
import ServiceUnavailable from '../ServiceUnavailable';

export default function LeadSourceDropdown({ onOptionSelected, queryId }) {
    const [leadSources, setLeadSources] = useState({});
    const [isUnavailable, setIsUnavailable] = useState(false);

    useEffect(() => {
        async function getLeadSources() {
            try {
                const sources = await fetchLeadSources();
                setLeadSources(sources);
            } catch (error) {
                console.error(error);
                setIsUnavailable(true);
            }
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

    if (isUnavailable) {
        return <ServiceUnavailable small={true} />;
    }

    return (
        <CheckboxDropdown
            options={leadSourceArray}
            onOptionSelected={handleOptionSelected}
            selectedOptions={null}
            queryId={queryId}
            isSingleSelect={false}
        />
    );
}
