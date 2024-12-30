export default async function handler(req, res) {
    if (req.method === 'PATCH') {
      try {
        const { reportID, status } = req.body;
  
        const query = `UPDATE reports SET status = ? WHERE reportID = ?`;
        const values = [status, reportID];
  
        const [result] = await pool.query(query, values);
  
        if (result.affectedRows > 0) {
          res.status(200).json({ message: 'Report status updated successfully' });
        } else {
          res.status(404).json({ error: 'Report not found' });
        }
      } catch (error) {
        console.error('Error updating report status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  }
  