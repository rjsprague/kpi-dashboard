"use client"

import React, { useEffect, useState } from 'react';
import UniversalDropdown from './UniversalDropdown';
import DropdownButton from './DropdownButton';
import { useSelector } from 'react-redux';
import { selectSpaceId } from '@/GlobalRedux/Features/client/clientSlice'

function TeamComponent({ onTeamChange, onTeamMemberForClosersChange, query, queryId, onDepartmentChange, departments, isLoadingData, isProfessional, isStarter }) {
    const [selectedDepartment, setSelectedDepartment] = useState(query.departments);
    const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);

    // For Closers Space
    const [selectedSubview, setSelectedSubview] = useState(['Team']);
    const [allTeamMembers, setAllTeamMembers] = useState([]);

    const closersSpaceId = Number(process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID);
    const clientSpaceId = useSelector(selectSpaceId);

    // console.log(departments[query.departments[0]]);
    // console.log(query.departments);

    useEffect(() => {
        if (isProfessional || isStarter) {
            return;
        }

        if (closersSpaceId === clientSpaceId) {
            const teamMemberNames = query.teamMembers.map(id => getCloserTeamMemberNameById(id));
            setSelectedTeamMembers(teamMemberNames);
        } else {
            // check if there is at least one team member in the selected department
            if (query.teamMembers.length > 0 && query.teamMembers.filter((id) => departments[query.departments[0]][id]).length > 0) {
                // check if selected team members are in the selected department
                const teamMembers = query.teamMembers.length > 0 ? query.teamMembers.filter(id => departments[query.departments[0]][id]) : [];
                const teamMemberNames = teamMembers.map(id => getTeamMemberNameById(id));
                setSelectedTeamMembers(teamMemberNames);
            } else {
                // Display "No Team Members" if there are no team members in the selected department
                setSelectedTeamMembers([]);
            }
        }
    }, [query, query.teamMembers, query.departments, departments]);


    const handleDepartmentSelected = (department) => {
        console.log(department);
        onDepartmentChange(department);
        onTeamChange(queryId, department, Object.keys(departments[department]));
    };

    const handleTeamSelected = (teamMembers) => {
        console.log(teamMembers);
        if (clientSpaceId === closersSpaceId) {
            onTeamMemberForClosersChange(queryId, teamMembers.map(name => getCloserTeamMemberIdByName(name)));
            setSelectedTeamMembers(teamMembers);
        } else {
            onTeamChange(queryId, selectedDepartment, teamMembers.map(name => getTeamMemberIdByName(name)));
            setSelectedTeamMembers(teamMembers);
        }
    };


    useEffect(() => {
        if (isProfessional || isStarter) {
            return;
        }

        const teamMembers = [];
        for (let department in departments) {
            if (department === 'Setter' || department === 'Closer') {
                for (let id in departments[department]) {

                    teamMembers.push('(' + department + ') ' + departments[department][id]);
                }
            }
        }
        setAllTeamMembers(teamMembers);
    }, []);

    const handleSubviewChange = (subview) => {
        if (subview[0] === 'Team') {
            setSelectedSubview(['Team']);
            onDepartmentChange(['Team']);
            onTeamChange(queryId, ['Team'], allTeamMembers.map(name => getCloserTeamMemberIdByName(name)));
        } else {
            setSelectedSubview(['Individual']);
            onDepartmentChange(['Individual']);
            onTeamChange(queryId, ['Individual'], allTeamMembers[0] ? [getCloserTeamMemberIdByName(allTeamMembers[0])] : []);
        }
    };

    useEffect(() => {
        if (isProfessional || isStarter) {
            return;
        }

        if (closersSpaceId === clientSpaceId) {
            setSelectedDepartment(query.departments);
        } else {
            setSelectedDepartment(query.departments);

            // if there are no team members selected from the current department select all team members from the new department
            if (query.teamMembers.length > 0 && query.teamMembers.filter((id) => departments[query.departments[0]][id]).length === 0) {
                // console.log("no team members selected")
                onTeamChange(queryId, query.departments, Object.keys(departments[query.departments[0]]));
            }
        }

    }, [query, query.departments]);

    const getCloserTeamMemberIdByName = (name) => {
        const department = name.split(' ')[0].slice(1, -1);
        const teamMemberName = name.split(' ')[1] + ' ' + name.split(' ')[2];

        for (let id in departments[department]) {
            if (departments[department][id] === teamMemberName) {
                return id;
            }
        }
        return null;
    };

    const getCloserTeamMemberNameById = (id) => {
        for (let department in departments) {
            if (departments[department][id]) {
                return '(' + department + ') ' + departments[department][id];
            }
        }
        return null;
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
                    console.log(id);
                    return id;
                }
            }
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-1">
            {
                clientSpaceId === closersSpaceId ?
                    (
                        <>
                            <UniversalDropdown
                                options={['Team', 'Individual']}
                                onOptionSelected={handleSubviewChange}
                                selectedOptions={selectedSubview ? selectedSubview : []}
                                queryId={queryId}
                                isSingleSelect={true}
                                isLoadingData={isLoadingData}
                                ButtonComponent={DropdownButton}
                                label={"Subview"}
                            />
                            {selectedSubview[0] !== 'Team' &&
                                <UniversalDropdown
                                    options={allTeamMembers ? allTeamMembers : []}
                                    onOptionSelected={handleTeamSelected}
                                    selectedOptions={selectedTeamMembers}
                                    queryId={queryId}
                                    isSingleSelect={true}
                                    isLoadingData={isLoadingData}
                                    ButtonComponent={DropdownButton}
                                    label={"Team Members"}
                                />
                            }

                        </>
                    )
                    :
                    (
                        <>
                            <UniversalDropdown
                                options={Object.keys(departments)}
                                onOptionSelected={handleDepartmentSelected}
                                selectedOptions={selectedDepartment ? [selectedDepartment] : []}
                                queryId={queryId}
                                isSingleSelect={true}
                                isLoadingData={isLoadingData}
                                ButtonComponent={DropdownButton}
                                label={"Department"}
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
                                    label={"Team Members"}
                                />
                            )}
                        </>
                    )
            }
        </div>
    );
}

export default TeamComponent;
