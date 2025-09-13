import { NextResponse } from 'next/server';
import db from '@/lib/db-server';

// GET /api/certifications - Get all certifications
export async function GET() {
  try {
    const certifications = db.prepare('SELECT * FROM certifications ORDER BY date_issued DESC').all() as { 
      id: string; 
      title: string; 
      organization: string; 
      date_issued: string; 
      expiry_date: string | null; 
      credential_id: string | null; 
      url: string | null; 
      created_at: string; 
    }[];
    
    return NextResponse.json(certifications);
  } catch (error) {
    console.error('Failed to fetch certifications:', error);
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}

// POST /api/certifications - Create a new certification
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const insert = db.prepare(`
      INSERT INTO certifications (title, organization, date_issued, expiry_date, credential_id, url)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = insert.run(
      data.title,
      data.organization,
      data.date_issued,
      data.expiry_date || null,
      data.credential_id || null,
      data.url || null
    );
    
    const newCertification = db.prepare('SELECT * FROM certifications WHERE id = ?').get(result.lastInsertRowid) as { 
      id: string; 
      title: string; 
      organization: string; 
      date_issued: string; 
      expiry_date: string | null; 
      credential_id: string | null; 
      url: string | null; 
      created_at: string; 
    };
    
    return NextResponse.json(newCertification);
  } catch (error) {
    console.error('Failed to create certification:', error);
    return NextResponse.json({ error: 'Failed to create certification' }, { status: 500 });
  }
}