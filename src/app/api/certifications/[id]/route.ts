import { NextResponse } from 'next/server';
import db from '@/lib/db-mysql';

// GET /api/certifications/[id] - Get a specific certification
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [certifications]: any = await db.execute('SELECT * FROM certifications WHERE id = ?', [id]);
    
    if (!certifications || certifications.length === 0) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }
    
    return NextResponse.json(certifications[0]);
  } catch (error) {
    console.error('Failed to fetch certification:', error);
    return NextResponse.json({ error: 'Failed to fetch certification' }, { status: 500 });
  }
}

// PUT /api/certifications/[id] - Update a specific certification
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Check if certification exists
    const [existingCerts]: any = await db.execute('SELECT * FROM certifications WHERE id = ?', [id]);
    if (!existingCerts || existingCerts.length === 0) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }
    
    const existingCert = existingCerts[0];
    
    const [result]: any = await db.execute(
      `UPDATE certifications 
      SET title = ?, organization = ?, date_issued = ?, expiry_date = ?, credential_id = ?, url = ?
      WHERE id = ?`,
      [
        data.title || existingCert.title,
        data.organization || existingCert.organization,
        data.date_issued || existingCert.date_issued,
        data.expiry_date !== undefined ? data.expiry_date : existingCert.expiry_date,
        data.credential_id !== undefined ? data.credential_id : existingCert.credential_id,
        data.url !== undefined ? data.url : existingCert.url,
        id
      ]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }
    
    const [updatedCerts]: any = await db.execute('SELECT * FROM certifications WHERE id = ?', [id]);
    const updatedCert = updatedCerts[0];
    
    return NextResponse.json(updatedCert);
  } catch (error) {
    console.error('Failed to update certification:', error);
    return NextResponse.json({ error: 'Failed to update certification' }, { status: 500 });
  }
}

// DELETE /api/certifications/[id] - Delete a specific certification
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [result]: any = await db.execute('DELETE FROM certifications WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    console.error('Failed to delete certification:', error);
    return NextResponse.json({ error: 'Failed to delete certification' }, { status: 500 });
  }
}