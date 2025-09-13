const path = require('path');
const Database = require('better-sqlite3');

// Ensure the database directory exists
const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'portfolio.db');

console.log('Database path:', dbPath);

try {
  const db = new Database(dbPath);
  const projects = db.prepare('SELECT * FROM projects').all();
  console.log('Projects in database:');
  console.log(projects);
  
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
  console.log('Total projects:', projectCount);
  
  db.close();
} catch (error) {
  console.error('Error accessing database:', error.message);
}