import ProductGrid from "@/components/users/landing/showcase/ProductGrid";
import StoreGrid from "@/components/users/landing/showcase/StoreGrid";
import TitleCard from "@/components/users/landing/showcase/TitleCard";
import { getAllStores } from "./actions/store/action";

interface Store {
  id: string;
  name: string;
  logo: string | null;
  city: string;
  address:string;
  description: string;
}

export default async function Home() {
  const res=await getAllStores('')
  const stores: Store[] = (res.stores) || []; 

  return (
    <>
      <TitleCard />
      <StoreGrid stores={stores} /> {/* Passing stores array */}
      <ProductGrid />
    </>
  );
}
