import pool from '../../lib/db'; // Correct import for the pool

export default async function handler(req, res) {
  try {
    const query = `
      SELECT 
        COUNT(*) AS total_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) AS accepted_count,
        SUM(CASE WHEN status = 'dropped' THEN 1 ELSE 0 END) AS dropped_count,
        SUM(CASE WHEN status = 'solved' THEN 1 ELSE 0 END) AS solved_count
      FROM reports
    `;

    // Run the query using the pool
    const [rows] = await pool.query(query);
    console.log('Query result:', rows);

    if (!rows || rows.length === 0) {
      return res.status(500).json({ message: 'No data returned from query' });
    }

    const { total_count, pending_count, accepted_count, dropped_count, solved_count } = rows[0];

    res.status(200).json({
      total: total_count,
      pending: pending_count,
      accepted: accepted_count,
      dropped: dropped_count,
      solved: solved_count
    });
  } catch (error) {
    console.error('Error in report counter API:', error);
    res.status(500).json({ message: `Error fetching report counts: ${error.message}` });
  }
}
