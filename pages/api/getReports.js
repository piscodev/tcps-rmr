// /pages/api/getReports.js
import pool from '../../lib/db'; // Adjust path if needed

export default async function handler(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM reports');
    res.status(200).json({ reports: rows });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports' });
  }
}
