import { NextResponse } from 'next/server';
import db from '@/lib/db-mysql';

// GET /api/site-content - Get all site content
export async function GET() {
  try {
    const [contents]: any = await db.execute('SELECT * FROM site_content');
    
    // Convert to object for easier access
    const contentMap: Record<string, string> = {};
    contents.forEach((content: any) => {
      contentMap[content.id] = content.content;
    });
    
    return NextResponse.json(contentMap);
  } catch (error) {
    console.error('Failed to fetch site content:', error);
    return NextResponse.json({ error: 'Failed to fetch site content' }, { status: 500 });
  }
}

// PUT /api/site-content - Update site content
export async function PUT(request: Request) {
  try {
    const data = await request.json() as Record<string, string>;
    
    // Update each content item
    for (const [id, content] of Object.entries(data)) {
      // Use INSERT ... ON DUPLICATE KEY UPDATE for MySQL
      await db.execute(
        'INSERT INTO site_content (id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = ?',
        [id, content, content]
      );
    }
    
    return NextResponse.json({ message: 'Site content updated successfully' });
  } catch (error) {
    console.error('Failed to update site content:', error);
    return NextResponse.json({ error: 'Failed to update site content' }, { status: 500 });
  }
}