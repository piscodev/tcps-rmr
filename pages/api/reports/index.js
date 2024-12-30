import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [results] = await pool.query('SELECT * FROM reports');
      res.status(200).json(results);
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' }); // Only allow GET
  }
}
