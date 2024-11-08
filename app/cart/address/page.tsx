import DeliveryAddress from "@/components/users/cart/DeliveryAddress";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function(){


    const session = await getServerSession(authOptions);
    const userid=session?.user.id;



    return(
        <>
        <DeliveryAddress userId={userid || ""}/>
        </>
    )
  
}