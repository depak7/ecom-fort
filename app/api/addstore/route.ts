import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/database/index'; 

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, description, bannerImageUrl, city } = body;

        if (!name || !description || !bannerImageUrl || !city) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const store = await prisma.store.create({
            data: {
                name,
                description,
                bannerImage: bannerImageUrl,
                city, 
            }
        });

        return NextResponse.json(store, { status: 201 });
    } catch (error: any) {
        console.error('Failed to create store:', error.message || error);
        return NextResponse.json({ error: 'Failed to create store' }, { status: 500 });
    }
}