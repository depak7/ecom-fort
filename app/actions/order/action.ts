'use server'

import { prisma } from '@/database/index'
import { OrderStatus } from '@prisma/client'

export async function addOrders({ userId, address, stores }: any) {
  try {
    const addressId = address?.id.toString();
    const order = await prisma.order.create({
      data: {
        userId,
        Address: addressId,
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


export async function getOrderById(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true, // Optional: include product details
          },
        },
      },
    });

    if (!order) return { success: false, order: null };

    // Calculate total price and item count
    const total = order.items.reduce((sum, item) => {
      return sum + parseFloat(item.price.toString()) * item.quantity;
    }, 0);

    const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);

    return {
      success: true,
      order: {
        ...order,
        total,
        itemCount,
      },
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return { success: false, order: null };
  }
}



export async function getGroupedOrdersByStore(storeId: string) {
  try {
    console.log(storeId)
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            storeId: storeId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        items: {
          where: {
            storeId: storeId, // only include this store’s items
          },
          include: {
            product: true,
          },
        },
      },
    });

    return orders.map(order => ({
      orderId: order.id,
      createdAt: order.createdAt,
      address: order.Address,
      user: order.user,
      items: order.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        orderStatus: item.orderStatus,
      })),
    }));
  }
  catch (error) {
    console.log(error)
    return null;
  }
}

export async function updateOrderStatus(orderId: string, itemId: number, newStatus: string) {
  try {
    await prisma.orderItem.update({
      where: { id: itemId },
      data: {
        orderStatus: newStatus as OrderStatus,
      },
    })
  } catch (error) {
    console.error("Failed to update order status:", error)
    throw new Error("Failed to update order status")
  }
}
