// pages/api/editReport.js
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { vehicle_type, vehicle_color, plate_number, incurred_violations, image_upload, userId } = req.body;

    try {
      // Check if the report exists
      const [report] = await pool.query('SELECT * FROM watchlist WHERE report_id = ?', [id]);

      if (!report.length) {
        return res.status(404).json({ message: 'Report not found' });
      }

      // Ensure the logged-in user is the owner of the report
      if (report[0].reported_by_user_id !== userId) {
        return res.status(403).json({ message: 'You are not authorized to edit this report' });
      }

      // Update the report in the database
      await pool.query(
        'UPDATE watchlist SET vehicle_type = ?, vehicle_color = ?, plate_number = ?, incurred_violations = ?, image_upload = ? WHERE report_id = ?',
        [vehicle_type, vehicle_color, plate_number, incurred_violations, image_upload, id]
      );

      res.status(200).json({ message: 'Report updated successfully' });
    } catch (error) {
      console.error('Error updating report:', error);
      res.status(500).json({ message: 'An error occurred while updating the report' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
