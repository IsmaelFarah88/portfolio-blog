import { NextResponse } from 'next/server';
import db from '@/lib/db-server';

// GET /api/site-content - Get all site content
export async function GET() {
  try {
    const contents = db.prepare('SELECT * FROM site_content').all() as { id: string; content: string }[];
    
    // Convert to object for easier access
    const contentMap: Record<string, string> = {};
    contents.forEach((content) => {
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
    const update = db.prepare(`
      INSERT OR REPLACE INTO site_content (id, content)
      VALUES (?, ?)
    `);
    
    Object.entries(data).forEach(([id, content]) => {
      update.run(id, content);
    });
    
    return NextResponse.json({ message: 'Site content updated successfully' });
  } catch (error) {
    console.error('Failed to update site content:', error);
    return NextResponse.json({ error: 'Failed to update site content' }, { status: 500 });
  }
}