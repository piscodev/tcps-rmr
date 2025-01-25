import formidable from 'formidable';
import pool from '../../lib/db';

export const config = {
  api: {
    bodyParser: false, // Disable body parser to handle files
  },
}

export default async function handler(req, res)
{
  if (req.method === 'POST')
  {
    const form = formidable()

    form.parse(req, async (err, fields, files) =>
    {
      if (err)
      {
        console.error('Error parsing form:', err)
        return res.status(500).json({ error: 'Error parsing form data' })
      }

      try
      {
        const {
          fullName,
          age,
          sex,
          address,
          contactNumber,
          isOwner,
          driversLicense,
          vehicleRegistration,
          orCr,
          reason,
          vehicleType,
          platenumber,
          color,
          description,
          reportID,
        } = fields

        const query = `
          INSERT INTO reports (
            fullName, age, sex, address, contactNumber, isOwner,
            driversLicense, vehicleRegistration, orCr, reason, vehicleType, platenumber, color,
            description, reportID, status, createdAt
          ) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
        `

        const values = [
          fullName,
          age,
          sex,
          address,
          contactNumber,
          isOwner,
          driversLicense || '',
          vehicleRegistration || '',
          orCr || '',
          reason,
          vehicleType,
          platenumber,
          color,
          description,
          reportID,
        ]

        const [result] = await pool.query(query, values)
        console.log('Report submitted successfully:', result)

        res.status(200).json({
          message: 'Report submitted successfully',
          reportID,
          result,
        })
      } catch (error) {
        console.error('Error submitting report:', error)
        res.status(500).json({ error: 'Internal Server Error' })
      }
    })
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
