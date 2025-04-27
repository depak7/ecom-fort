'use server'

import { prisma } from '@/database/index'
import { OrderStatus } from '@prisma/client'

export async function addOrders({ userId, address, stores }: any) {
  try {
    const addressId = address?.id;
    const order = await prisma.order.create({
      data: {
        userId,
        AddressId: addressId,
        items: {
          create: stores.flatMap((store: any) =>
            store.items.map((item: any) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: parseFloat(item.price),
              storeId: store.id,
              orderStatus: 'PENDING',
              size: item.size?.name || null  // Changed to use size name string
            }))
          ),
        },
      },
      include: {
        items: {  // Ensure this is included to fetch order items
          include: {
            product: {  // Include product and its variants
              include: {
                variants: true,  // Include variants related to the product
              },
            },
            store: true,    // Ensure related store is included
          },
        },
      },
    });

    for (const store of stores) {
      for (const item of store.items) {
        await prisma.variantSize.updateMany({
          where: {
            variant: {
              productId: item.product.id,
              color: item.variant.color
            },
            size: item.size.name
          },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }
    }

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

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    const shippingAddress = await prisma.address.findUnique({
      where: {
        id: address?.id
      }
    })

    console.log(order)
    console.log(order.items[0].product.variants[0].variantImage)
    console.log(order.items[0])

    const orderDetails = {
      orderId: order.id,
      userName: user?.name,
      userEmail: user?.email,
      storeOwnerEmail: order.items[0].store.email,
      shippingAddress,
      orderedItems: order.items.map((item: any) => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        storeName: item.store.name,
        productImage: item.product.productImage,
      })),
      totalAmount: Math.round(order.items.reduce((total: number, item: any) => total + parseFloat(item.price.toString()) * item.quantity, 0)),  // Round total amount to nearest integer
    };


    return { success: true, order: orderDetails };
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



export async function getGroupedOrdersByStore(storeId: string | null) {
  try {
    if (storeId != null) {
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
              storeId: storeId, // only include this store's items
            },
            include: {
              product: true,
            },
          },
        },
      });
      return {
        success: true,
        orders: orders.map(order => ({
          orderId: order.id,
          createdAt: order.createdAt,
          address: order.AddressId,
          user: order.user,
          items: order.items.map(item => ({
            product: item.product,
            quantity: item.quantity,
            price: item.price,
            orderStatus: item.orderStatus,
          })),
        }))
      };
    }
  }
  catch (error) {
    console.log(error)
  }
  return { success: false };
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


export async function getOrderDetailsByUserId(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    select: {
      id: true,
      createdAt: true,
      AddressId: true,
      items: {
        select: {
          product: {
            select: { name: true },
          },
          quantity: true,
          price: true,
          orderStatus: true,
        },
      },
    },
  })

  if (!orders || orders.length === 0) return []

  return orders.map(order => {
    const total = order.items.reduce((acc, item) => {
      return acc + Number(item.price) * item.quantity
    }, 0)

    return {
      orderId: order.id,
      date: order.createdAt,
      address: order.AddressId,
      items: order.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        status: item.orderStatus,
      })),
      total: total.toFixed(2),
      status: order.items.length > 0 ? order.items[0].orderStatus : "Unknown",
    }
  })
}
