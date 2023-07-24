"use client"

import React, { useEffect, useState } from 'react';
import UniversalDropdown from './UniversalDropdown';
import DropdownButton from './DropdownButton';

function TeamComponent({ onTeamChange, query, queryId, onDepartmentChange, departments, isLoadingData }) {
    const [selectedDepartment, setSelectedDepartment] = useState(query.departments);
    const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
    
    useEffect(() => {
        setSelectedTeamMembers(query.teamMembers.map(id => getTeamMemberNameById(id)));
    }, [query.teamMembers]);

    useEffect(() => {
        const teamMembers = departments[selectedDepartment] ? Object.values(departments[selectedDepartment]) : [];
        setSelectedTeamMembers(teamMembers);
        console.log(selectedDepartment)
        onTeamChange(selectedDepartment, teamMembers.map(name => getTeamMemberIdByName(name)), queryId);
    }, [selectedDepartment]);

    const handleDepartmentSelected = (department, queryId) => {
        setSelectedDepartment(department);
        onDepartmentChange(department);
    };

    const handleTeamSelected = (teamMembers, queryId) => {
        setSelectedTeamMembers(teamMembers);
        onTeamChange(selectedDepartment, teamMembers.map(name => getTeamMemberIdByName(name)), queryId);
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
