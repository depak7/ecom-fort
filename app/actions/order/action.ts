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


/** Plain JSON shape for client components (no Prisma Decimal / Date objects). */
export type ProfileOrderAddress = {
  id: number
  name: string
  phoneNumber: string
  alternatePhoneNumber: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export type ProfileOrderLine = {
  id: number
  productId: string
  name: string
  productImage: string | null
  quantity: number
  unitPrice: string
  lineTotal: string
  size: string | null
  status: string
  statusLabel: string
  storeId: string
  storeName: string
}

export type ProfileOrder = {
  orderId: string
  createdAt: string
  updatedAt: string
  addressId: number
  address: ProfileOrderAddress | null
  items: ProfileOrderLine[]
  /** Sum of line quantities */
  itemCount: number
  /** Sum of line totals (rupees, two decimals) */
  total: string
  /** Raw status token(s), e.g. PENDING or PENDING · SHIPPED */
  status: string
  /** Human-readable for chips / headers */
  statusLabel: string
}

function moneyFromDecimal(price: unknown): number {
  if (typeof price === 'number') return price
  if (price && typeof price === 'object' && 'toString' in price) {
    return parseFloat((price as { toString: () => string }).toString())
  }
  return parseFloat(String(price))
}

function formatMoney2(n: number): string {
  if (Number.isNaN(n)) return '0.00'
  return n.toFixed(2)
}

function humanizeOrderStatus(s: string): string {
  const t = (s || '').trim()
  if (!t) return '—'
  return t
    .split(' · ')
    .map((part) => {
      const p = part.trim()
      if (!p) return part
      return p.charAt(0) + p.slice(1).toLowerCase().replace(/_/g, ' ')
    })
    .join(' · ')
}

export async function getOrderDetailsByUserId(userId: string): Promise<ProfileOrder[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      AddressId: true,
      total: true,
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          orderStatus: true,
          size: true,
          productId: true,
          storeId: true,
          product: { select: { id: true, name: true, productImage: true } },
          store: { select: { id: true, name: true } },
        },
      },
    },
  })

  if (!orders.length) return []

  const addressIds = Array.from(new Set(orders.map((o) => o.AddressId)))
  const addresses = await prisma.address.findMany({
    where: { id: { in: addressIds } },
  })
  const addrById = new Map(addresses.map((a) => [a.id, a]))

  return orders.map((order) => {
    const items: ProfileOrderLine[] = order.items.map((item) => {
      const unit = moneyFromDecimal(item.price)
      const line = unit * item.quantity
      const st = String(item.orderStatus)
      return {
        id: item.id,
        productId: item.productId,
        name: item.product?.name ?? 'Product unavailable',
        productImage: item.product?.productImage ?? null,
        quantity: item.quantity,
        unitPrice: formatMoney2(unit),
        lineTotal: formatMoney2(line),
        size: item.size,
        status: st,
        statusLabel: humanizeOrderStatus(st),
        storeId: item.storeId,
        storeName: item.store?.name ?? '—',
      }
    })

    const computedFromLines = items.reduce((acc, row) => acc + parseFloat(row.lineTotal), 0)
    const storedTotal = order.total != null ? Number(order.total) : NaN
    const totalNum =
      items.length > 0
        ? computedFromLines
        : !Number.isNaN(storedTotal)
          ? storedTotal
          : 0

    const statuses = order.items.map((i) => String(i.orderStatus))
    const unique = Array.from(new Set(statuses))
    const status =
      unique.length === 0 ? 'UNKNOWN' : unique.length === 1 ? unique[0] : unique.join(' · ')
    const statusLabel = humanizeOrderStatus(status)

    const addr = addrById.get(order.AddressId)
    const address: ProfileOrderAddress | null = addr
      ? {
          id: addr.id,
          name: addr.name,
          phoneNumber: addr.phoneNumber,
          alternatePhoneNumber: addr.alternatePhoneNumber,
          street: addr.street,
          city: addr.city,
          state: addr.state,
          postalCode: addr.postalCode,
          country: addr.country,
        }
      : null

    const itemCount = items.reduce((sum, row) => sum + row.quantity, 0)

    return {
      orderId: order.id,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      addressId: order.AddressId,
      address,
      items,
      itemCount,
      total: formatMoney2(totalNum),
      status,
      statusLabel,
    }
  })
}
