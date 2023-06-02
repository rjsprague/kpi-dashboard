import React, { useState } from "react";
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
            />
            {selectedDepartment ? (
                <TeamMemberDropdown
                    onOptionSelected={(teamMembers) => handleTeamSelected(selectedDepartment, teamMembers)}
                    selectedDepartment={selectedDepartment}
                />
            ) : 
            (
                <div className="bg-gray-300 animate-pulse">
                    <p>Loading...</p>
                </div>
            )}
        </div>
    );
}

export default TeamComponent;
