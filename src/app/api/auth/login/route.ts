import { NextResponse } from 'next/server';
import db from '@/lib/db-mysql';

// POST /api/auth/login - Authenticate user
export async function POST(request: Request) {
  try {
    // Parse the request body using text() method first
    let username, password;
    try {
      const bodyText = await request.text();
      console.log('Raw body:', bodyText);
      
      if (!bodyText) {
        return NextResponse.json({ error: 'Request body is empty' }, { status: 400 });
      }
      
      const body = JSON.parse(bodyText);
      username = body.username;
      password = body.password;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }
    
    // Get user from database
    const [users]: any = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    const user = users && users.length > 0 ? users[0] : undefined;
    
    // Simple authentication (in a real app, this would use proper password hashing)
    if (user && user.password === password) {
      // In a real application, you would create a proper session or JWT token here
      return NextResponse.json({ 
        message: 'Login successful',
        user: { id: user.id, username: user.username }
      });
    } else {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}