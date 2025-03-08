'use server'

import { revalidatePath } from 'next/cache'
import  prisma  from '@/database/index'


export async function toggleWishlistItem(userId: string, productId: string, productVariantId?: number) {
  console.log("Toggling wishlist item:", { userId, productId, productVariantId });
    
  try {
    const wishlist = await prisma.wishlist.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId,
        productVariantId: productVariantId || undefined,
      },
    });

    if (existingItem) {
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id },
      });
    } else {
      const createData: any = {
        wishlistId: wishlist.id,
        productId,
      };

      if (productVariantId !== undefined) {
        createData.productVariantId = productVariantId;
      }

      await prisma.wishlistItem.create({
        data: createData,
      });
    }

    revalidatePath('/products');
    return { success: true, message: existingItem ? 'Removed from wishlist' : 'Added to wishlist' };
  } catch (error) {
    console.error('Failed to toggle wishlist item:', error);
    return { success: false, error: 'Failed to update wishlist' };
  }
}

export async function getWishlistedItems(userId: string) {
  try {
    const wishlistedItems = await prisma.product.findMany({
      where: {
        wishlistItems: {
          some: {
            wishlist: {
              userId: userId,
            },
          },
        },
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
        wishlistItems: {
          where: {
            wishlist: {
              userId: userId,
            },
          },
          select: {
            id: true,
          },
        },
      },
    });

    const formattedWishlistedItems = wishlistedItems.map(item => ({
      ...item,
      isWishlisted: true, 
    }));

    return { success: true, products: formattedWishlistedItems };
  } catch (error) {
    console.error("Failed to fetch wishlisted items:", error);
    return { success: false, error: "Failed to fetch wishlisted items" };
  }
}

interface ReviewData {
  userId: string;
  productId: string;
  rating: number;
  comment: string;
}

export async function addProductReview(reviewData: ReviewData) {
  try {
    await prisma.review.create({
      data: {
        userId: reviewData.userId,
        productId: reviewData.productId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      },
    });

    revalidatePath(`/products/${reviewData.productId}`);
    return { success: true, message: 'Review added successfully' };
  } catch (error) {
    console.error('Failed to add review:', error);
    return { success: false, error: 'Failed to add review' };
  }
}

export async function getProductReviews(productId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            name: true
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, reviews };
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return { success: false, error: 'Failed to fetch reviews' };
  }
}

export async function getProductReviewSummary(productId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return {
        success: true,
        summary: {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
          }
        }
      };
    }

    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
    
    // Calculate rating distribution
    const ratingDistribution = reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Ensure all ratings (1-5) are represented
    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = ratingDistribution[i] || 0;
    }

    return {
      success: true,
      summary: {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews,
        ratingDistribution
      }
    };
  } catch (error) {
    console.error('Failed to fetch review summary:', error);
    return { success: false, error: 'Failed to fetch review summary' };
  }
}