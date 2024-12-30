// pages/api/getUsers.js
import db from '../../lib/db'; // Adjust this path as needed

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch users and their associated profile information
      const [users] = await db.query(`
        SELECT 
          user_id,
          username,
          password,
          name,
          role,
          contact_num                  
            FROM 
          users 
        `);

      res.status(200).json(users);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
