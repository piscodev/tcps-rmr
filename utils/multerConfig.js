import upload from '../../utils/multerConfig';  // Multer configuration
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Handle file uploads
    upload.fields([
      { name: 'driversLicense', maxCount: 1 },
      { name: 'vehicleRegistration', maxCount: 1 },
      { name: 'orCr', maxCount: 1 },
    ])(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: 'Something went wrong with the file upload.' });
      }

      // Extract file paths from the request object
      const { driversLicense, vehicleRegistration, orCr } = req.files;

      // Ensure the upload directory exists
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate unique filenames and save the files to the uploads directory
      const driversLicensePath = driversLicense[0].path;
      const vehicleRegistrationPath = vehicleRegistration[0].path;
      const orCrPath = orCr[0].path;

      // Now you can save the paths to the database (instead of the binary data)
      const { fullName, age, sex, address, contactNumber, isOwner, reason, vehicleType, platenumber, color, description, reportID } = req.body;

      const query = `INSERT INTO reports (fullName, age, sex, address, contactNumber, isOwner, driversLicense, vehicleRegistration, orCr, reason, vehicleType, platenumber, color, description, reportID, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`;
      const values = [
        fullName,
        age,
        sex,
        address,
        contactNumber,
        isOwner,
        driversLicensePath,  // Store the file path in the database
        vehicleRegistrationPath,
        orCrPath,
        reason,
        vehicleType,
        platenumber,
        color,
        description,
        reportID,
      ];

      // Save the data to the database
      pool.query(query, values)
        .then(([result]) => {
          res.status(200).json({
            message: 'Report submitted successfully!',
            reportID: reportID,
            result,
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
