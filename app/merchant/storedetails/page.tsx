import { Box } from "@mui/material";
import StoreDashboard from "@/components/merchant/storeinfo/StoreOverview";
import StoreDetailsNavBar from "@/components/merchant/storeinfo/StoreDetailsNavbar";
import { checkUserHasStore, getStoreById } from "@/app/actions/store/action";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProductsByStoreIdForMerchant } from "@/app/actions/products/action";
import MerchantProductCard from "@/components/merchant/storeinfo/AdminProductCard";

interface Store {
  address: string;
  id: string;
  name: string;
  logo: string;
  bannerImage: string | null;
  description: string;
  offerDescription: string | null;
  city: string;
  mapLink: string;
  ownerId: string;
}

const defaultStoreData: Store = {
  address: "",
  id: "",
  name: "",
  logo: "",
  bannerImage: null,
  description: "",
  offerDescription: null,
  city: "",
  mapLink: "",
  ownerId: "",
};

export default async function StorePage() {
  
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  let storeId;
  let storeName;
  

  if(userId)
  {
    const storedetails=await checkUserHasStore(userId)
    storeId=storedetails.storeId;
    storeName=storedetails.storeName;
  }



    const { store } = await getStoreById(storeId || "");
    const {products}=await getProductsByStoreIdForMerchant(storeId || "")


 



  return (
    <Box >
      <StoreDetailsNavBar storeName={storeName || ""} />
      <StoreDashboard initialStoreData={store || defaultStoreData} />
      <MerchantProductCard products={products || []} />

    </Box>
  );
}
