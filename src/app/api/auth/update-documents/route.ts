import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userType, documentUrls } = body;

    if (!userId || !userType || !documentUrls) {
      return NextResponse.json(
        { error: '缺少必要參數' },
        { status: 400 }
      );
    }

    if (userType === 'tutor') {
      await prisma.tutorProfile.update({
        where: { userId },
        data: {
          verificationDocuments: documentUrls,
        },
      });
    } else if (userType === 'student') {
      await prisma.studentProfile.update({
        where: { userId },
        data: {
          verificationDocuments: documentUrls,
        },
      });
    } else {
      return NextResponse.json(
        { error: '無效的用戶類型' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '文件 URL 更新成功',
    });
  } catch (error) {
    console.error('Update documents error:', error);
    return NextResponse.json(
      { error: '更新文件失敗' },
      { status: 500 }
    );
  }
}
