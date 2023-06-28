"use client";

import React, { useState } from 'react';
import CheckboxDropdown from './CheckboxDropdown';
import ServiceUnavailable from '../ServiceUnavailable';

export default function LeadSourceDropdown({ onOptionSelected, queryId, leadSources, isLoadingData, isUnavailable}) {
    const [selectedOptions, setSelectedOptions] = useState(Object.keys(leadSources));

    //console.log("lead sources dropdown: ", leadSources)

    const handleOptionSelected = (selectedOptions) => {
        console.log("selected options: ", selectedOptions)
        const selectedIds = selectedOptions.map(option => leadSources[option]);
        console.log("selected ids: ", selectedIds)
        onOptionSelected(selectedIds, queryId);
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
            isLoadingData={isLoadingData}
        />
    );
}
