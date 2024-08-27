import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/database/index'; 

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { id } = body;
        console.log("id"+id)

        const store = await prisma.store.delete({
           where:{
            id:id
           },
        });

        return NextResponse.json(store, { status: 200 });
    } catch (error) {
        console.error('Failed to create store:', error);
        return NextResponse.json({ error: 'Failed to create store' }, { status: 500 });
    }
}