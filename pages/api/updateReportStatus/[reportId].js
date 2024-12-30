import pool from '../../../lib/db'; // Make sure this path is correct

export default async function handler(req, res) {
  const { reportId } = req.query; // Extract reportId from URL params
  const { status } = req.body; // Extract status from request body

  if (req.method === 'PUT') {
    if (!status || !reportId) {
      return res.status(400).json({ message: 'Report ID and status are required' });
    }

    try {
      // Update the status in the database
      const [result] = await pool.query(
        'UPDATE watchlist SET status = ? WHERE report_id = ?',
        [status, reportId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Report not found or already updated' });
      }

      // Send success response
      res.status(200).json({ message: 'Report status updated successfully' });
    } catch (error) {
      console.error('Error updating report status:', error);
      res.status(500).json({ message: 'Error updating report status' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
