import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2, generateSafeFilename } from '@/lib/r2';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const userId = formData.get('userId') as string;
    const fileType = formData.get('fileType') as string; // 'tutor' or 'student'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: '未選擇任何文件' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: '缺少用戶 ID' },
        { status: 400 }
      );
    }

    // Validate file types
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `不支援的文件類型：${file.name}。僅支援 PDF、JPG、PNG 格式。` },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > maxFileSize) {
        return NextResponse.json(
          { error: `文件 ${file.name} 超過 10MB 限制` },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate safe filename
      const safeKey = generateSafeFilename(file.name, userId, fileType);

      // Upload to R2
      const url = await uploadToR2(buffer, safeKey, file.type);
      uploadedUrls.push(url);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      message: `成功上傳 ${uploadedUrls.length} 個文件`,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: '文件上傳失敗，請稍後重試' },
      { status: 500 }
    );
  }
}
