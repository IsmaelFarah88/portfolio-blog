import { NextResponse } from 'next/server';
import db from '@/lib/db-server';

// GET /api/skills - Get all skills
export async function GET() {
  try {
    const skills = db.prepare('SELECT * FROM skills ORDER BY category, name').all() as { 
      id: string; 
      name: string; 
      proficiency: number; 
      category: string; 
      created_at: string; 
    }[];
    
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

// POST /api/skills - Create a new skill
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const insert = db.prepare(`
      INSERT INTO skills (name, proficiency, category)
      VALUES (?, ?, ?)
    `);
    
    const result = insert.run(
      data.name,
      data.proficiency,
      data.category
    );
    
    const newSkill = db.prepare('SELECT * FROM skills WHERE id = ?').get(result.lastInsertRowid) as { 
      id: string; 
      name: string; 
      proficiency: number; 
      category: string; 
      created_at: string; 
    };
    
    return NextResponse.json(newSkill);
  } catch (error) {
    console.error('Failed to create skill:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}