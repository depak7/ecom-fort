import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/database/index'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Redis } from '@upstash/redis'
import { Prisma } from '@prisma/client'

const redis = Redis.fromEnv();

interface SearchToken {
  productIds: string[]
  scores: number[]
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')
  const city = searchParams.get('city')
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') || 'relevance'
  const type = searchParams.get('type') || 'all'
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!query) {
    return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 })
  }

  try {
    let stores: unknown[] = []

    if (type === 'all' || type === 'stores') {
      if (city) {
        stores = await prisma.$queryRaw`
          SELECT 
            id, name, logo, description, city, address, "mapLink", "ownerId", "bannerImage", "offerDescription"
          FROM "Store"
          WHERE "isApproved" = true
            AND LOWER(city) = LOWER(${city})
            AND to_tsvector('english', name || ' ' || description)
                  @@ plainto_tsquery('english', ${query})
          ORDER BY ts_rank(
                  to_tsvector('english', name || ' ' || description),
                  plainto_tsquery('english', ${query})
                ) DESC
          LIMIT 20;
        `
      } else {
        stores = await prisma.$queryRaw`
          SELECT 
            id, name, logo, description, city, address, "mapLink", "ownerId", "bannerImage", "offerDescription"
          FROM "Store"
          WHERE "isApproved" = true
            AND to_tsvector('english', name || ' ' || description)
                  @@ plainto_tsquery('english', ${query})
          ORDER BY ts_rank(
                  to_tsvector('english', name || ' ' || description),
                  plainto_tsquery('english', ${query})
                ) DESC
          LIMIT 20;
        `
      }
    }

    let productsWithWishlistStatus: Array<Record<string, unknown>> = []

    if (type === 'all' || type === 'products') {
      const productWhere: Prisma.ProductWhereInput = {
        AND: [
          {
            store: {
              isApproved: true,
              ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),
            },
          },
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { category: { contains: query, mode: 'insensitive' } },
              { store: { name: { contains: query, mode: 'insensitive' } } },
            ],
          },
          ...(category
            ? [{ category: { equals: category, mode: 'insensitive' as const } }]
            : []),
        ],
      }

      let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
      if (sort === 'price-low-high') {
        orderBy = { price: 'asc' }
      } else if (sort === 'price-high-low') {
        orderBy = { price: 'desc' }
      } else if (sort === 'new-arrivals') {
        orderBy = { createdAt: 'desc' }
      }

      const products = await prisma.product.findMany({
        where: productWhere,
        orderBy,
        take: 50,
        select: {
          id: true,
          store: {
            select: {
              id: true,
              name: true,
              logo: true,
              description: true,
              city: true,
            },
          },
          category: true,
          description: true,
          name: true,
          storeId: true,
          price: true,
          variants: { select: { variantImage: true } },
          productImage: true,
          wishlistItems: userId
            ? {
              where: { wishlist: { userId } },
              select: { id: true },
            }
            : false,
        },
      });

      productsWithWishlistStatus = products.map((p) => ({
        ...p,
        isWishlisted: userId ? (p.wishlistItems?.length ?? 0) > 0 : false,
      }));
    }

    const categories = await prisma.product.findMany({
      where: {
        category: { not: null },
        store: { isApproved: true },
      },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return NextResponse.json({
      status: true,
      stores,
      productsWithWishlistStatus,
      categories: categories.map((c) => c.category).filter(Boolean),
      count: productsWithWishlistStatus.length,
      source: "db",
    });

  } catch (error) {
    console.error(error)
    return NextResponse.json({ status: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const contentType = req.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      await req.formData()
      return NextResponse.json(
        {
          success: false,
          message: "Image search is disabled. Use text search.",
        },
        { status: 503 },
      );
    }

    if (contentType.includes("application/json")) {

      const { token } = await req.json()
      if (!token) {
        return NextResponse.json(
          { success: false, message: "Invalid request" },
          { status: 400 }
        )
      }

      const stored = await redis.get<SearchToken>(token)
      if (!stored) {
        return NextResponse.json(
          { success: false, message: "Token expired or invalid" },
          { status: 404 }
        )
      }
     
      const { productIds, scores } = stored

      if (!productIds || productIds === undefined || !scores || scores === undefined) {
        return NextResponse.json(
          { success: false, message: "Malformed token data" },
          { status: 500 }
        )
      }
      let products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          price: true,
          productImage: true,
          variants: { select: { variantImage: true } },
          store: {
            select: {
              id: true,
              name: true,
              logo: true,
              description: true,
            },
          },
          wishlistItems: userId
            ? {
              where: { wishlist: { userId } },
              select: { id: true },
            }
            : false,
        },
      });

      const ordered = productIds
        .map((id: string, index: number) => {
          const product = products.find((p) => p.id === id)
          if (!product) return null
          return { ...product, aiScore: scores[index] ?? 0 }
        })
        .filter((p): p is NonNullable<typeof p> => p !== null)
        .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))


      const productsWithWishlistStatus = ordered.map((p) => ({
        ...p,
        isWishlisted: userId ? p != null && p.wishlistItems?.length > 0 : false,
      }));

      return NextResponse.json({
        status: true,
        productsWithWishlistStatus,
        count: productsWithWishlistStatus.length
      });
    }

    return NextResponse.json(
      { success: false, message: "Unsupported content type" },
      { status: 400 },
    )
  } catch (error) {
    console.error("Error in image-search by ids", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
