import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/database/index'
import axios from "axios";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import crypto from "crypto"
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv();

interface SearchToken {
  productIds: string[]
  scores: number[]
}

const EXTERNAL_AI_API =
  "https://ai-product-search-service.livelyocean-b0186b38.southindia.azurecontainerapps.io/api/products/image-search"




export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!query) {
    return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 })
  }

  try {
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

    const aiResponse = await axios.post(
      "https://ai-product-search-service.livelyocean-b0186b38.southindia.azurecontainerapps.io/api/products/text-search",
      new URLSearchParams({ query, top_k: "50" }) // using form-data
    );

    const aiResults = aiResponse.data?.results || [];
    console.log(`🧠 AI search found ${aiResults.length} results for: ${query}`);

    // ✅ Extract product IDs & scores from AI results
    const idToScoreMap = new Map(
      aiResults
        .filter((r: any) => r?.metadata?.product_id)
        .map((r: any) => [r.metadata.product_id, r.score])
    );

    const productIds = Array.from(idToScoreMap.keys())
      .filter((id): id is string => typeof id === "string" && id.trim().length > 0);

    let products;

    if (!productIds.length) {
      console.warn("⚠️ No AI matches found, using fallback DB search.");

      products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
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
    } else {
      products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          price: true,
          productImage: true,
          variants: { select: { variantImage: true } },
          store: true,
          wishlistItems: userId
            ? {
              where: { wishlist: { userId } },
              select: { id: true },
            }
            : false,
        },
      });

      // ✅ Attach AI similarity score to each product
      products = products.map((p) => ({
        ...p,
        aiScore: idToScoreMap.get(p.id) || 0,
      }));

      // ✅ Sort by score descending (highest first)
      products.sort((a, b) => b.aiScore - a.aiScore);
    }

    // ✅ Add wishlist status
    const productsWithWishlistStatus = products.map((p) => ({
      ...p,
      isWishlisted: userId ? p.wishlistItems?.length > 0 : false,
    }));

    return NextResponse.json({
      status: true,
      stores,
      productsWithWishlistStatus,
      count: productsWithWishlistStatus.length,
      source: productIds.length ? "ai" : "fallback",
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

    // CASE 1: Image upload (multipart)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()

      const res = await fetch(EXTERNAL_AI_API, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        console.error("AI service error:", await res.text())
        return NextResponse.json({ success: false, error: "AI search failed" }, { status: 500 })
      }

      const data = await res.json()
      const productIds = (data?.results || []).map((r: any) => r?.metadata?.product_id).filter(Boolean)
      const scores = (data?.results || []).map((r: any) => r?.score || 0)

      if (!productIds.length) {
        return NextResponse.json({ success: false, message: "No matching products found" })
      }

      const token = crypto.randomUUID()
      await redis.set(token, JSON.stringify({ productIds, scores }))
      await redis.expire(token, 300)
      return NextResponse.json({ success: true, token })
    }

    // CASE 2: Token lookup (JSON)
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
          store: true,
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

    // Fallback: unsupported content type
    return NextResponse.json(
      { success: false, message: "Unsupported content type" },
      { status: 400 },
    )
  } catch (error) {
    console.error("Error in image-search by ids", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}