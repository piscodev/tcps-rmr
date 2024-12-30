// pages/api/getProfile.js
import { getSession } from 'next-auth/react';
import db from '../../lib/db';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Fetch the session to identify the logged-in user
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Extract the username, assuming session.user.name is set correctly as the username
  const { name: username } = session.user;

  try {
    const [user] = await db.query(
      `SELECT name,
       contact_num
        FROM users
         WHERE username = ? `,
      ['dummyyyyy']
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
