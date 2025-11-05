import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/database/index'
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')
  const userId = searchParams.get('userId')

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
          productImage:true,
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
          productImage:true,
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
      status:true,
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