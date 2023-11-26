"use client"

import React, { useEffect, useState } from 'react';
import UniversalDropdown from './UniversalDropdown';
import DropdownButton from './DropdownButton';

function TeamComponent({ onTeamChange, query, queryId, onDepartmentChange, departments, isLoadingData, isProfessional, isStarter }) {
    const [selectedDepartment, setSelectedDepartment] = useState(query.departments);
    const [selectedTeamMembers, setSelectedTeamMembers] = useState(query.teamMembers);

    useEffect(() => {
        setSelectedDepartment(query.departments);
        if (isProfessional || isStarter) {
            setSelectedTeamMembers(query.teamMembers);
            return;
        }
        // if there are no team members selected from the current department select all team members from the new department
        if (query.teamMembers.length > 0 && query.teamMembers.filter((id) => departments[query.departments[0]][id]).length === 0) {
            // console.log("no team members selected")
            onTeamChange(queryId, query.departments, Object.keys(departments[query.departments[0]]));
        }

    }, [query, query.departments]);

    useEffect(() => {
        if (isProfessional || isStarter) {
            return;
        }
        // check if selected team members are in the selected department
        const teamMembers = query.teamMembers.length > 0 ? query.teamMembers.filter(id => departments[query.departments[0]][id]) : [];
        const teamMemberNames = teamMembers.map(id => getTeamMemberNameById(id));
        setSelectedTeamMembers(teamMemberNames);
    }, [query, query.teamMembers, query.departments, departments]);

    const handleDepartmentSelected = (department) => {
        onDepartmentChange(department);
        onTeamChange(queryId, department, Object.keys(departments[department]));
    };

    const handleTeamSelected = (teamMembers) => {
        onTeamChange(queryId, selectedDepartment, teamMembers.map(name => getTeamMemberIdByName(name)));
    };

    const getTeamMemberNameById = (id) => {
        for (let department in departments) {
            if (departments[department][id]) {
                return departments[department][id];
            }
        }
        return null;
    };

    const getTeamMemberIdByName = (name) => {
        for (let department in departments) {
            for (let id in departments[department]) {
                if (departments[department][id] === name) {
                    return id;
                }
            }
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <UniversalDropdown
                options={Object.keys(departments)}
                onOptionSelected={handleDepartmentSelected}
                selectedOptions={selectedDepartment ? [selectedDepartment] : []}
                queryId={queryId}
                isSingleSelect={true}
                isLoadingData={isLoadingData}
                ButtonComponent={DropdownButton}
            />
            {selectedDepartment && departments[selectedDepartment] && (
                <UniversalDropdown
                    options={Object.values(departments[selectedDepartment])}
                    onOptionSelected={handleTeamSelected}
                    selectedOptions={selectedTeamMembers}
                    queryId={queryId}
                    isSingleSelect={false}
                    isLoadingData={isLoadingData}
                    ButtonComponent={DropdownButton}
                />
            )}
        </div>
    );
}

export default TeamComponent;
