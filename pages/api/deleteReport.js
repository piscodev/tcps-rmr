// pages/api/deleteReport.js
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.query;
    const { userId } = req.body; // Assuming the userId is coming from the body (or get it from session)

    try {
      // Check if the report exists
      const [report] = await pool.query('SELECT * FROM watchlist WHERE report_id = ?', [id]);

      if (!report.length) {
        return res.status(404).json({ message: 'Report not found' });
      }

      // Ensure the logged-in user is the owner of the report
      if (report[0].reported_by_user_id !== userId) {
        return res.status(403).json({ message: 'You are not authorized to delete this report' });
      }

      // Proceed to delete the report
      await pool.query('DELETE FROM watchlist WHERE report_id = ?', [id]);

      res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
      console.error('Error deleting report:', error);
      res.status(500).json({ message: 'An error occurred while deleting the report' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
