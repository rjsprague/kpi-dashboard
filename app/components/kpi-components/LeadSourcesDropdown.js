"use client";

import React, { useEffect, useState } from 'react';
import UniversalDropdown from './UniversalDropdown';
import ServiceUnavailable from '../ServiceUnavailable';
import DropdownButton from './DropdownButton';


export default function LeadSourceDropdown({ onOptionSelected, selectedLeadsources, queryId, leadSources, isLoadingData, isUnavailable }) {
    const [selectedOptions, setSelectedOptions] = useState(Object.keys(leadSources));
    const allsourcesLabel = "Lead Sources";

    // console.log(leadSources)
    // console.log(selectedLeadsources)

    useEffect(() => {
        const leadSourcesObj = {};
        Object.entries(leadSources).forEach(([name, id]) => {
            leadSourcesObj[id] = name;
        });
        let selectedOptionNames = selectedLeadsources.map(id => leadSourcesObj[id])
        setSelectedOptions(selectedOptionNames);
    }, [selectedLeadsources, leadSources])


    const handleOptionSelected = (selectedOptionsNames) => {
        // console.log(selectedOptionsNames)
        const selectedIds = selectedOptionsNames.map(option => leadSources[option]);
        if (selectedIds.length === 0) {
            onOptionSelected(queryId, []);
        } else {
            onOptionSelected(queryId, selectedIds);
        }
    };

    if (isUnavailable) {
        return <ServiceUnavailable small={true} />;
    }

    return (
        <UniversalDropdown
            options={Object.keys(leadSources)}
            onOptionSelected={handleOptionSelected}
            selectedOptions={selectedOptions}
            queryId={queryId}
            isSingleSelect={false}
            isLoadingData={isLoadingData}
            ButtonComponent={DropdownButton}
            className={""}
            label={allsourcesLabel}
        />
    );
}
