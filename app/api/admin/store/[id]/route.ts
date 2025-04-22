import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/database/index';

// Define allowed origins and CORS options
const allowedOrigins = ['https://store-admin-portal.lovable.app/', 'http://localhost:3000'];
const corsOptions = {
  'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// Handle OPTIONS request for preflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const isAllowedOrigin = allowedOrigins.includes(origin);
  
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    },
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const origin = req.headers.get('origin') || '';
  const isAllowedOrigin = allowedOrigins.includes(origin);
  
  const storeId = params.id;
  const body = await req.json();

  const { status, rejectionReason } = body;

  if (!['SUCCESS', 'REJECTED'].includes(status)) {
    return NextResponse.json(
      { success: false, message: 'Invalid status' }, 
      { 
        status: 400,
        headers: {
          ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
          'Access-Control-Allow-Methods': corsOptions['Access-Control-Allow-Methods'],
        }
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
          ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
          'Access-Control-Allow-Methods': corsOptions['Access-Control-Allow-Methods'],
        }
      }
    );
  } catch (error) {
    console.error('[ADMIN_UPDATE_STORE_STATUS]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update store status' }, 
      { 
        status: 500,
        headers: {
          ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
          'Access-Control-Allow-Methods': corsOptions['Access-Control-Allow-Methods'],
        }
      }
    );
  }
}