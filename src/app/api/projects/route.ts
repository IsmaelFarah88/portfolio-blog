import { NextResponse } from 'next/server';
import db from '@/lib/db-server';

// Define the project type
interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string;
  image_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  date: string;
  created_at: string;
}

// GET /api/projects - Get all projects
export async function GET() {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY date DESC').all() as Project[];
    const formattedProjects = projects.map(project => ({
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : []
    }));
    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description || !data.date || !data.technologies) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const insert = db.prepare(`
      INSERT INTO projects (title, description, technologies, image_url, demo_url, github_url, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = insert.run(
      data.title,
      data.description,
      JSON.stringify(data.technologies),
      data.imageUrl || null,
      data.demoUrl || null,
      data.githubUrl || null,
      data.date
    );
    
    const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid) as Project;
    const formattedProject = {
      ...newProject,
      technologies: newProject.technologies ? JSON.parse(newProject.technologies) : []
    };
    
    return NextResponse.json(formattedProject);
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}