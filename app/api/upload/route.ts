import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('logo') as File;

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    try {
        const blob = await put(file.name, file, {
            access: 'public',
        });

        return NextResponse.json({ url: blob.url });
    } catch (error) {
        console.error('Failed to upload file:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}