import fetchKpiData from '../../app/lib/fetch-kpis'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
    return;
  }

  try {
    const leadSourceParam = req.query.leadSource || '';
    const gte = req.query.gte || '';
    const lte = req.query.lte || '';

    const kpiData = await fetchKpiData(leadSourceParam, gte, lte);

    res.status(200).json(kpiData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
