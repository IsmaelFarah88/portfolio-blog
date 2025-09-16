# Portfolio Blog with MySQL

This is a developer portfolio website with blog functionality that uses MySQL as the database instead of SQLite.

## Setup

1. Make sure you have MySQL installed and running on your system.

2. Create a MySQL database for the project:
   ```sql
   CREATE DATABASE portfolio_blog;
   ```

3. Update the `.env.local` file with your MySQL connection details:
   ```
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=your_mysql_username
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DATABASE=portfolio_blog
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Initialize the database:
   ```bash
   npm run init-db
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

## Database Scripts

- `npm run init-db`: Initialize the database schema and insert sample data
- `npm run test-db`: Test the database connection

## Admin Access

To access the admin panel:
1. Navigate to `/login`
2. Use the following credentials:
   - Username: `admin`
   - Password: `password123`

From the admin panel, you can:
- Add, edit, and delete projects
- Add, edit, and delete blog posts
- Manage certifications, skills, and programming languages
- Customize site content

## Features

- Modern, responsive design with dark mode support
- Blog section with tagging system
- Project showcase with filtering capabilities
- Admin panel for managing content
- Mobile-friendly navigation
- Fast performance with Next.js