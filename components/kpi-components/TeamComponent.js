import React, { useState, useEffect } from "react";
import DepartmentDropdown from "./DepartmentDropdown";
import TeamMemberDropdown from "./TeamMemberDropdown";

function TeamComponent({ onTeamChange, queryId }) {
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);

    const handleTeamSelected = (department, teamMembers) => {
        setSelectedDepartment(department);
        setSelectedTeamMembers(teamMembers);

        // Call handleTeamChange from KpiQueryContainer.js
        onTeamChange(department, teamMembers, queryId);
    };

    return (
        <div className="flex flex-row gap-4">
            <DepartmentDropdown
                onOptionSelected={(department) => handleTeamSelected(department, selectedTeamMembers)}
                selectedDepartment={selectedDepartment}
                queryId={queryId}
            />
            {selectedDepartment ? (
                <TeamMemberDropdown
                    onOptionSelected={(teamMembers) => handleTeamSelected(selectedDepartment, teamMembers)}
                    selectedDepartment={selectedDepartment}
                    selectedTeamMembers={selectedTeamMembers}
                    queryId={queryId}
                />
            ) :
                (
                    <div className="items-center justify-center w-40 h-8 min-w-0 px-2 py-1 text-sm text-center text-white align-middle bg-gray-300 rounded-md animate-pulse shadow-super-4 max-w-xxs bg-opacity-80">
                        <p>Loading...</p>
                    </div>
                )}
        </div>
    );
}

export default TeamComponent;
