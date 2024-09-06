// app/actions/wishlist.ts
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/database/index'

export async function toggleWishlistItem(userId: string, productId: string,productVariantId:number) {
  const wishlist = await prisma.wishlist.upsert({
    where: { userId},
    create: { userId },
    update: {},
  })

  const existingItem = await prisma.wishlistItem.findFirst({
    where: {
      wishlistId: wishlist.id,
      productId,
    },
  })

  if (existingItem) {
    await prisma.wishlistItem.delete({
      where: { id: existingItem.id },
    })
  } else {
    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productVariantId:productVariantId,
        productId,
      },
    })
  }

  revalidatePath('/products')
  return { success: true }
}