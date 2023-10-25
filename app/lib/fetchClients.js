import cookies from 'js-cookie';

async function fetchClients(url = '/api/spaces') {

    const accessToken = cookies.get('token');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const clientsObj = await response.json();

        // filter clients list to include only the "name" and "spaceid" properties with the "name" property as the key and the "spaceid" property as the value
        const clientsMap = clientsObj.data.reduce((acc, client) => {
            acc[client.name] = client.spaceid;
            return acc;
        }, {});

        return clientsMap;

    } catch (error) {
        console.error(error);
        throw new Error("Error fetching clients. Please try again later.");
    }
}

export default fetchClients;
