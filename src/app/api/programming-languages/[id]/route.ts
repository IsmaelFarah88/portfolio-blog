import { NextResponse } from 'next/server';
import db from '@/lib/db-server';

// Define the programming language type
interface ProgrammingLanguage {
  id: number;
  name: string;
  proficiency: number;
  icon_url: string | null;
  created_at: string;
}

// GET /api/programming-languages/[id] - Get a specific programming language
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const language = db.prepare('SELECT * FROM programming_languages WHERE id = ?').get(id) as ProgrammingLanguage | undefined;
    
    if (!language) {
      return NextResponse.json({ error: 'Programming language not found' }, { status: 404 });
    }
    
    return NextResponse.json(language);
  } catch (error) {
    console.error('Failed to fetch programming language:', error);
    return NextResponse.json({ error: 'Failed to fetch programming language' }, { status: 500 });
  }
}

// PUT /api/programming-languages/[id] - Update a specific programming language
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Check if language exists
    const existingLanguage = db.prepare('SELECT * FROM programming_languages WHERE id = ?').get(id) as ProgrammingLanguage | undefined;
    if (!existingLanguage) {
      return NextResponse.json({ error: 'Programming language not found' }, { status: 404 });
    }
    
    const update = db.prepare(`
      UPDATE programming_languages 
      SET name = ?, proficiency = ?, icon_url = ?
      WHERE id = ?
    `);
    
    const result = update.run(
      data.name || existingLanguage.name,
      data.proficiency || existingLanguage.proficiency,
      data.icon_url !== undefined ? data.icon_url : existingLanguage.icon_url,
      id
    );
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Programming language not found' }, { status: 404 });
    }
    
    const updatedLanguage = db.prepare('SELECT * FROM programming_languages WHERE id = ?').get(id) as ProgrammingLanguage;
    
    return NextResponse.json(updatedLanguage);
  } catch (error) {
    console.error('Failed to update programming language:', error);
    return NextResponse.json({ error: 'Failed to update programming language' }, { status: 500 });
  }
}

// DELETE /api/programming-languages/[id] - Delete a specific programming language
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const remove = db.prepare('DELETE FROM programming_languages WHERE id = ?');
    const result = remove.run(id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Programming language not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Programming language deleted successfully' });
  } catch (error) {
    console.error('Failed to delete programming language:', error);
    return NextResponse.json({ error: 'Failed to delete programming language' }, { status: 500 });
  }
}