
async function fetchClients(url = '/api/spaces') {

    const response = await fetch('/auth/getAccessToken');
    const { accessToken } = await response.json();
    console.log("accessToken", accessToken)

    try {
        const data = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken.value}`,
            },
        });

        // console.log('Clients Response:', data);

        if (!data.ok) {
            throw new Error("Something went wrong on api server!");
        }

        const clientsObj = await data.json();

        //console.log("clients", clients)
        // filter clients list to include only the "name" and "spaceid" properties with the "name" property as the key and the "spaceid" property as the value
        const clientsMap = clientsObj.data.reduce((acc, client) => {
            acc[client.name] = client.spaceid;
            return acc;
        }, {});

        // console.log("clientsMap", clientsMap)

        return clientsMap;

    } catch (error) {
        console.error(error);
        throw new Error("Error fetching clients. Please try again later.");
    }
}

export default fetchClients;
