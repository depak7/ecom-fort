"use server"

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getOrderById } from "../../actions/order/action";
import OrderConfirmation from "@/components/users/cart/OrderPlaced";
import OrderNotFound from "@/components/users/cart/OrderNotFound";

interface PlaceOrderProps {
    params: {
      orderId: string;
    };
  }

export default async function PlaceOrder({params}:PlaceOrderProps) {

    const session = await getServerSession(authOptions);
    const userId = session?.user.id || "";

    const { success, order } = await getOrderById(params.orderId);
  
    
      if (!success || !order || order.id !== params.orderId) {
      return(
        <OrderNotFound/>
      )
      }
  
    return (
      <>
      <OrderConfirmation order={order}/>
      </>
      )
  }