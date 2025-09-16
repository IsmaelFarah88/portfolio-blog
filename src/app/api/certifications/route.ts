import { NextResponse } from 'next/server';
import db from '@/lib/db-mysql';

// GET /api/certifications - Get all certifications
export async function GET() {
  try {
    const [certifications]: any = await db.execute('SELECT * FROM certifications ORDER BY date_issued DESC');
    
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
    
    const [result]: any = await db.execute(
      'INSERT INTO certifications (title, organization, date_issued, expiry_date, credential_id, url) VALUES (?, ?, ?, ?, ?, ?)',
      [
        data.title,
        data.organization,
        data.date_issued,
        data.expiry_date || null,
        data.credential_id || null,
        data.url || null
      ]
    );
    
    const [newCertifications]: any = await db.execute('SELECT * FROM certifications WHERE id = ?', [result.insertId]);
    const newCertification = newCertifications[0];
    
    return NextResponse.json(newCertification);
  } catch (error) {
    console.error('Failed to create certification:', error);
    return NextResponse.json({ error: 'Failed to create certification' }, { status: 500 });
  }
}