
async function fetchActiveTeamMembers(clientSpaceId) {
    
    const closersSpaceId = process.env.NEXT_PUBLIC_ACQUISITIONS_SPACEID


    try {
        const response = await fetch('/api/team-members', {
            method: 'POST',
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

        let activeMembers;

        if (clientSpaceId == closersSpaceId) {
            activeMembers = {                
                "Setter": {},
                "Closer": {},
                "Acquisition Manager": {},
            };
        } else {
            activeMembers = {
                "Lead Manager": {},
                "Acquisition Manager": {},
                "Deal Analyst": {},
                "Transaction Coordinator": {},
            };
        }
        
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

        // console.log("activeMembers", activeMembers)
        return activeMembers;

    } catch (error) {
        console.error(error);
        throw new Error("Error fetching active team members. Please try again later.");
    }
}

export default fetchActiveTeamMembers;
