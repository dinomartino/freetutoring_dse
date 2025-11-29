import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL; // Optional: if you have a custom domain

/**
 * Upload a file to R2 storage
 * @param file - The file to upload (Buffer or Blob)
 * @param key - The object key (path) in the bucket
 * @param contentType - The MIME type of the file
 * @returns The public URL of the uploaded file
 */
export async function uploadToR2(
  file: Buffer | Uint8Array,
  key: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Return public URL
  if (PUBLIC_URL) {
    return `${PUBLIC_URL}/${key}`;
  } else {
    // If no custom domain, use R2 public bucket URL format
    return `https://${BUCKET_NAME}.r2.dev/${key}`;
  }
}

/**
 * Delete a file from R2 storage
 * @param key - The object key (path) in the bucket
 */
export async function deleteFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
}

/**
 * Generate a signed URL for temporary access to a private file
 * @param key - The object key (path) in the bucket
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns A signed URL that expires after the specified time
 */
export async function getSignedR2Url(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Generate a safe filename with timestamp
 * @param originalFilename - The original filename
 * @param userId - The user ID for organization
 * @param prefix - Optional prefix (e.g., 'tutor', 'student')
 * @returns A safe, unique filename
 */
export function generateSafeFilename(
  originalFilename: string,
  userId: string,
  prefix: string = 'doc'
): string {
  const timestamp = Date.now();
  const extension = originalFilename.split('.').pop();
  const safeName = originalFilename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 50);

  return `${prefix}/${userId}/${timestamp}-${safeName}`;
}
