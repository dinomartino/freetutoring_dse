import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { connectionId, action } = body;

    if (!connectionId || !action) {
      return NextResponse.json(
        { error: '缺少必要參數' },
        { status: 400 }
      );
    }

    if (action !== 'accept' && action !== 'decline') {
      return NextResponse.json(
        { error: '無效的操作' },
        { status: 400 }
      );
    }

    // Update connection status
    const newStatus = action === 'accept' ? 'ACCEPTED' : 'DECLINED';

    await prisma.connectionRequest.update({
      where: { id: connectionId },
      data: { status: newStatus },
    });

    return NextResponse.json({
      success: true,
      message: action === 'accept' ? '已接受配對申請' : '已拒絕配對申請',
    });
  } catch (error) {
    console.error('Error updating connection request:', error);
    return NextResponse.json(
      { error: '更新配對申請時發生錯誤' },
      { status: 500 }
    );
  }
}
