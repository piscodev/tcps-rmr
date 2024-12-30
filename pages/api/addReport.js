// pages/api/addReport.js
import pool from '../../lib/db';  // Import the pool from db.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { reported_by_user_id, vehicle_type, vehicle_color, plate_number, incurred_violations, image_upload } = req.body;

    // Validate if all fields are provided
    if (!reported_by_user_id || !vehicle_type || !vehicle_color || !plate_number || !incurred_violations || !image_upload) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Insert the report into the database
      const [result] = await pool.execute(
        'INSERT INTO watchlist (reported_by_user_id, vehicle_type, vehicle_color, plate_number, incurred_violations, image_upload) VALUES (?, ?, ?, ?, ?, ?)', 
        [reported_by_user_id, vehicle_type, vehicle_color, plate_number, incurred_violations, image_upload]
      );
      res.status(201).json({ message: 'Report added successfully', data: result });
    } catch (error) {
      console.error('Database Error:', error);
      res.status(500).json({ error: 'Failed to add report' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
