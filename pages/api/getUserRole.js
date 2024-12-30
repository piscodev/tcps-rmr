// pages/api/getUserRole.js
import db from '../../lib/db'; // Adjust this path to your actual database connection

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username } = req.body;

    try {
      const [rows] = await db.query('SELECT role FROM users WHERE username = ?', [username]);
      if (rows.length > 0) {
        res.status(200).json({ role: rows[0].role });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
