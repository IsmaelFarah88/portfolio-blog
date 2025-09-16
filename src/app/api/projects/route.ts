import { NextResponse } from 'next/server';
import db from '@/lib/db-mysql';

// GET /api/projects - Get all projects
export async function GET() {
  try {
    const [projects]: any = await db.execute('SELECT * FROM projects ORDER BY date DESC');
    const formattedProjects = Array.isArray(projects) ? projects.map((project: any) => ({
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : []
    })) : [];
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
    
    const [result]: any = await db.execute(
      'INSERT INTO projects (title, description, technologies, image_url, demo_url, github_url, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        data.title,
        data.description,
        JSON.stringify(data.technologies),
        data.imageUrl || null,
        data.demoUrl || null,
        data.githubUrl || null,
        data.date
      ]
    );
    
    const [newProject]: any = await db.execute('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    const formattedProject = {
      ...newProject[0],
      technologies: newProject[0].technologies ? JSON.parse(newProject[0].technologies) : []
    };
    
    return NextResponse.json(formattedProject);
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}