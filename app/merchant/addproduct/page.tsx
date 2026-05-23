import { checkUserHasStore } from "@/app/actions/store/action";
import ProductCreationForm from "@/components/merchant/ProductCreationForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async  function AddProduct(){

    const session = await getServerSession(authOptions);
    const userid=session?.user.id;

    if (!userid) {
        redirect("/signin?callbackUrl=/merchant/addproduct")
    }

    const {storeId}=await checkUserHasStore(userid);

    return(
        <>
        <ProductCreationForm storeId={storeId|| ""}/>
        </>
    )
}