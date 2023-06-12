import React, { useEffect, useState } from 'react';
import fetchLeadSources from '../../lib/fetchLeadSources';
import CheckboxDropdown from './CheckboxDropdown';
import ServiceUnavailable from '../ServiceUnavailable';

export default function LeadSourceDropdown({ onOptionSelected, queryId }) {
    const [leadSources, setLeadSources] = useState({});
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isUnavailable, setIsUnavailable] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getLeadSources() {
            try {
                setLoading(true)
                const sources = await fetchLeadSources();
                setLeadSources(sources);
                const leadSourceArray = Object.keys(sources);
                const selectedIds = leadSourceArray.map(option => sources[option]);
                onOptionSelected(selectedIds);
                setSelectedOptions(leadSourceArray);
            } catch (error) {
                console.error(error);
                setIsUnavailable(true);
            }
            setLoading(false);
        }
        getLeadSources();
    }, []);

    const handleOptionSelected = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => leadSources[option]);
        onOptionSelected(selectedIds);
        setSelectedOptions(selectedOptions);
    };

    if (isUnavailable) {
        return <ServiceUnavailable small={true} />;
    }

    return (
        <CheckboxDropdown
            options={Object.keys(leadSources)}
            onOptionSelected={handleOptionSelected}
            selectedOptions={selectedOptions}
            queryId={queryId}
            isSingleSelect={false}
            loading={loading}
        />
    );
}

