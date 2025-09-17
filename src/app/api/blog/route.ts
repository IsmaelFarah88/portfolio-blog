import { NextResponse } from 'next/server';
import db from '@/lib/db-mysql';

// GET /api/blog - Get all blog posts
export async function GET() {
  try {
    const [posts]: any = await db.execute('SELECT * FROM blog_posts ORDER BY date DESC');
    const formattedPosts = Array.isArray(posts) ? posts.map(post => {
      let tags = [];
      try {
        if (post.tags) {
          tags = JSON.parse(post.tags);
        }
      } catch (error) {
        console.error(`Failed to parse tags for post ${post.id}:`, error);
      }
      return {
        ...post,
        tags: tags
      };
    }) : [];
    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST /api/blog - Create a new blog post
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const [result]: any = await db.execute(
      'INSERT INTO blog_posts (title, excerpt, content, date, tags, image_url, link_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        data.title,
        data.excerpt,
        data.content,
        data.date,
        JSON.stringify(data.tags),
        data.imageUrl || null,
        data.linkUrl || null
      ]
    );
    
    const [newPosts]: any = await db.execute('SELECT * FROM blog_posts WHERE id = ?', [result.insertId]);
    const newPost = newPosts[0];
    const formattedPost = {
      ...newPost,
      tags: newPost.tags ? JSON.parse(newPost.tags) : []
    };
    
    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Failed to create blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}