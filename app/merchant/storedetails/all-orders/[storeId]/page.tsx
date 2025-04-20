import { prisma } from '@/database'
import OrdersTable from "@/components/users/cart/AllOrders"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OrderNotFound from '@/components/users/cart/OrderNotFound'

interface OrdersPageProps {
  params: { storeId: string }
}

export default async function AllOrdersPage({ params }: OrdersPageProps) {
  const { storeId } = params
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { ownerId: true },
  })

  if (!store || store.ownerId !== userId) {
    return <OrderNotFound />
  }


  // Fetch all orderItems related to the store
  const orderItems = await prisma.orderItem.findMany({
    where: { storeId },
    include: {
      order: {
        include: {
          user: true,
        },
      },
      product: true,
    },
  })

  // Group items by orderId
  const orderMap = new Map<string, any>()

  for (const item of orderItems) {
    const orderId = item.orderId
    if (!orderMap.has(orderId)) {
      orderMap.set(orderId, {
        id: item.order.id,
        userId: item.order.userId,
        userName: item.order.user?.name || "Unknown User",
        createdAt: item.order.createdAt,
        updatedAt: item.order.updatedAt,
        address: await getFullAddress(item.order.Address),
        items: [],
      })
    }

    orderMap.get(orderId).items.push({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      productName: item.product?.name || "Unknown Product",
      quantity: item.quantity,
      orderStatus: item.orderStatus,
      price: item.price.toString(),
      storeId: item.storeId,
    })
  }


  async function getFullAddress(addressId: string) {
    const address = await prisma.address.findUnique({
      where: { id: parseInt(addressId) },
    });
  
    return address
      ? `${address.street}, ${address.city}, ${address.state} - ${address.postalCode},
      ${address.phoneNumber} ,${address.alternatePhoneNumber} `
      : "Unknown Address";
  }

  const formattedOrders = Array.from(orderMap.values())

  const { updateOrderStatus } = await import('@/app/actions/order/action')

  return <OrdersTable initialOrders={formattedOrders} onStatusChange={updateOrderStatus} />
}
