import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    // Verify user is admin
    const userProfile = await prisma.userProfile.findUnique({
      where: { id: user.id },
    });

    if (!userProfile || userProfile.role !== 'ADMIN') {
      return NextResponse.json({ error: '權限不足' }, { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';
    const type = searchParams.get('type'); // 'student' or 'tutor'

    // Fetch pending students
    let students: any[] = [];
    if (!type || type === 'student') {
      students = await prisma.studentProfile.findMany({
        where: {
          verificationStatus: status as any,
        },
        include: {
          user: {
            select: {
              id: true,
              role: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // Fetch pending tutors
    let tutors: any[] = [];
    if (!type || type === 'tutor') {
      tutors = await prisma.tutorProfile.findMany({
        where: {
          verificationStatus: status as any,
        },
        include: {
          user: {
            select: {
              id: true,
              role: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // Get user emails from Supabase using service role
    const studentIds = students.map((s: any) => s.userId);
    const tutorIds = tutors.map((t: any) => t.userId);
    const allUserIds = [...studentIds, ...tutorIds];

    // Create admin client with service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Fetch emails from Supabase Auth (admin only)
    const emailMap: Record<string, string> = {};
    for (const userId of allUserIds) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (authUser.user) {
        emailMap[userId] = authUser.user.email || '';
      }
    }

    // Add emails to profiles
    const studentsWithEmail = students.map((student: any) => ({
      ...student,
      email: emailMap[student.userId] || '',
    }));

    const tutorsWithEmail = tutors.map((tutor: any) => ({
      ...tutor,
      email: emailMap[tutor.userId] || '',
    }));

    return NextResponse.json({
      students: studentsWithEmail,
      tutors: tutorsWithEmail,
    });
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { error: '獲取驗證資料時發生錯誤' },
      { status: 500 }
    );
  }
}
