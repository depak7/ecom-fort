import { checkUserHasStore } from "@/app/actions/store/action";
import ProductCreationForm from "@/components/merchant/ProductCreationForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

export default async  function(){

    const session = await getServerSession(authOptions);
    const userid=session?.user.id;
    const {storeId,storeName}=await checkUserHasStore(userid||"");

    return(
        <>
        <ProductCreationForm storeId={storeId|| ""}  storeName={storeName||""}/>
        </>
    )
}