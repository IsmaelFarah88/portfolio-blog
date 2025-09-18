import { NextResponse } from 'next/server';
import db from '@/lib/db-mysql';

// GET /api/projects/[id] - Get a specific project
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [projects]: any = await db.execute('SELECT * FROM projects WHERE id = ?', [id]);
    
    if (!projects || projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    const project = projects[0];
    const formattedProject = {
      ...project,
      imageUrl: project.image_url,
      demoUrl: project.demo_url,
      githubUrl: project.github_url,
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
    const [existingProjects]: any = await db.execute('SELECT * FROM projects WHERE id = ?', [id]);
    if (!existingProjects || existingProjects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    const existingProject = existingProjects[0];
    
    const [result]: any = await db.execute(
      `UPDATE projects 
      SET title = ?, description = ?, technologies = ?, image_url = ?, demo_url = ?, github_url = ?, date = ?
      WHERE id = ?`,
      [
        data.title || existingProject.title,
        data.description || existingProject.description,
        data.technologies ? JSON.stringify(data.technologies) : existingProject.technologies,
        data.imageUrl !== undefined ? data.imageUrl : existingProject.image_url,
        data.demoUrl !== undefined ? data.demoUrl : existingProject.demo_url,
        data.githubUrl !== undefined ? data.githubUrl : existingProject.github_url,
        data.date || existingProject.date,
        id
      ]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    const [updatedProjects]: any = await db.execute('SELECT * FROM projects WHERE id = ?', [id]);
    const updatedProject = updatedProjects[0];
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
    const [result]: any = await db.execute('DELETE FROM projects WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}