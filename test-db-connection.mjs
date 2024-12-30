// test-db-connection.mjs
import mysql from 'mysql2/promise';

const testConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',  // Make sure this is the correct password
      database: 'mctc',
    });

    console.log('Database connection successful!');
    await connection.end();
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

testConnection();
