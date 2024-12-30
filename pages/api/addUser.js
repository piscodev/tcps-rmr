import pool from '../../lib/db';
import bcrypt from 'bcryptjs';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { username, name, role, contactNumber, password } = req.body;

    // Validate input data
    if (!username || !name || !role || !contactNumber || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Log the incoming data for debugging
      console.log('Received data:', { username, name, role, contactNumber, password });

      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log('Hashed password:', hashedPassword);

      // Insert new user into the database
      const [result] = await pool.query(
        'INSERT INTO users (username, name, role, contact_num, password) VALUES (?, ?, ?, ?, ?)',
        [username, name, role, contactNumber, hashedPassword]
      );

      console.log('Database result:', result);

      // Return success response
      return res.status(200).json({ message: 'User added successfully', userId: result.insertId });
    } catch (error) {
      console.error('Error adding user:', error);
      return res.status(500).json({ error: 'Failed to add user' });
    }
  } else {
    // Handle unsupported request methods
    return res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
