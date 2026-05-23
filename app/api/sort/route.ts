import { NextResponse } from 'next/server';
import { readOnlyPrisma } from '@/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sort = url.searchParams.get('sort');
  const city = url.searchParams.get('city');
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

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
      orderBy = { createdAt: 'desc' };
      break;
  }

  try {
    const products = await readOnlyPrisma.product.findMany({
      where: {
        store: {
          isApproved: true,
          ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),
        },
      },
      orderBy,
      include: {
        store: true,
        variants: true,
        wishlistItems: userId
          ? {
              where: { wishlist: { userId } },
            }
          : false,
      },
    });

    const productsWithWishlistStatus = products.map((product) => ({
      ...product,
      price: product.price.toString(),
      isWishlisted: userId ? product.wishlistItems?.length > 0 : false,
    }));

    return NextResponse.json({ success: true, products: productsWithWishlistStatus });
  } catch (error) {
    console.error('[GET_PRODUCTS]', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch products' }, { status: 500 });
  }
}
