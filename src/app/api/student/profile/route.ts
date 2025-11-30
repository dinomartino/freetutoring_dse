import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: '缺少用戶ID' },
        { status: 400 }
      );
    }

    // Fetch student profile
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      select: {
        fullName: true,
        phone: true,
        gradeLevel: true,
        subjectsNeeded: true,
        specialNeedsDescription: true,
        verificationStatus: true,
        verificationNotes: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: '找不到學生資料' },
        { status: 404 }
      );
    }

    // Fetch connection requests
    const studentProfileId = await prisma.studentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    let connections: any[] = [];
    if (studentProfileId) {
      connections = await prisma.connectionRequest.findMany({
        where: { studentId: studentProfileId.id },
        select: {
          id: true,
          status: true,
          notes: true,
          createdAt: true,
          tutor: {
            select: {
              fullName: true,
              subjectsTaught: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({
      profile,
      connections,
    });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return NextResponse.json(
      { error: '獲取資料時發生錯誤' },
      { status: 500 }
    );
  }
}
