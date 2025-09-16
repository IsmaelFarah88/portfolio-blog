import { NextResponse } from 'next/server';
import db from '@/lib/db-mysql';

// GET /api/programming-languages - Get all programming languages
export async function GET() {
  try {
    const [languages]: any = await db.execute('SELECT * FROM programming_languages ORDER BY name');
    
    return NextResponse.json(languages);
  } catch (error) {
    console.error('Failed to fetch programming languages:', error);
    return NextResponse.json({ error: 'Failed to fetch programming languages' }, { status: 500 });
  }
}

// POST /api/programming-languages - Create a new programming language
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const [result]: any = await db.execute(
      'INSERT INTO programming_languages (name, proficiency, icon_url) VALUES (?, ?, ?)',
      [
        data.name,
        data.proficiency,
        data.icon_url || ''
      ]
    );
    
    const [newLanguages]: any = await db.execute('SELECT * FROM programming_languages WHERE id = ?', [result.insertId]);
    const newLanguage = newLanguages[0];
    
    return NextResponse.json(newLanguage);
  } catch (error) {
    console.error('Failed to create programming language:', error);
    return NextResponse.json({ error: 'Failed to create programming language' }, { status: 500 });
  }
}