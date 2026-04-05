import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  let dbStatus = 'connected';
  try {
    // Verify DB connection
    db.run(sql`SELECT 1`);
  } catch (error) {
    dbStatus = 'not configured';
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    db: dbStatus,
  });
}
