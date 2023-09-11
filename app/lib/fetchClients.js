import cookies from 'js-cookie';

async function fetchClients(url = '/api/spaces') {

    const accessToken = cookies.get('accessToken');
    // console.log("accessToken", accessToken)

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        // console.log('Clients Response:', response);

        // if (!data.ok) {
        //     throw new Error("Something went wrong on api server!");
        // }

        const clientsObj = await response.json();

        // console.log("clients", clientsObj)
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
