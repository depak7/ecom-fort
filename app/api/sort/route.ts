import { NextResponse } from 'next/server';
import { readOnlyPrisma } from '@/database';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sort = url.searchParams.get('sort');

  let orderBy;

  switch (sort) {
    case 'price-low-high':
      orderBy = { price: 'asc' };
      break;
    case 'price-high-low':
      orderBy = { price: 'desc' };
      break;
    case 'new-arrivals':
    default:
      orderBy = { createdAt: 'desc' }; // Most recent first
      break;
  }

  try {
    const products = await readOnlyPrisma.product.findMany({
      orderBy,
      include: {
        store: true,
        variants: true,
        wishlistItems: true,
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('[GET_PRODUCTS]', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch products' }, { status: 500 });
  }
}
