import { NextResponse } from 'next/server';
import db from '@/lib/db-server';

// GET /api/programming-languages - Get all programming languages
export async function GET() {
  try {
    const languages = db.prepare('SELECT * FROM programming_languages ORDER BY name').all() as { 
      id: string; 
      name: string; 
      proficiency: number; 
      icon_url: string; 
      created_at: string; 
    }[];
    
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
    
    const insert = db.prepare(`
      INSERT INTO programming_languages (name, proficiency, icon_url)
      VALUES (?, ?, ?)
    `);
    
    const result = insert.run(
      data.name,
      data.proficiency,
      data.icon_url || ''
    );
    
    const newLanguage = db.prepare('SELECT * FROM programming_languages WHERE id = ?').get(result.lastInsertRowid) as { 
      id: string; 
      name: string; 
      proficiency: number; 
      icon_url: string; 
      created_at: string; 
    };
    
    return NextResponse.json(newLanguage);
  } catch (error) {
    console.error('Failed to create programming language:', error);
    return NextResponse.json({ error: 'Failed to create programming language' }, { status: 500 });
  }
}