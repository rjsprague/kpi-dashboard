"use client";

import React, { useState } from 'react';
import CheckboxDropdown from './CheckboxDropdown';
import ServiceUnavailable from '../ServiceUnavailable';


export default function TeamMemberDropdown({
  teamMemberNames,
  onOptionSelected,
  selectedDepartment,
  selectedTeamMembers,
  queryId,
  isLoadingData
}) {
  const [isUnavailable, setIsUnavailable] = useState(false);

  const selectedOptions = selectedTeamMembers;
  // console.log("selectedTeamMembers in TeamMemberDropdown: ", selectedTeamMembers)
  // console.log("selectedDepartment in TeamMemberDropdown: ", selectedDepartment)
  // console.log("selectedOptions in TeamMemberDropdown: ", selectedOptions)
  // console.log("teamMemberNames in TeamMemberDropdown: ", teamMemberNames)

  if (isUnavailable) {
    return <ServiceUnavailable small={true} />;
  }

  return (
    <CheckboxDropdown
      options={teamMemberNames}
      onOptionSelected={onOptionSelected}
      selectedOptions={selectedOptions}
      queryId={queryId}
      isSingleSelect={false}
      isLoadingData={isLoadingData}
    />
  );
}
