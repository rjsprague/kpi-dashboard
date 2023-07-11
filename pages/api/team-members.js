export default async function handler(req, res) {

    const { spaceid } = req.body;

    try {
      const response = await fetch('https://db.reiautomated.io/team-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            spaceid: spaceid,
        }),
      });
      
      const data = await response.json();
  
      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(response.status).json({ error: 'Something went wrong on the API server!' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching team members. Please try again later.' });
    }
  }
  