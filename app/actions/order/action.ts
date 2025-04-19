'use server'

import { prisma } from '@/database/index'

export async function addOrders({ userId, address, stores }: any) {
  try {
    const addressId=address?.id.toString();
    const order = await prisma.order.create({
      data: {
        userId,
        Address:addressId,
        items: {
          create: stores.flatMap((store: any) =>
            store.items.map((item: any) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: parseFloat(item.price),
              storeId: store.id,
              orderStatus: 'PENDING'
            }))
          ),
        },
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId,
        },
      },
    })


    await prisma.cart.deleteMany({
      where: {
        userId,
      },
    })

    return { success: true, order }
  } catch (error) {
    console.error('Order Error:', error)
    return { success: false, error: 'Failed to place order' }
  }
}


export async function getOrderById(orderId: string, userId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId
      },
    });

    if (!order) return { success: false, order: null };

    return { success: true, order };
  } catch (error) {
    console.error("Error fetching order:", error);
    return { success: false, order: null };
  }
}
