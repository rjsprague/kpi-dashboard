"use client";
import React, { useState } from 'react';
import CheckboxDropdown from './CheckboxDropdown';
import LoadingIcon from "../LoadingIcon";

export default function TeamMemberDropdown({
  teamMemberNames,
  onOptionSelected,
  selectedTeamMembers,
  queryId,
  isLoadingData
}) {

  if(isLoadingData) <LoadingIcon />;
  

  return (
    <CheckboxDropdown
      options={teamMemberNames}
      onOptionSelected={onOptionSelected}
      selectedOptions={selectedTeamMembers}
      queryId={queryId}
      isSingleSelect={false}
      isLoadingData={isLoadingData}
    />
  );
}
