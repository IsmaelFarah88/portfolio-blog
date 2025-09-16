import { NextResponse } from 'next/server';
import db from '@/lib/db-mysql';

// GET /api/programming-languages/[id] - Get a specific programming language
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [languages]: any = await db.execute('SELECT * FROM programming_languages WHERE id = ?', [id]);
    
    if (!languages || languages.length === 0) {
      return NextResponse.json({ error: 'Programming language not found' }, { status: 404 });
    }
    
    return NextResponse.json(languages[0]);
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
    const [existingLanguages]: any = await db.execute('SELECT * FROM programming_languages WHERE id = ?', [id]);
    if (!existingLanguages || existingLanguages.length === 0) {
      return NextResponse.json({ error: 'Programming language not found' }, { status: 404 });
    }
    
    const existingLanguage = existingLanguages[0];
    
    const [result]: any = await db.execute(
      `UPDATE programming_languages 
      SET name = ?, proficiency = ?, icon_url = ?
      WHERE id = ?`,
      [
        data.name || existingLanguage.name,
        data.proficiency || existingLanguage.proficiency,
        data.icon_url !== undefined ? data.icon_url : existingLanguage.icon_url,
        id
      ]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Programming language not found' }, { status: 404 });
    }
    
    const [updatedLanguages]: any = await db.execute('SELECT * FROM programming_languages WHERE id = ?', [id]);
    const updatedLanguage = updatedLanguages[0];
    
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
    const [result]: any = await db.execute('DELETE FROM programming_languages WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Programming language not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Programming language deleted successfully' });
  } catch (error) {
    console.error('Failed to delete programming language:', error);
    return NextResponse.json({ error: 'Failed to delete programming language' }, { status: 500 });
  }
}