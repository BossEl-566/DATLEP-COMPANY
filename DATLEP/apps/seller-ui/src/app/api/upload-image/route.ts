import { NextRequest, NextResponse } from 'next/server';
import { imagekit } from '../../../lib/imagekit';
import { toFile } from '@imagekit/nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadFile = await toFile(buffer, file.name);

    const response = await imagekit.files.upload({
      file: uploadFile,
      fileName: file.name,
      folder: '/products',
      useUniqueFileName: true,
      tags: ['product-image'],
    });

    return NextResponse.json({
      success: true,
      url: `${process.env.IMAGEKIT_URL_ENDPOINT}${response.filePath}`,
      fileId: response.fileId,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
