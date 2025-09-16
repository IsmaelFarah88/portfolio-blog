# Developer Portfolio with Blog (MySQL Version)

A modern, responsive portfolio website for developers with blog functionality. This version uses MySQL as the database instead of SQLite.

## Features

- 🎨 Modern, responsive design with dark mode support
- 📝 Blog section with tagging system
- 💼 Project showcase with filtering capabilities
- 🔐 Admin panel for managing content (projects and blog posts)
- 📱 Mobile-friendly navigation
- ⚡ Fast performance with Next.js
- 🗄️ MySQL database integration

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/portfolio-blog-mysql.git
cd portfolio-blog-mysql
```

2. Install dependencies:
```bash
npm install
```

3. Set up MySQL:
   - Make sure MySQL is installed and running
   - Create a database named `portfolio_blog`
   - Update the `.env.local` file with your MySQL credentials

4. Import the database schema:
```bash
mysql -u your_mysql_username -p portfolio_blog < portfolio_blog_schema.sql
```

5. Update environment variables in `.env.local`:
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=portfolio_blog
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

## Database Scripts

- `npm run init-db`: Initialize the database schema and insert sample data
- `npm run test-db`: Test the database connection

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── admin/        # Admin panel pages
│   ├── api/          # API routes for data operations
│   ├── blog/         # Blog pages
│   ├── projects/     # Projects pages
│   ├── login/        # Login page
│   └── ...           # Other pages
├── components/       # Reusable UI components
├── lib/              # Utility functions and database connection
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript
- [MySQL Documentation](https://dev.mysql.com/doc/) - learn about MySQL

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.