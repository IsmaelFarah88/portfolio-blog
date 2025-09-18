-- Portfolio Blog Database Schema for MySQL
-- Version: 1.0

-- Create the database
CREATE DATABASE IF NOT EXISTS portfolio_blog;
USE portfolio_blog;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
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
);

-- Create blog_posts table
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
);

-- Create site_content table
CREATE TABLE IF NOT EXISTS site_content (
    id VARCHAR(255) PRIMARY KEY,
    content TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    date_issued DATE NOT NULL,
    expiry_date DATE,
    credential_id VARCHAR(255),
    url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    proficiency INT NOT NULL, -- 1-100 scale
    category VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create programming_languages table
CREATE TABLE IF NOT EXISTS programming_languages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    proficiency INT NOT NULL, -- 1-100 scale
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT IGNORE INTO users (username, password) VALUES ('admin', 'password123');

-- Insert default site content
INSERT IGNORE INTO site_content (id, content) VALUES
('header_title', 'DevPortfolio'),
('header_home', 'Home'),
('header_projects', 'Projects'),
('header_blog', 'Blog'),
('header_certifications', 'Certifications'),
('header_skills', 'Skills'),
('header_programming_languages', 'Programming Languages'),
('header_admin', 'Admin'),
('hero_title', 'Hi, I\'m <span class=\"bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent\">Ismael Farah</span>'),
('hero_subtitle', 'Full Stack Developer crafting modern web experiences with React, Node.js, and cutting-edge technologies.'),
('hero_button_1', 'View My Work'),
('hero_button_2', 'Read My Blog'),
('skills_title', 'Technologies I Work With'),
('skills_list', '[\"React\", \"Next.js\", \"TypeScript\", \"Node.js\", \"Tailwind CSS\", \"MongoDB\", \"GraphQL\", \"Docker\"]'),
('footer_copyright', '© {currentYear} Ismael Farah. All rights reserved.'),
('footer_links', '[{\"name\":\"GitHub\",\"url\":\"#\"},{\"name\":\"LinkedIn\",\"url\":\"#\"},{\"name\":\"Twitter\",\"url\":\"#\"}]'),
('projects_title', 'My Projects'),
('projects_subtitle', 'A collection of my web development projects and applications.'),
('projects_all_button', 'All Projects'),
('blog_title', 'My Blog'),
('blog_subtitle', 'Thoughts, tutorials, and insights on web development and technology.'),
('blog_all_button', 'All Posts'),
('certifications_title', 'My Certifications'),
('certifications_subtitle', 'Professional certifications and achievements.'),
('skills_page_title', 'My Skills'),
('skills_page_subtitle', 'Technical skills and proficiency levels.'),
('programming_languages_title', 'Programming Languages'),
('programming_languages_subtitle', 'Languages I work with and my proficiency levels.'),
('contact_email', 'ismael.farah@example.com'),
('contact_phone', '+1 (123) 456-7890'),
('contact_location', 'San Francisco, CA'),
('personal_image', '/placeholder-personal-image.jpg');

-- Insert sample projects
INSERT IGNORE INTO projects (title, description, technologies, date) VALUES
('E-commerce Platform', 'A full-featured e-commerce platform built with React and Node.js', '[\"React\", \"Node.js\", \"MongoDB\", \"Stripe\"]', '2025-01-15'),
('Task Management App', 'A productivity app for managing tasks and team collaboration', '[\"Next.js\", \"TypeScript\", \"Firebase\", \"Tailwind CSS\"]', '2025-03-22'),
('Weather Dashboard', 'Real-time weather dashboard with forecasting capabilities', '[\"React\", \"Chart.js\", \"OpenWeather API\", \"Geolocation\"]', '2025-05-10');

-- Insert sample blog posts
INSERT IGNORE INTO blog_posts (title, excerpt, content, date, tags) VALUES
('Getting Started with Next.js', 'A comprehensive guide to building your first Next.js application', 'Next.js is a powerful React framework that provides excellent features for building modern web applications...', '2025-04-12', '[\"Next.js\", \"React\", \"Tutorial\"]'),
('Understanding TypeScript', 'Why TypeScript is becoming essential for modern web development', 'TypeScript adds static typing to JavaScript, helping developers catch errors early...', '2025-05-18', '[\"TypeScript\", \"JavaScript\"]'),
('Building Responsive UIs with Tailwind CSS', 'Learn how to create beautiful, responsive designs with Tailwind CSS', 'Tailwind CSS is a utility-first CSS framework that allows you to build designs directly in your markup...', '2025-06-30', '[\"CSS\", \"Tailwind\", \"Design\"]');

-- Insert sample certifications
INSERT IGNORE INTO certifications (title, organization, date_issued, expiry_date, credential_id) VALUES
('AWS Certified Developer', 'Amazon Web Services', '2025-01-15', '2028-01-15', 'AWS-DEV-123456'),
('Google Professional Cloud Developer', 'Google Cloud', '2025-03-22', '2027-03-22', 'GCP-DEV-789012');

-- Insert sample skills
INSERT IGNORE INTO skills (name, proficiency, category) VALUES
('React', 95, 'Frontend'),
('Next.js', 90, 'Frontend'),
('TypeScript', 85, 'Language'),
('Node.js', 80, 'Backend'),
('Tailwind CSS', 90, 'Styling'),
('MongoDB', 75, 'Database'),
('GraphQL', 70, 'API'),
('Docker', 65, 'DevOps'),
('AWS', 70, 'Cloud'),
('Python', 60, 'Language'),
('Java', 55, 'Language'),
('C++', 50, 'Language');

-- Insert sample programming languages
INSERT IGNORE INTO programming_languages (name, proficiency, icon_url) VALUES
('JavaScript', 95, '/icons/javascript.svg'),
('TypeScript', 85, '/icons/typescript.svg'),
('Python', 80, '/icons/python.svg'),
('Java', 75, '/icons/java.svg'),
('C++', 70, '/icons/cpp.svg'),
('Go', 65, '/icons/go.svg'),
('Rust', 60, '/icons/rust.svg');