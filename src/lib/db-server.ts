import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure the database directory exists
const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize the database
const dbPath = path.join(dbDir, 'portfolio.db');
const db = new Database(dbPath);

// Function to initialize the database schema
export function initializeDatabase() {
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      technologies TEXT,
      image_url TEXT,
      demo_url TEXT,
      github_url TEXT,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      date TEXT NOT NULL,
      tags TEXT,
      image_url TEXT,
      link_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS site_content (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      organization TEXT NOT NULL,
      date_issued TEXT NOT NULL,
      expiry_date TEXT,
      credential_id TEXT,
      url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      proficiency INTEGER NOT NULL, -- 1-100 scale
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS programming_languages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      proficiency INTEGER NOT NULL, -- 1-100 scale
      icon_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add missing columns to existing tables if they don't exist
  try {
    // Add image_url and link_url columns to blog_posts table if they don't exist
    db.exec(`ALTER TABLE blog_posts ADD COLUMN image_url TEXT`);
  } catch (_error) {
    // Column already exists, ignore error
  }
  
  try {
    // Add link_url column to blog_posts table if it doesn't exist
    db.exec(`ALTER TABLE blog_posts ADD COLUMN link_url TEXT`);
  } catch (_error) {
    // Column already exists, ignore error
  }
  
  try {
    // Add image_url column to projects table if it doesn't exist
    db.exec(`ALTER TABLE projects ADD COLUMN image_url TEXT`);
  } catch (_error) {
    // Column already exists, ignore error
  }
  
  try {
    // Add demo_url column to projects table if it doesn't exist
    db.exec(`ALTER TABLE projects ADD COLUMN demo_url TEXT`);
  } catch (_error) {
    // Column already exists, ignore error
  }
  
  try {
    // Add github_url column to projects table if it doesn't exist
    db.exec(`ALTER TABLE projects ADD COLUMN github_url TEXT`);
  } catch (_error) {
    // Column already exists, ignore error
  }

  // Insert default admin user if it doesn't exist
  const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
  if (!adminUser) {
    const insertUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    // In a real application, you should hash the password
    insertUser.run('admin', 'password123');
    console.log('Default admin user created with username: admin and password: password123');
  }

  // Insert sample projects if none exist
  const projectCount = (db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number }).count;
  if (projectCount === 0) {
    const insertProject = db.prepare(`
      INSERT INTO projects (title, description, technologies, date, image_url, demo_url, github_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertProject.run(
      'E-commerce Platform',
      'A full-featured e-commerce platform built with React and Node.js',
      '["React", "Node.js", "MongoDB", "Stripe"]',
      '2025-01-15',
      null,
      null,
      null
    );
    
    insertProject.run(
      'Task Management App',
      'A productivity app for managing tasks and team collaboration',
      '["Next.js", "TypeScript", "Firebase", "Tailwind CSS"]',
      '2025-03-22',
      null,
      null,
      null
    );
    
    insertProject.run(
      'Weather Dashboard',
      'Real-time weather dashboard with forecasting capabilities',
      '["React", "Chart.js", "OpenWeather API", "Geolocation"]',
      '2025-05-10',
      null,
      null,
      null
    );
    
    console.log('Sample projects inserted');
  }

  // Insert sample blog posts if none exist
  const blogPostCount = (db.prepare('SELECT COUNT(*) as count FROM blog_posts').get() as { count: number }).count;
  if (blogPostCount === 0) {
    const insertBlogPost = db.prepare(`
      INSERT INTO blog_posts (title, excerpt, content, date, tags, image_url, link_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertBlogPost.run(
      'Getting Started with Next.js',
      'A comprehensive guide to building your first Next.js application',
      'Next.js is a powerful React framework that provides excellent features for building modern web applications...',
      '2025-04-12',
      '["Next.js", "React", "Tutorial"]',
      null,
      null
    );
    
    insertBlogPost.run(
      'Understanding TypeScript',
      'Why TypeScript is becoming essential for modern web development',
      'TypeScript adds static typing to JavaScript, helping developers catch errors early...',
      '2025-05-18',
      '["TypeScript", "JavaScript"]',
      null,
      null
    );
    
    insertBlogPost.run(
      'Building Responsive UIs with Tailwind CSS',
      'Learn how to create beautiful, responsive designs with Tailwind CSS',
      'Tailwind CSS is a utility-first CSS framework that allows you to build designs directly in your markup...',
      '2025-06-30',
      '["CSS", "Tailwind", "Design"]',
      null,
      null
    );
    
    console.log('Sample blog posts inserted');
  }

  // Insert default site content if it doesn't exist
  const siteContentCount = (db.prepare('SELECT COUNT(*) as count FROM site_content').get() as { count: number }).count;
  if (siteContentCount === 0) {
    const insertContent = db.prepare(`
      INSERT INTO site_content (id, content)
      VALUES (?, ?)
    `);
    
    // Header content
    insertContent.run('header_title', 'DevPortfolio');
    insertContent.run('header_home', 'Home');
    insertContent.run('header_projects', 'Projects');
    insertContent.run('header_blog', 'Blog');
    insertContent.run('header_certifications', 'Certifications');
    insertContent.run('header_skills', 'Skills');
    insertContent.run('header_programming_languages', 'Programming Languages');
    insertContent.run('header_admin', 'Admin');
    
    // Hero section content
    insertContent.run('hero_title', 'Hi, I\'m <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ismael Farah</span>');
    insertContent.run('hero_subtitle', 'Full Stack Developer crafting modern web experiences with React, Node.js, and cutting-edge technologies.');
    insertContent.run('hero_button_1', 'View My Work');
    insertContent.run('hero_button_2', 'Read My Blog');
    
    // Skills section content
    insertContent.run('skills_title', 'Technologies I Work With');
    insertContent.run('skills_list', '["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "MongoDB", "GraphQL", "Docker"]');
    
    // Footer content
    insertContent.run('footer_copyright', '© {currentYear} Ismael Farah. All rights reserved.');
    insertContent.run('footer_links', '["Twitter", "GitHub", "LinkedIn"]');
    
    // Projects page content
    insertContent.run('projects_title', 'My Projects');
    insertContent.run('projects_subtitle', 'A collection of my web development projects and applications.');
    insertContent.run('projects_all_button', 'All Projects');
    
    // Blog page content
    insertContent.run('blog_title', 'My Blog');
    insertContent.run('blog_subtitle', 'Thoughts, tutorials, and insights on web development and technology.');
    insertContent.run('blog_all_button', 'All Posts');
    
    // Certifications page content
    insertContent.run('certifications_title', 'My Certifications');
    insertContent.run('certifications_subtitle', 'Professional certifications and achievements.');
    
    // Skills page content
    insertContent.run('skills_page_title', 'My Skills');
    insertContent.run('skills_page_subtitle', 'Technical skills and proficiency levels.');
    
    // Programming languages page content
    insertContent.run('programming_languages_title', 'Programming Languages');
    insertContent.run('programming_languages_subtitle', 'Languages I work with and my proficiency levels.');
    
    // Contact page content
    insertContent.run('contact_email', 'ismael.farah@example.com');
    insertContent.run('contact_phone', '+1 (123) 456-7890');
    insertContent.run('contact_location', 'San Francisco, CA');
    
    // Personal image
    insertContent.run('personal_image', '/placeholder-personal-image.jpg');
    
    console.log('Default site content inserted');
  }

  // Insert sample certifications if none exist
  const certificationsCount = (db.prepare('SELECT COUNT(*) as count FROM certifications').get() as { count: number }).count;
  if (certificationsCount === 0) {
    const insertCert = db.prepare(`
      INSERT INTO certifications (title, organization, date_issued, expiry_date, credential_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insertCert.run(
      'AWS Certified Developer',
      'Amazon Web Services',
      '2025-01-15',
      '2028-01-15',
      'AWS-DEV-123456'
    );
    
    insertCert.run(
      'Google Professional Cloud Developer',
      'Google Cloud',
      '2025-03-22',
      '2027-03-22',
      'GCP-DEV-789012'
    );
    
    console.log('Sample certifications inserted');
  }

  // Insert sample skills if none exist
  const skillsCount = (db.prepare('SELECT COUNT(*) as count FROM skills').get() as { count: number }).count;
  if (skillsCount === 0) {
    const insertSkill = db.prepare(`
      INSERT INTO skills (name, proficiency, category)
      VALUES (?, ?, ?)
    `);
    
    insertSkill.run('React', 95, 'Frontend');
    insertSkill.run('Next.js', 90, 'Frontend');
    insertSkill.run('TypeScript', 85, 'Language');
    insertSkill.run('Node.js', 80, 'Backend');
    insertSkill.run('Tailwind CSS', 90, 'Styling');
    insertSkill.run('MongoDB', 75, 'Database');
    insertSkill.run('GraphQL', 70, 'API');
    insertSkill.run('Docker', 65, 'DevOps');
    insertSkill.run('AWS', 70, 'Cloud');
    insertSkill.run('Python', 60, 'Language');
    insertSkill.run('Java', 55, 'Language');
    insertSkill.run('C++', 50, 'Language');
    
    console.log('Sample skills inserted');
  }
  
  // Insert sample programming languages if none exist
  const programmingLanguagesCount = (db.prepare('SELECT COUNT(*) as count FROM programming_languages').get() as { count: number }).count;
  if (programmingLanguagesCount === 0) {
    const insertLanguage = db.prepare(`
      INSERT INTO programming_languages (name, proficiency, icon_url)
      VALUES (?, ?, ?)
    `);
    
    insertLanguage.run('JavaScript', 95, '/icons/javascript.svg');
    insertLanguage.run('TypeScript', 85, '/icons/typescript.svg');
    insertLanguage.run('Python', 80, '/icons/python.svg');
    insertLanguage.run('Java', 75, '/icons/java.svg');
    insertLanguage.run('C++', 70, '/icons/cpp.svg');
    insertLanguage.run('Go', 65, '/icons/go.svg');
    insertLanguage.run('Rust', 60, '/icons/rust.svg');
    
    console.log('Sample programming languages inserted');
  }
}

// Initialize the database when this module is imported
initializeDatabase();

export default db;