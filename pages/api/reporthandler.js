import pool from '../../lib/db';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configure Multer for file uploads
const upload = multer({
  dest: 'uploads/', // Temporary storage location
});

// Middleware to handle file uploads
const multerMiddleware = upload.fields([
  { name: 'driversLicense', maxCount: 1 },
  { name: 'vehicleRegistration', maxCount: 1 },
  { name: 'orCr', maxCount: 1 },
]);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Wrap the multer middleware to work with Next.js API routes
    await new Promise((resolve, reject) => {
      multerMiddleware(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    try {
      const {
        fullName,
        age,
        sex,
        address,
        contactNumber,
        isOwner,
        reason,
        vehicleType,
        platenumber,
        color,
        description,
        reportID,
      } = req.body;

      // Retrieve files from Multer's temporary storage
      const driversLicenseFile = req.files?.driversLicense?.[0];
      const vehicleRegistrationFile = req.files?.vehicleRegistration?.[0];
      const orCrFile = req.files?.orCr?.[0];

      // Convert files to binary data
      const driversLicense = driversLicenseFile
        ? fs.readFileSync(path.resolve(driversLicenseFile.path))
        : null;
      const vehicleRegistration = vehicleRegistrationFile
        ? fs.readFileSync(path.resolve(vehicleRegistrationFile.path))
        : null;
      const orCr = orCrFile ? fs.readFileSync(path.resolve(orCrFile.path)) : null;

      // Clean up temporary files after reading them
      if (driversLicenseFile) fs.unlinkSync(driversLicenseFile.path);
      if (vehicleRegistrationFile) fs.unlinkSync(vehicleRegistrationFile.path);
      if (orCrFile) fs.unlinkSync(orCrFile.path);

      // Prepare the query to insert the report data, including the binary fields
      const query = `
        INSERT INTO reports (
          fullName, age, sex, address, contactNumber, isOwner,
          driversLicense, vehicleRegistration, orCr, reason, vehicleType, platenumber, color,
          description, reportID, status, createdAt
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
      `;

      const values = [
        fullName,
        age,
        sex,
        address,
        contactNumber,
        isOwner,
        driversLicense || null, // Use null for empty fields
        vehicleRegistration || null,
        orCr || null,
        reason,
        vehicleType,
        platenumber,
        color,
        description,
        reportID,
      ];

      const [result] = await pool.query(query, values);

      res.status(200).json({
        message: 'Report submitted successfully',
        reportID,
        result,
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to allow file handling
  },
};
