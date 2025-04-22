"use server"

import StoreGridWrapper from "@/components/users/stores/StoreGridWrapper";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

interface PageProps {
  params: {
    store_id: string;
    store_name: string;
  };
}

export default async function StoreDetails({ params }: PageProps) {

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const storeId=params.store_id
  const storeName=params.store_name


  return (
    <>
       <StoreGridWrapper
      storeId={storeId}
      storeName={storeName}
      userId={userId || null}
    />
    </>
  );
}

