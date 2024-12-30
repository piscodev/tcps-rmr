import  pool from '../../lib/db'; // assuming you're using mysql2 or similar

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const [results] = await pool.query(
      `SELECT reportID, fullName, contactNumber, createdAt, vehicleType, platenumber, color, description, reason, status
      FROM reports
      WHERE reportID LIKE ? OR fullName LIKE ?`,
      [`%${query}%`, `%${query}%`]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'No reports found' });
    }

    res.status(200).json({ reports: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the reports' });
  }
}
