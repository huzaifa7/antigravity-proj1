import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    await prisma.$queryRaw`SELECT 1;`
    await prisma.$disconnect()
    
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString(), db: 'connected' })
  } catch (error) {
    return NextResponse.json({ status: 'error', timestamp: new Date().toISOString(), db: 'disconnected', error: String(error) }, { status: 500 })
  }
}
