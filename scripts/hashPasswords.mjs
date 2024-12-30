import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise'; // Use mysql2/promise for async/await

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mctc',
};

async function hashPasswords() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    // Fetch all users with plaintext passwords
    const [rows] = await connection.query('SELECT user_id, password FROM users');
    console.log('Rows:', rows); // Debugging output

    for (const row of rows) {
      // Ensure row has correct properties
      console.log('Processing row:', row);

      const { user_id, password } = row; // Destructure the properties

      if (!user_id || !password) {
        console.error(`Skipping row with invalid data:`, row);
        continue;
      }

      // Hash the plaintext password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user record with the hashed password
      const [result] = await connection.query('UPDATE users SET password = ? WHERE user_id = ?', [hashedPassword, user_id]);

      // Log result of update
      if (result.affectedRows > 0) {
        console.log(`Updated user ID ${user_id} with hashed password.`);
      } else {
        console.log(`No changes made for user ID ${user_id}.`);
      }
    }

    console.log('Password hashing complete.');

  } catch (error) {
    console.error('Error hashing passwords:', error);
  } finally {
    await connection.end();
  }
}

// Execute the function
hashPasswords();
