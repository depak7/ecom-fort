import prisma from '@/database/index'

export async function searchStoresAndProducts(query:string,userId?:string) {
  const stores = await prisma.store.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
        id: true,
        name: true,
        logo: true,
        description: true,
        city: true,
        address: true,
        mapLink: true,
        ownerId: true,
        bannerImage: true,
        offerDescription: true,
      },
  })

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
        wishlistItems: userId ? {
          where: {
            wishlist: {
              userId: userId,
            },
          },
          select: {
            id: true,
          },
        } : false,
      },
    });

    const productsWithWishlistStatus = products.map(product => ({
      ...product,
      isWishlisted: userId ? product.wishlistItems.length > 0 : false,
    }));

  return { stores, productsWithWishlistStatus }
}

