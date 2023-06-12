import React, { useState, useEffect } from "react";
import DepartmentDropdown from "./DepartmentDropdown";
import TeamMemberDropdown from "./TeamMemberDropdown";
import fetchActiveTeamMembers from "../../lib/fetchActiveTeamMembers";

function TeamComponent({ onTeamChange, queryId, onDepartmentChange }) {
    const [selectedDepartment, setSelectedDepartment] = useState(['Lead Manager']);
    const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
    const [departments, setDepartments] = useState([]);

    // console.log("selectedDepartment", selectedDepartment)
    // console.log("selectedTeamMembers", selectedTeamMembers)

    useEffect(() => {
        const getDepartments = async () => {
            try {
                const data = await fetchActiveTeamMembers();
                setDepartments(data);
            } catch (error) {
                console.error(error);
            }
        };
        getDepartments();
    }, []);

    //console.log(Object.keys(departments[selectedDepartment]))

    const handleDepartmentSelected = (department, departments) => {        
        if (department !== selectedDepartment) {
            setSelectedDepartment(department);
            setSelectedTeamMembers(Object.keys(departments[selectedDepartment]))
            onTeamChange(department, [], queryId);
            onDepartmentChange(department);
        }        
    };

    const handleTeamSelected = (teamMembers) => {
        if (teamMembers !== selectedTeamMembers) {
            setSelectedTeamMembers(teamMembers);
            onTeamChange(selectedDepartment, teamMembers, queryId);
        }
    };



    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <DepartmentDropdown
                onOptionSelected={(department) => handleDepartmentSelected(department, departments)}
                selectedDepartment={selectedDepartment}
                queryId={queryId}
                defaultOption={selectedDepartment}
            />
            {selectedDepartment ? (
                <TeamMemberDropdown
                    onOptionSelected={(teamMembers) => handleTeamSelected(teamMembers)}
                    selectedDepartment={selectedDepartment}
                    defaultDepartment={selectedDepartment}
                    selectedTeamMembers={selectedTeamMembers}
                    queryId={queryId}
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
