"use server"

import ProfilePage from "@/components/users/profile/UserProfile";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getStoreDetailsByUserId } from "../actions/store/action";
import { getOrderDetailsByUserId } from "../actions/order/action";
import { getUserById } from "../actions/user/action";
import UserNotFound from "@/components/users/profile/UserNotFound";


export default async function PlaceOrder() {

    const session = await getServerSession(authOptions);
    const userId = session?.user.id || "";

    if(userId==''){
        return (
            <UserNotFound/>
        )
    }

    const {store} = await getStoreDetailsByUserId(userId);

    const orders=await getOrderDetailsByUserId(userId)

    const {user}=await getUserById(userId)
  
    return (
      <>
      <ProfilePage orders={orders} storeDetails={store} user={user}/>
      </>
      )
  }