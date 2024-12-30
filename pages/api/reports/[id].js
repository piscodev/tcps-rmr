import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { status } = req.body;

    try {
      await pool.query('UPDATE reports SET status = ? WHERE id = ?', [status, id]);
      res.status(200).json({ message: 'Report status updated successfully' });
    } catch (error) {
      console.error('Error updating report status:', error);
      res.status(500).json({ error: 'Failed to update report status' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await pool.query('DELETE FROM reports WHERE id = ?', [id]);
      res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
      console.error('Error deleting report:', error);
      res.status(500).json({ error: 'Failed to delete report' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' }); // Only allow PUT and DELETE
  }
}
