const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    // Create a connection
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'portfolio_blog'
    });
    
    // Test the connection
    const [results] = await connection.execute('SELECT 1 + 1 AS solution');
    console.log('Database connection successful:', results[0].solution);
    
    // Close the connection
    await connection.end();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();