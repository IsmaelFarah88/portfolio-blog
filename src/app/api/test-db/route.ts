import { NextResponse } from 'next/server';
import db from '@/lib/db-server';

// GET /api/test-db - Get all table names
export async function GET() {
  try {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[];
    const tableNames = tables.map(table => table.name);
    
    return NextResponse.json({ tables: tableNames });
  } catch (error) {
    console.error('Failed to fetch tables:', error);
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
}