import { NextResponse } from 'next/server';
import { readOnlyPrisma } from '@/database/index'; // adjust the path to your prisma client

export async function GET() {
  try {
    const stores = await readOnlyPrisma.store.findMany({
      include: {
        owner: true,
        products: true,
        orderItems: true,
      },
    });

    return NextResponse.json({ success: true, data: stores });
  } catch (error) {
    console.error('[ADMIN_GET_STORES]', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch stores' }, { status: 500 });
  }
}
