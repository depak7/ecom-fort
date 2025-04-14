import React from 'react'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCartItems, getCartItemsByStore, getDefaultUserAddresses } from '@/app/actions/cart/action'
import OrderPreview from '@/components/users/cart/OrderPreview'





export default async function PlaceOrder() {


  const session = await getServerSession(authOptions);

  const userId = session?.user.id;

  const {stores,totalPrice,totalQuantity} = await getCartItemsByStore(userId ? userId : "null");
  const  { addresses }=await getDefaultUserAddresses(userId?userId:"");



  return (
    <>
    <OrderPreview stores={stores} totalPrice={totalPrice}  totalQuantity={totalQuantity} address={addresses} userId={userId|| ""}/>
    </>
    )
}