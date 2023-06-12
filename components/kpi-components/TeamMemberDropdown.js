import React, { useState, useEffect } from 'react';
import CheckboxDropdown from './CheckboxDropdown';
import fetchActiveTeamMembers from '../../lib/fetchActiveTeamMembers';
import ServiceUnavailable from '../ServiceUnavailable';


export default function TeamMemberDropdown({ onOptionSelected, selectedDepartment, selectedTeamMembers, queryId }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    async function getTeamMembers() {
      try {
        setLoading(true);
        const members = await fetchActiveTeamMembers();
        const membersObject = {};

        for (const id in members[selectedDepartment]) {
          membersObject[members[selectedDepartment][id]] = id;
        }
        setTeamMembers(membersObject);
        const teamMemberArray = Object.keys(membersObject);
        setSelectedOptions(teamMemberArray);
        onOptionSelected(teamMemberArray.map((option) => parseInt(membersObject[option])));
      } catch (error) {
        console.error(error);
        setIsUnavailable(true);
      }
      setLoading(false);
    }
    getTeamMembers();
  }, [selectedDepartment]);

  const teamMemberArray = Object.keys(teamMembers);

  const handleOptionSelected = (selectedOptions) => {
    const selectedIds = selectedOptions.map((option) => parseInt(teamMembers[option]));
    setSelectedOptions(selectedOptions);
    onOptionSelected(selectedIds);
  };

  if (isUnavailable) {
    return <ServiceUnavailable small={true} />;
  }

  return (
    <CheckboxDropdown
      options={teamMemberArray}
      onOptionSelected={handleOptionSelected}
      selectedOptions={selectedOptions}
      queryId={queryId}
      isSingleSelect={false}
      loading={loading}
    />
  );
}
