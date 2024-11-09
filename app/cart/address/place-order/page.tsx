import React from 'react'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCartItems, getCartItemsByStore } from '@/app/actions/cart/action'
import OrderPreview from '@/components/users/cart/OrderPreview'





export default async function PlaceOrder() {


  const session = await getServerSession(authOptions);

const userId = session?.user.id;

const { stores,totalPrice,totalQuantity} = await getCartItemsByStore(userId ? userId : "null");



  return (
    <>
    <OrderPreview stores={stores} totalPrice={totalPrice}  totalQuantity={totalQuantity} userId={userId|| ""}/>
    </>
    )
}