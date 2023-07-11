import fetch from 'node-fetch';

export default async function handler(req, res) {

    const { spaceid } = req.body;
    console.log("clientSpaceId: ", spaceid)

    try {
        const response = await fetch('https://db.reiautomated.io/lead-sources', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                spaceid: spaceid,
            }),
        });

        const data = await response.json();
        console.log(data)

        if (response.ok) {
            res.status(200).json(data);
        } else {
            res.status(response.status).json({ error: 'Something went wrong on the API server!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching lead sources. Please try again later.' });
    }
}
