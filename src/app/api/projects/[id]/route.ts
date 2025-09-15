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

// GET /api/projects/[id] - Get a specific project
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | undefined;
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    const formattedProject = {
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : []
    };
    
    return NextResponse.json(formattedProject);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT /api/projects/[id] - Update a specific project
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Check if project exists
    const existingProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | undefined;
    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    const update = db.prepare(`
      UPDATE projects 
      SET title = ?, description = ?, technologies = ?, image_url = ?, demo_url = ?, github_url = ?, date = ?
      WHERE id = ?
    `);
    
    const result = update.run(
      data.title || existingProject.title,
      data.description || existingProject.description,
      data.technologies ? JSON.stringify(data.technologies) : existingProject.technologies,
      data.imageUrl !== undefined ? data.imageUrl : existingProject.image_url,
      data.demoUrl !== undefined ? data.demoUrl : existingProject.demo_url,
      data.githubUrl !== undefined ? data.githubUrl : existingProject.github_url,
      data.date || existingProject.date,
      id
    );
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    const updatedProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project;
    const formattedProject = {
      ...updatedProject,
      technologies: updatedProject.technologies ? JSON.parse(updatedProject.technologies) : []
    };
    
    return NextResponse.json(formattedProject);
  } catch (error) {
    console.error('Failed to update project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE /api/projects/[id] - Delete a specific project
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const remove = db.prepare('DELETE FROM projects WHERE id = ?');
    const result = remove.run(id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}