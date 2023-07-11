import { useSelector } from 'react-redux';
import { selectSpaceId } from '../../app/GlobalRedux/Features/client/clientSlice'

async function fetchActiveTeamMembers(clientSpaceId) {
    
    // const useAppSelector = useSelector;
    // const clientSpaceId = useAppSelector(state => state.client.clientSpaceId);
    // console.log("clientSpaceId: ", clientSpaceId)

    try {
        const response = await fetch('/api/team-members', {
            method: 'POST', // Specifying method as POST
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "spaceid": clientSpaceId,
            })
        });


        if (!response.ok) {
            throw new Error("Something went wrong on api server!");
        }

        const data = await response.json();

        const activeMembers = {
            "Lead Manager": {},
            "Acquisition Manager": {}
        };

        data.data.forEach(member => {
            if (member.Status && member.Status[0] === "Active") {
                const department = member.Department;
                const id = member.itemid;
                const name = member["Team Member Full Name"] ? member["Team Member Full Name"] : null;

                if (department in activeMembers && name) {
                    activeMembers[department][id] = name;
                }
            }
        });
        //console.log("activeMembers", activeMembers)
        return activeMembers;

    } catch (error) {
        console.error(error);
        throw new Error("Error fetching active team members. Please try again later.");
    }
}

export default fetchActiveTeamMembers;
