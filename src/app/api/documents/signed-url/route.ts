import { NextRequest, NextResponse } from 'next/server';
import { getSignedR2Url } from '@/lib/r2';

/**
 * API endpoint to generate signed URLs for accessing documents in R2
 * This is needed because R2 buckets are private by default
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentUrl } = body;

    if (!documentUrl) {
      return NextResponse.json(
        { error: '缺少文件URL' },
        { status: 400 }
      );
    }

    // Extract the key from the URL
    // The documentUrl might be in format: https://bucket.r2.dev/path/to/file
    // or just the path: tutor/userId/filename.pdf
    let key = documentUrl;

    // If it's a full URL, extract the key (path after bucket name)
    if (documentUrl.includes('r2.dev/') || documentUrl.includes('.r2.cloudflarestorage.com/')) {
      const urlParts = documentUrl.split('/');
      // Get everything after the domain
      const domainIndex = urlParts.findIndex((part: string) =>
        part.includes('r2.dev') || part.includes('.r2.cloudflarestorage.com')
      );
      if (domainIndex !== -1) {
        key = urlParts.slice(domainIndex + 1).join('/');
      }
    }

    // Generate signed URL (valid for 1 hour)
    const signedUrl = await getSignedR2Url(key, 3600);

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json(
      { error: '生成簽名URL時發生錯誤' },
      { status: 500 }
    );
  }
}
