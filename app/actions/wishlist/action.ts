'use server'

import { revalidatePath } from 'next/cache'
import  prisma  from '@/database/index'
import { readOnlyPrisma } from '@/database/index';

export async function toggleWishlistItem(userId: string, productId: string, productVariantId?: number) {
  console.log("Toggling wishlist item:", { userId, productId, productVariantId });
    
  try {
    // Check if the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return { success: false, error: 'User does not exist' };
    }

    // If productVariantId is undefined, fetch the first variant
    let finalVariantId = productVariantId;
    if (productVariantId === undefined) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          variants: {
            take: 1,
          },
        },
      });
      
      if (product?.variants[0]) {
        finalVariantId = product.variants[0].id;
      }
    }

    const wishlist = await prisma.wishlist.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId,
        productVariantId: finalVariantId || undefined,
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

      if (finalVariantId !== undefined) {
        createData.productVariantId = finalVariantId;
      }

     let res= await prisma.wishlistItem.create({
        data: createData,
      });
      console.log(res);
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
    const wishlistedItems = await readOnlyPrisma.product.findMany({
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
    const reviews = await readOnlyPrisma.review.findMany({
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