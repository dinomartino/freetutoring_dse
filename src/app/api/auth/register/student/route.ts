import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';
import { sendEmail, getStudentRegistrationEmail } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      fullName,
      phone,
      gradeLevel,
      subjectsNeeded,
      specialNeedsDescription,
    } = body;

    // Validate required fields
    if (!email || !password || !fullName || !phone || !gradeLevel || !subjectsNeeded || !specialNeedsDescription) {
      return NextResponse.json(
        { error: '所有欄位都是必填的' },
        { status: 400 }
      );
    }

    // 1. Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Set to true in production to require email verification
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: '創建用戶失敗' },
        { status: 500 }
      );
    }

    try {
      // 2. Create user profile
      await prisma.userProfile.create({
        data: {
          id: authData.user.id,
          role: 'STUDENT',
        },
      });

      // 3. Create student profile
      await prisma.studentProfile.create({
        data: {
          userId: authData.user.id,
          fullName,
          phone,
          gradeLevel,
          subjectsNeeded,
          specialNeedsDescription,
          verificationDocuments: [],
          verificationStatus: 'PENDING',
        },
      });

      // 4. Send registration confirmation email
      try {
        const emailTemplate = getStudentRegistrationEmail(fullName, email);
        await sendEmail(emailTemplate);
      } catch (emailError) {
        // Log email error but don't fail registration
        console.error('Failed to send registration email:', emailError);
      }

      return NextResponse.json({
        success: true,
        message: '註冊成功！請查收驗證郵件。',
        userId: authData.user.id,
      });
    } catch (dbError) {
      // Rollback: delete auth user if database operations fail
      console.error('Database error:', dbError);
      await supabase.auth.admin.deleteUser(authData.user.id);

      return NextResponse.json(
        { error: '創建用戶資料失敗，請重試' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '註冊過程發生錯誤' },
      { status: 500 }
    );
  }
}
