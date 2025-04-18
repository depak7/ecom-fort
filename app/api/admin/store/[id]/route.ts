import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/database/index';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const storeId = params.id;
  const body = await req.json();

  const { status, rejectionReason } = body;

  if (!['SUCCESS', 'REJECTED'].includes(status)) {
    return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
  }

  try {
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        isApproved: status === 'SUCCESS',
        isActive: status === 'SUCCESS',
        verificationStatus: status,
        rejectionReason: status === 'REJECTED' ? rejectionReason || 'No reason provided' : null,
      },
    });

    return NextResponse.json({ success: true, data: updatedStore });
  } catch (error) {
    console.error('[ADMIN_UPDATE_STORE_STATUS]', error);
    return NextResponse.json({ success: false, message: 'Failed to update store status' }, { status: 500 });
  }
}
