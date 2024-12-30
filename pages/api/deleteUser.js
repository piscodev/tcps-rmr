// pages/api/deleteUser.js
import db from '../../lib/db'; // Adjust this path as needed

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
