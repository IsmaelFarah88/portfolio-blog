import { NextResponse } from 'next/server';
import db from '@/lib/db-server';

// GET /api/skills/[id] - Get a specific skill
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const skill = db.prepare('SELECT * FROM skills WHERE id = ?').get(id);
    
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    
    return NextResponse.json(skill);
  } catch (error) {
    console.error('Failed to fetch skill:', error);
    return NextResponse.json({ error: 'Failed to fetch skill' }, { status: 500 });
  }
}

// PUT /api/skills/[id] - Update a specific skill
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Check if skill exists
    const existingSkill = db.prepare('SELECT * FROM skills WHERE id = ?').get(id);
    if (!existingSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    
    const update = db.prepare(`
      UPDATE skills 
      SET name = ?, proficiency = ?, category = ?
      WHERE id = ?
    `);
    
    const result = update.run(
      data.name || existingSkill.name,
      data.proficiency || existingSkill.proficiency,
      data.category || existingSkill.category,
      id
    );
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    
    const updatedSkill = db.prepare('SELECT * FROM skills WHERE id = ?').get(id);
    
    return NextResponse.json(updatedSkill);
  } catch (error) {
    console.error('Failed to update skill:', error);
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

// DELETE /api/skills/[id] - Delete a specific skill
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const remove = db.prepare('DELETE FROM skills WHERE id = ?');
    const result = remove.run(id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Failed to delete skill:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}