import { NextResponse } from 'next/server';
import db from '@/lib/db-mysql';

// GET /api/skills/[id] - Get a specific skill
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [skills]: any = await db.execute('SELECT * FROM skills WHERE id = ?', [id]);
    
    if (!skills || skills.length === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    
    return NextResponse.json(skills[0]);
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
    const [existingSkills]: any = await db.execute('SELECT * FROM skills WHERE id = ?', [id]);
    if (!existingSkills || existingSkills.length === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    
    const existingSkill = existingSkills[0];
    
    const [result]: any = await db.execute(
      `UPDATE skills 
      SET name = ?, proficiency = ?, category = ?
      WHERE id = ?`,
      [
        data.name || existingSkill.name,
        data.proficiency || existingSkill.proficiency,
        data.category || existingSkill.category,
        id
      ]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    
    const [updatedSkills]: any = await db.execute('SELECT * FROM skills WHERE id = ?', [id]);
    const updatedSkill = updatedSkills[0];
    
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
    const [result]: any = await db.execute('DELETE FROM skills WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Failed to delete skill:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}