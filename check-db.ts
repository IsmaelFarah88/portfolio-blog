// Script to check and initialize the database if needed
import { initializeDatabase } from './src/lib/db-server';

// Initialize the database
try {
  initializeDatabase();
  console.log('Database checked and initialized successfully');
} catch (error) {
  console.error('Error initializing database:', error);
}