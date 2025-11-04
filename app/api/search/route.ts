import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/database/index'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')
  const userId = searchParams.get('userId')

  if (!query) {
    return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 })
  }

  try {
    // Query stores based on the provided search query
    const stores = await prisma.$queryRaw`
    SELECT 
      id, name, logo, description, city, address, "mapLink", "ownerId", "bannerImage", "offerDescription"
    FROM "Store"
    WHERE to_tsvector('english', name || ' ' || description)
          @@ plainto_tsquery('english', ${query})
    ORDER BY ts_rank(
            to_tsvector('english', name || ' ' || description),
            plainto_tsquery('english', ${query})
          ) DESC
    LIMIT 20;
  `


    // Query products based on the search query and optional userId for wishlist status
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        store: true,
        category: true,
        description: true,
        name: true,
        storeId: true,
        price: true,
        variants: {
          select: {
            variantImage: true,
          },
        },
        wishlistItems: userId
          ? {
              where: {
                wishlist: {
                  userId: userId,
                },
              },
              select: {
                id: true,
              },
            }
          : false,
      },
    })

    // Add wishlist status to each product
    const productsWithWishlistStatus = products.map((product) => ({
      ...product,
      isWishlisted: userId ? product.wishlistItems.length > 0 : false,
    }))

    return NextResponse.json({ stores, productsWithWishlistStatus })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}