# Developer Portfolio with Blog

A modern, responsive portfolio website for developers with blog functionality. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern, responsive design with dark mode support
- 📝 Blog section with tagging system
- 💼 Project showcase with filtering capabilities
- 🔐 Admin panel for managing content (projects and blog posts)
- 📱 Mobile-friendly navigation
- ⚡ Fast performance with Next.js

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
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

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── admin/        # Admin panel pages
│   ├── blog/         # Blog pages
│   ├── projects/     # Projects pages
│   ├── login/        # Login page
│   └── ...           # Other pages
├── lib/              # Utility functions and types
└── data/             # Mock data
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.