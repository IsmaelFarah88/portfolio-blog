import { NextResponse } from 'next/server';
import db from '@/lib/db-mysql';

// GET /api/blog/[id] - Get a specific blog post
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [posts]: any = await db.execute('SELECT * FROM blog_posts WHERE id = ?', [id]);
    
    if (!posts || posts.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    const post = posts[0];
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
    const [existingPosts]: any = await db.execute('SELECT * FROM blog_posts WHERE id = ?', [id]);
    if (!existingPosts || existingPosts.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    const existingPost = existingPosts[0];
    
    const [result]: any = await db.execute(
      `UPDATE blog_posts 
      SET title = ?, excerpt = ?, content = ?, tags = ?, image_url = ?, link_url = ?
      WHERE id = ?`,
      [
        data.title || existingPost.title,
        data.excerpt || existingPost.excerpt,
        data.content || existingPost.content,
        data.tags ? JSON.stringify(data.tags) : existingPost.tags,
        data.imageUrl !== undefined ? data.imageUrl : existingPost.image_url,
        data.linkUrl !== undefined ? data.linkUrl : existingPost.link_url,
        id
      ]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    const [updatedPosts]: any = await db.execute('SELECT * FROM blog_posts WHERE id = ?', [id]);
    const updatedPost = updatedPosts[0];
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
    const [result]: any = await db.execute('DELETE FROM blog_posts WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}