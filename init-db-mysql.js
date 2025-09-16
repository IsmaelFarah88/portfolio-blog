const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'portfolio_blog',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to initialize the database schema
async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        technologies TEXT,
        image_url VARCHAR(255),
        demo_url VARCHAR(255),
        github_url VARCHAR(255),
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        date DATE NOT NULL,
        tags TEXT,
        image_url VARCHAR(255),
        link_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS site_content (
        id VARCHAR(255) PRIMARY KEY,
        content TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS certifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        date_issued DATE NOT NULL,
        expiry_date DATE,
        credential_id VARCHAR(255),
        url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        proficiency INT NOT NULL, -- 1-100 scale
        category VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS programming_languages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        proficiency INT NOT NULL, -- 1-100 scale
        icon_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default admin user if it doesn't exist
    const [adminUsers] = await pool.execute('SELECT * FROM users WHERE username = ?', ['admin']);
    if (Array.isArray(adminUsers) && adminUsers.length === 0) {
      await pool.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        ['admin', 'password123']
      );
      console.log('Default admin user created with username: admin and password: password123');
    }

    console.log('Database initialized successfully');
    
    // Close the pool
    await pool.end();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize the database
initializeDatabase();