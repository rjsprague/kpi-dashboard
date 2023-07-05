import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://db.reiautomated.io/spaces');
    const data = await response.json();

    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json({ error: 'Something went wrong on the API server!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching clients. Please try again later.' });
  }
}
