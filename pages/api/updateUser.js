import db from '../../lib/db'; // Adjust this path as needed

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    // Destructure name from req.body
    const { id, username, password, name, role, contact_num } = req.body;

    try {
      // Update the users table
      const [userResult] = await db.query(`
        UPDATE users
        SET username = ?
        WHERE user_id = ?
      `, [username, id]);

      // Update the userss table
      const [usersResult] = await db.query(`
        UPDATE users
        SET name = ?, password = ?, role = ?, contact_num = ?
        WHERE user_id = ?
      `, [name, password, role, contact_num, id]);

      if (userResult.affectedRows === 0 && usersResult.affectedRows === 0) {
        return res.status(404).json({ error: 'User or users not found' });
      }

      res.status(200).json({ id, username, name, role, contact_num });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
