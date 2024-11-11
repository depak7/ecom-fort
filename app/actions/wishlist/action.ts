
'use server'

import { revalidatePath } from 'next/cache'
import  prisma  from '@/database/index'


export async function toggleWishlistItem(userId: string, productId: string, productVariantId?: number) {
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