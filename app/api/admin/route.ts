import { NextResponse } from 'next/server';
import { readOnlyPrisma } from '@/database/index'; // adjust the path to your prisma client

export async function GET() {
  try {
    const stores = await readOnlyPrisma.store.findMany();

    const response = NextResponse.json({ success: true, data: stores });
    response.headers.set('Cache-Control', 'no-store, max-age=0');

    return response;
  } catch (error) {
    console.error('[ADMIN_GET_STORES]', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch stores' }, { status: 500 });
  }
}
