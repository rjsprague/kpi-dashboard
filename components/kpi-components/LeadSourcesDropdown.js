import React, { useState } from 'react';
import CheckboxDropdown from './CheckboxDropdown';
import ServiceUnavailable from '../ServiceUnavailable';

export default function LeadSourceDropdown({ onOptionSelected, queryId, leadSources, loading, isUnavailable }) {
    const [selectedOptions, setSelectedOptions] = useState(Object.keys(leadSources));

    console.log("lead sources dropdown: ", leadSources)

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
