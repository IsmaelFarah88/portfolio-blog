import { NextResponse } from 'next/server';
import db from '@/lib/db-mysql';

// GET /api/skills - Get all skills
export async function GET() {
  try {
    const [skills]: any = await db.execute('SELECT * FROM skills ORDER BY category, name');
    
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
    
    const [result]: any = await db.execute(
      'INSERT INTO skills (name, proficiency, category) VALUES (?, ?, ?)',
      [
        data.name,
        data.proficiency,
        data.category
      ]
    );
    
    const [newSkills]: any = await db.execute('SELECT * FROM skills WHERE id = ?', [result.insertId]);
    const newSkill = newSkills[0];
    
    return NextResponse.json(newSkill);
  } catch (error) {
    console.error('Failed to create skill:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}