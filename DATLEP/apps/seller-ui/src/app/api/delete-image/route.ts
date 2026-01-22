import { NextRequest, NextResponse } from 'next/server';
import { imagekit } from '../../../lib/imagekit';

export async function POST(request: NextRequest) {
  try {
    const { fileId } = await request.json();

    await imagekit.files.delete(fileId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
