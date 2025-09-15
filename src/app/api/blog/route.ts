import { NextResponse } from 'next/server';
import db from '@/lib/db-server';

// Define the blog post type
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string;
  image_url: string | null;
  link_url: string | null;
  created_at: string;
}

// GET /api/blog - Get all blog posts
export async function GET() {
  try {
    const posts = db.prepare('SELECT * FROM blog_posts ORDER BY date DESC').all() as BlogPost[];
    const formattedPosts = posts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : []
    }));
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
    
    const insert = db.prepare(`
      INSERT INTO blog_posts (title, excerpt, content, date, tags, image_url, link_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = insert.run(
      data.title,
      data.excerpt,
      data.content,
      data.date,
      JSON.stringify(data.tags),
      data.imageUrl || null,
      data.linkUrl || null
    );
    
    const newPost = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(result.lastInsertRowid) as BlogPost;
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