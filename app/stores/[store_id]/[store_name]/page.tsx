import StoreNavbar from "@/components/merchant/storethemes/StoreNavbar";
import StoresProductGrid from "@/components/merchant/storethemes/StoresProductGrid";

interface PageProps {
    params: {
      store_id: string
      store_name: string
    }
  }
  
export default async function StoreDetails({ params }: PageProps) {
  const { store_id } = params


    return(
        <>
        <StoreNavbar/>
        <StoresProductGrid  storeId={store_id || ""}   />
        </>
    )
}