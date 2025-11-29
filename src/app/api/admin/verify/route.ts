import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, getApprovalEmail, getRejectionEmail } from '@/lib/email';

export async function POST(request: Request) {
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

    // Parse request body
    const body = await request.json();
    const { profileId, profileType, action, notes } = body;

    // Validate input
    if (!profileId || !profileType || !action) {
      return NextResponse.json(
        { error: '缺少必要參數' },
        { status: 400 }
      );
    }

    if (!['student', 'tutor'].includes(profileType)) {
      return NextResponse.json(
        { error: '無效的用戶類型' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: '無效的操作' },
        { status: 400 }
      );
    }

    const verificationStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';

    // Get profile to retrieve user email and name
    let profile: any;
    let userId: string;
    let fullName: string;

    if (profileType === 'student') {
      profile = await prisma.studentProfile.findUnique({
        where: { id: profileId },
      });
      userId = profile?.userId;
      fullName = profile?.fullName;

      // Update the profile
      await prisma.studentProfile.update({
        where: { id: profileId },
        data: {
          verificationStatus,
          verificationNotes: notes || null,
          updatedAt: new Date(),
        },
      });
    } else {
      profile = await prisma.tutorProfile.findUnique({
        where: { id: profileId },
      });
      userId = profile?.userId;
      fullName = profile?.fullName;

      // Update the profile
      await prisma.tutorProfile.update({
        where: { id: profileId },
        data: {
          verificationStatus,
          verificationNotes: notes || null,
          updatedAt: new Date(),
        },
      });
    }

    // Send email notification
    if (userId && fullName) {
      try {
        // Get user email from Supabase
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

        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);

        if (authUser.user?.email) {
          const emailTemplate = action === 'approve'
            ? getApprovalEmail(fullName, authUser.user.email, profileType as 'student' | 'tutor')
            : getRejectionEmail(fullName, authUser.user.email, profileType as 'student' | 'tutor', notes);

          await sendEmail(emailTemplate);
        }
      } catch (emailError) {
        // Log email error but don't fail the verification
        console.error('Failed to send verification email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: action === 'approve' ? '已批准' : '已拒絕',
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    return NextResponse.json(
      { error: '驗證用戶時發生錯誤' },
      { status: 500 }
    );
  }
}
