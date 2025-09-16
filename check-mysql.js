const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkMySQL() {
  try {
    // Try to create a connection
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || ''
    });
    
    console.log('✅ MySQL is running and accessible');
    
    // Check if the database exists
    const [databases] = await connection.execute('SHOW DATABASES LIKE ?', [process.env.MYSQL_DATABASE || 'portfolio_blog']);
    
    if (databases.length > 0) {
      console.log('✅ Database exists');
    } else {
      console.log('⚠️ Database does not exist. You need to create it:');
      console.log('   Run: CREATE DATABASE portfolio_blog;');
    }
    
    // Close the connection
    await connection.end();
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ MySQL is not running or not accessible');
      console.log('Please make sure MySQL is installed and running on your system.');
      console.log('You can start MySQL with one of these commands depending on your system:');
      console.log('  sudo service mysql start    # Ubuntu/Debian');
      console.log('  sudo systemctl start mysqld # CentOS/RHEL');
      console.log('  brew services start mysql   # macOS with Homebrew');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('❌ Access denied. Please check your MySQL credentials in .env.local');
    } else {
      console.log('❌ Error connecting to MySQL:', error.message);
    }
  }
}

checkMySQL();