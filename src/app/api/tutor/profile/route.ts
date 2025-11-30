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

    // Fetch tutor profile
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
      select: {
        fullName: true,
        phone: true,
        educationLevel: true,
        subjectsTaught: true,
        bio: true,
        verificationStatus: true,
        verificationNotes: true,
        examResults: true,
        availability: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: '找不到導師資料' },
        { status: 404 }
      );
    }

    // Fetch connection requests
    const tutorProfileId = await prisma.tutorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    let connections: any[] = [];
    if (tutorProfileId) {
      connections = await prisma.connectionRequest.findMany({
        where: { tutorId: tutorProfileId.id },
        select: {
          id: true,
          status: true,
          notes: true,
          createdAt: true,
          student: {
            select: {
              fullName: true,
              gradeLevel: true,
              subjectsNeeded: true,
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
    console.error('Error fetching tutor profile:', error);
    return NextResponse.json(
      { error: '獲取資料時發生錯誤' },
      { status: 500 }
    );
  }
}
