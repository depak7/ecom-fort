"use client"
import StoreNavbar from "@/components/merchant/storethemes/StoreNavbar";
import StoresProductGrid from "@/components/merchant/storethemes/StoresProductGrid";
import { useState } from "react";

interface StoreGridWrapperProps {
  storeId: string;
  storeName: string;
  userId: string | null;
}

export default function StoreGridWrapper({
  storeId,
  storeName,
  userId,
}: StoreGridWrapperProps) {
  const [sortOption, setSortOption] = useState<string>("new-arrivals");

  return (
    <>
      <StoreNavbar onSortChange={(sort) => setSortOption(sort)} />
      <StoresProductGrid storeId={storeId || ""} sort={sortOption} userId={userId || null} />
    </>
  );
}
