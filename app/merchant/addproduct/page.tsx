import { checkUserHasStore } from "@/app/actions/store/action";
import ProductCreationForm from "@/components/merchant/ProductCreationForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";


export default async  function AddProduct(){

    const session = await getServerSession(authOptions);
    const userid=session?.user.id;
    const {storeId}=await checkUserHasStore(userid||"");

    return(
        <>
        <ProductCreationForm storeId={storeId|| ""}/>
        </>
    )
}