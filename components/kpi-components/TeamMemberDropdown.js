import React, { useEffect, useState } from 'react';
import fetchActiveTeamMembers from '../../lib/fetchActiveTeamMembers';
import CheckboxDropdown from './CheckboxDropdown';
import ServiceUnavailable from '../ServiceUnavailable';

export default function TeamMemberDropdown({ onOptionSelected, selectedDepartment, selectedTeamMembers, queryId }) {
  const [teamMembers, setTeamMembers] = useState({});
  const [isUnavailable, setIsUnavailable] = useState(false);

  useEffect(() => {
    async function getTeamMembers() {
      try {
        const members = await fetchActiveTeamMembers();
        const membersObject = {};

        for (const id in members[selectedDepartment]) {
          membersObject[members[selectedDepartment][id]] = id;
        }
        setTeamMembers(membersObject);
      } catch (error) {
        console.error(error);
        setIsUnavailable(true);
      }
    }
    getTeamMembers();
  }, [selectedDepartment]); // Add selectedDepartment as a dependency

  const teamMemberArray = Object.keys(teamMembers);

  const handleOptionSelected = (selectedOptions) => {
    const selectedIds = selectedOptions.map((option) => parseInt(teamMembers[option]));
    onOptionSelected(selectedIds);
  };


  if (isUnavailable) {
    return <ServiceUnavailable small={true} />;
  }

  return (
    <CheckboxDropdown
      options={teamMemberArray}
      onOptionSelected={handleOptionSelected}
      selectedOptions={selectedTeamMembers}
      queryId={queryId}
      isSingleSelect={true}
    />
  );
}