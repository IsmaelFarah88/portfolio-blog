import { NextResponse } from 'next/server';
import db from '@/lib/db-server';

// GET /api/blog/[id] - Get a specific blog post
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
    
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    const formattedPost = {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : []
    };
    
    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PUT /api/blog/[id] - Update a specific blog post
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Check if post exists
    const existingPost = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
    if (!existingPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    const update = db.prepare(`
      UPDATE blog_posts 
      SET title = ?, excerpt = ?, content = ?, tags = ?, image_url = ?, link_url = ?
      WHERE id = ?
    `);
    
    const result = update.run(
      data.title || existingPost.title,
      data.excerpt || existingPost.excerpt,
      data.content || existingPost.content,
      data.tags ? JSON.stringify(data.tags) : existingPost.tags,
      data.imageUrl !== undefined ? data.imageUrl : existingPost.image_url,
      data.linkUrl !== undefined ? data.linkUrl : existingPost.link_url,
      id
    );
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    const updatedPost = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
    const formattedPost = {
      ...updatedPost,
      tags: updatedPost.tags ? JSON.parse(updatedPost.tags) : []
    };
    
    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Failed to update blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE /api/blog/[id] - Delete a specific blog post
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const remove = db.prepare('DELETE FROM blog_posts WHERE id = ?');
    const result = remove.run(id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}