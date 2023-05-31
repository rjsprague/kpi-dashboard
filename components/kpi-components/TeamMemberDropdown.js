import React, { useEffect, useState } from 'react';
import fetchActiveTeamMembers from '../../lib/fetchActiveTeamMembers';
import Dropdown from './Dropdown';
import ServiceUnavailable from '../ServiceUnavailable';

export default function TeamMemberDropdown({ onOptionSelected, queryId }) {
    const [teamMembers, setTeamMembers] = useState([]);
    const [isUnavailable, setIsUnavailable] = useState(false);

    useEffect(() => {
        async function getTeamMembers() {
            try {
                const members = await fetchActiveTeamMembers();
                let flatMembers = [];
                Object.values(members).forEach(department => {
                    flatMembers = [...flatMembers, ...Object.values(department)];
                });
                setTeamMembers(flatMembers);
            } catch (error) {
                console.error(error);
                setIsUnavailable(true);
            }
        }
        getTeamMembers();
    }, []);

    if (isUnavailable) {
        return <ServiceUnavailable small={true} />;
    }

    return (
        <Dropdown
            options={teamMembers}
            onOptionSelected={onOptionSelected}
            queryId={queryId}
        />
    );
}
