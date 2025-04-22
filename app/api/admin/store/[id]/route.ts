import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/database/index';

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Or restrict to specific origin
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const origin = req.headers.get('origin') || '*';
  const storeId = params.id;
  const body = await req.json();

  const { status, rejectionReason } = body;

  if (!['SUCCESS', 'REJECTED'].includes(status)) {
    return NextResponse.json(
      { success: false, message: 'Invalid status' },
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': origin,
        },
      }
    );
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

    return NextResponse.json(
      { success: true, data: updatedStore },
      {
        headers: {
          'Access-Control-Allow-Origin': origin,
        },
      }
    );
  } catch (error) {
    console.error('[ADMIN_UPDATE_STORE_STATUS]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update store status' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': origin,
        },
      }
    );
  }
}
