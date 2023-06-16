import React, { useState, useEffect } from "react";
import DepartmentDropdown from "./DepartmentDropdown";
import TeamMemberDropdown from "./TeamMemberDropdown";

function TeamComponent({ onTeamChange, query, queryId, onDepartmentChange, departments, teamMembers, isLoadingData }) {

    const [selectedDepartment, setSelectedDepartment] = useState();
    const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
    
    useEffect(() => {
        setSelectedDepartment(query.departments);
        setSelectedTeamMembers([teamMembers[query.departments][query.teamMembers]]);
    }, []);

    // console.log("query Team Members in TeamComponent: ", query.teamMembers)
    // console.log("selectedDepartment in TeamComponent: ", selectedDepartment)
    // console.log("selectedTeamMembers in TeamComponent: ", selectedTeamMembers)
    // console.log(teamMembers[query.departments][query.teamMembers])

    const teamMemberNames = Object.values(departments[query.departments]);
    
    //console.log("teamMemberNames in TeamComponent: ", teamMemberNames)

    const handleDepartmentSelected = (department, departments) => {
        
        if (department !== selectedDepartment) {
            setSelectedDepartment(department);
            setSelectedTeamMembers(Object.values(departments[department]));
            onTeamChange(department, Object.keys(departments[department]), queryId);
            onDepartmentChange(department);
        }
    };

    const handleTeamSelected = (teamMemberNames) => {
        // Convert team member names to IDs
        const teamMemberIDs = teamMemberNames.map((name) =>
            Object.keys(departments[selectedDepartment]).find(
                (key) => departments[selectedDepartment][key] === name
            )
        );
        setSelectedTeamMembers(teamMemberNames);
        console.log("teamMemberIDs", teamMemberIDs)
        console.log("selectedTeamMembers", selectedTeamMembers)
        // Pass team member IDs to the parent component handler
        onTeamChange(selectedDepartment, teamMemberIDs, queryId);
    };

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <DepartmentDropdown
                departments={departments}
                onOptionSelected={(department) => handleDepartmentSelected(department, departments)}
                selectedDepartment={selectedDepartment}
                queryId={queryId}
                isLoadingData={isLoadingData}
            />
            {selectedDepartment ? (
                <TeamMemberDropdown
                    teamMemberNames={teamMemberNames}
                    onOptionSelected={(teamMembers) => handleTeamSelected(teamMembers)}
                    selectedDepartment={selectedDepartment}
                    selectedTeamMembers={selectedTeamMembers}
                    queryId={queryId}
                    isLoadingData={isLoadingData}
                />
            ) :
                (
                    <div className="items-center justify-center w-20 h-8 min-w-0 px-2 py-1 text-sm text-center text-white align-middle bg-gray-300 rounded-md sm:w-32 animate-pulse shadow-super-4 max-w-xxs bg-opacity-80">
                        <p>Loading...</p>
                    </div>
                )}
        </div>
    );
}

export default TeamComponent;
